<?php declare(strict_types=1);

namespace Gamecon\Admin\Modules\Aktivity\Export;

use Gamecon\Admin\Modules\Aktivity\Export\Exceptions\ActivitiesExportException;
use Gamecon\Admin\Modules\Aktivity\GoogleSheets\GoogleDriveService;
use Gamecon\Admin\Modules\Aktivity\GoogleSheets\GoogleSheetsService;

class ExporterAktivit
{

  private const EXPORT_DIR = '/admin.gamecon.cz/aktivity';
  private const EXPORT_DIR_TAG = 'root-export-dir';

  /**
   * @var GoogleDriveService
   */
  private $googleDriveService;
  /**
   * @var GoogleSheetsService
   */
  private $googleSheetsService;
  /**
   * @var int
   */
  private $userId;

  public function __construct(
    int $userId,
    GoogleDriveService $googleDriveService,
    GoogleSheetsService $googleSheetsService
  ) {
    $this->googleDriveService = $googleDriveService;
    $this->googleSheetsService = $googleSheetsService;
    $this->userId = $userId;
  }

  /**
   * @param array|\Aktivita[] $aktivity
   * @param string $prefix
   * @return string Name of exported file
   */
  public function exportujAktivity(array $aktivity, string $prefix): string {
    $data = $this->getActivityData($aktivity);
    $sheetTitle = $this->getSheetTitle($aktivity, $prefix);
    $spreadSheet = $this->createSheetForActivities($sheetTitle);
    $this->saveData($data, $spreadSheet);
    $this->moveSpreadsheetToExportDir($spreadSheet);
    return $sheetTitle;
  }

  /**
   * @param \Aktivita[] $aktivity
   * @return array
   */
  private function getActivityData(array $aktivity): array {
    $data[] = [
      'ID aktivity',
      'Programová linie',
      'Název',
      'URL',
      'Krátká anotace',
      'Tagy',
      'Dlouhá anotace',
      'Den',
      'Začátek',
      'Konec',
      'Místnost',
      'Vypravěči',
      'Kapacita unisex',
      'Kapacita muži',
      'Kapacita ženy',
      'Je týmová',
      'Minimální kapacita týmu',
      'Maximální kapacita týmu',
      'Cena',
      'Bez slev',
      'Vybavení',
      'Stav',
    ];
    foreach ($aktivity as $aktivita) {
      $zacatekDen = $aktivita->zacatek()
        ? $aktivita->zacatek()->format('l')
        : '';
      $konecDen = $aktivita->konec()
        ? $aktivita->konec()->format('l')
        : '';
      $zacatekCas = $aktivita->zacatek()
        ? $aktivita->zacatek()->format('G:i')
        : '';
      $zacatekCas = preg_replace('~:00$~', '', $zacatekCas);
      $konecCas = $aktivita->konec()
        ? $aktivita->konec()->format('G:i')
        : '';
      $konecCas = preg_replace('~:00$~', '', $konecCas);
      if (($zacatekDen !== '' || $konecDen !== '')
        && $zacatekDen !== $konecDen
        && ($konecCas !== '0' // midnight
          || $aktivita->zacatek()->modify('+1 day')->format('Ymd') !== $aktivita->konec()->format('Ymd') // end on midnight is OK (like čtvrtek 10:00...pátek 0:00)
        )
      ) {
        throw new ActivitiesExportException(
          "Aktivita by neměla začínat a končit v jiný den: začátek '$zacatekDen':'$zacatekCas', konec '$konecDen':'$konecCas' u aktivity {$aktivita->id()} ({$aktivita->nazev()})"
        );
      }
      $data[] = [
        $aktivita->id(), // ID aktivity
        $aktivita->typ()->nazev(), // Programová linie
        $aktivita->nazev(), // Název
        $aktivita->urlId(), // URL
        $aktivita->kratkyPopis(), // Krátká anotace
        implode(',', $aktivita->tagy()), // Tagy
        $aktivita->getPopisRaw(), // Dlouhá anotace
        $zacatekDen, // Den
        $zacatekCas, // Začátek
        $konecCas, // Konec
        $aktivita->lokace()->nazev(), // Místnost
        implode(',', $aktivita->getOrganizatoriIds()), // Vypravěči
        $aktivita->getKapacitaUnisex(), // Kapacita unisex
        $aktivita->getKapacitaMuzu(), // Kapacita muži
        $aktivita->getKapacitaZen(), // Kapacita ženy
        $aktivita->tymova() // Je týmová
          ? 'ano'
          : 'ne',
        $aktivita->tymMinKapacita() ?? '', // Minimální kapacita týmu
        $aktivita->tymMaxKapacita() ?? '', // Maximální kapacita týmu
        (float)$aktivita->cenaZaklad(), // Cena
        $aktivita->bezSlevy() // Bez slev
          ? 'ano'
          : 'ne',
        (string)$aktivita->vybaveni(), // Vybavení
        $aktivita->getStavNazev(), // Stav
      ];
    }
    return $data;
  }

  private function saveData(array $values, \Google_Service_Sheets_Spreadsheet $spreadsheet) {
    $this->googleSheetsService->setValuesInSpreadsheet($values, $spreadsheet->getSpreadsheetId());
  }

  private function createSheetForActivities(string $sheetTitle): \Google_Service_Sheets_Spreadsheet {
    $newSpreadsheet = $this->googleSheetsService->createNewSpreadsheet($sheetTitle);
    $this->googleSheetsService->setFirstRowAsHeader($newSpreadsheet->getSpreadsheetId());
    return $newSpreadsheet;
  }

  private function getSheetTitle(array $aktivity, string $prefix): string {
    $activitiesTypeNames = $this->getActivitiesUniqueTypeNames($aktivity);
    sort($activitiesTypeNames);
    return sprintf('%d %s - %s', $prefix, implode(' a ', $activitiesTypeNames), date('j. n. Y H:i:s'));
  }

  /**
   * @param array $aktivity
   * @return array|string[]
   */
  private function getActivitiesUniqueTypeNames(array $aktivity): array {
    return array_unique(
      array_map(
        static function (\Aktivita $aktivita) {
          return $aktivita->typ()->nazev();
        },
        $aktivity
      )
    );
  }

  private function moveSpreadsheetToExportDir(\Google_Service_Sheets_Spreadsheet $spreadsheet) {
    $this->googleDriveService->moveFileToDir($spreadsheet->getSpreadsheetId(), $this->getExportDirId());
  }

  private function getExportDirId(): string {
    $wrappedRootExportDir = $this->googleDriveService->getLocalDirsReferencesByUserIdAndTag($this->userId, self::EXPORT_DIR_TAG);
    if ($wrappedRootExportDir) {
      $rootExportDir = reset($wrappedRootExportDir);
      $rootExportDirId = $rootExportDir->getGoogleDirId();
      if ($this->googleDriveService->dirByIdExists($rootExportDirId)) {
        return $rootExportDirId;
      }
      $this->googleDriveService->deleteLocalDirReferenceByDirId($rootExportDirId);
    }
    $createdDir = $this->createDirForGameconExport();
    return $createdDir->getId();
  }

  private function createDirForGameconExport(): \Google_Service_Drive_DriveFile {
    $exportDirName = self::EXPORT_DIR;
    if ($this->googleDriveService->dirExists($exportDirName)) {
      $exportDirName = uniqid($exportDirName, true);
    }
    $createdDir = $this->googleDriveService->createDir($exportDirName);
    $this->googleDriveService->saveDirReferenceLocally($createdDir, $this->userId, self::EXPORT_DIR_TAG);
    return $createdDir;
  }
}
