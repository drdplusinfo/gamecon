<?php declare(strict_types=1);

namespace Gamecon\Admin\Modules\Aktivity\Import;

class ImagesImporter
{

  /**
   * @var string
   */
  private $baseUrl;
  /**
   * @var ImportValuesDescriber
   */
  private $importValuesDescriber;

  public function __construct(string $baseUrl, ImportValuesDescriber $importValuesDescriber) {
    $this->baseUrl = $baseUrl;
    $this->importValuesDescriber = $importValuesDescriber;
  }

  public function saveImages(array $potentialImageUrlsPerActivity): ImportStepResult {
    if (count($potentialImageUrlsPerActivity) === 0) {
      return ImportStepResult::success(null);
    }
    $warnings = [];
    $imageUrls = [];
    /** @var \Aktivita[] $imageUrlsToActivity */
    $imageUrlsToActivity = [];
    /** @var \Aktivita[] $activities */
    $activities = [];
    $activityIds = array_keys($potentialImageUrlsPerActivity);
    foreach (\Aktivita::zIds($activityIds) as $activity) {
      $activities[$activity->id()] = $activity;
      unset($activity);
    }
    foreach ($potentialImageUrlsPerActivity as $activityId => $potentialImageUrls) {
      $activity = $activities[$activityId];
      foreach ($potentialImageUrls as $potentialImageUrl) {
        // Image URL is same as current, therefore came from an export and there is no change from it
        if ($potentialImageUrl === $activity->urlObrazku($this->baseUrl)) {
          continue;
        }
        $imageUrls[] = $potentialImageUrl;
        $imageUrlsToActivity[$potentialImageUrl] = $activity;
        unset($activity);
      }
    }
    $imageUrls = array_unique($imageUrls);
    ['files' => $downloadedImages, 'errors' => $downloadingImagesErrors] = hromadneStazeni($imageUrls, 10);
    if (count($downloadingImagesErrors) > 0) {
      $warnings[] = sprintf('Některé obrázky se nepodařilo stáhnout: %s', implode(', ', $downloadingImagesErrors));
    }
    foreach ($downloadedImages as $imageUrl => $downloadedImage) {
      $activity = $imageUrlsToActivity[$imageUrl];
      try {
        $obrazek = \Obrazek::zSouboru($downloadedImage);
        $activity->obrazek($obrazek);
      } catch (\ObrazekException $obrazekException) {
        $warnings[] = sprintf(
          'Nepodařilo se uložit obrázek %s k aktivitě %s z důvodu: %s',
          $imageUrl,
          $this->importValuesDescriber->describeActivity($activity), $obrazekException->getMessage()
        );
        continue;
      }
    }
    return ImportStepResult::successWithWarnings(true, $warnings);
  }
}