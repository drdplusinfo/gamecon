<?php declare(strict_types=1);

namespace Gamecon\Admin\Modules\Aktivity\Import;

use Gamecon\Admin\Modules\Aktivity\Export\ExportAktivitSloupce;
use Gamecon\Admin\Modules\Aktivity\Import\Exceptions\DuplicatedUnifiedKeyException;
use Gamecon\Cas\DateTimeGamecon;

class ImportValuesValidator
{

  /**
   * @var array|\Typ[][]
   */
  private $programLinesCache;
  /**
   * @var array|\Typ[][]
   */
  private $programLocationsCache;
  /**
   * @var array|\Tag[][]
   */
  private $tagsCache;
  /**
   * @var array|\Stav[][]
   */
  private $StatesCache;
  /**
   * @var \Uzivatel[]
   */
  private $storytellersCache;
  /**
   * @var array|int[]
   */
  private $keyUnifyDepth = ['storytellers' => ['fromName' => ImportKeyUnifier::UNIFY_UP_TO_LETTERS, 'fromNick' => ImportKeyUnifier::UNIFY_UP_TO_LETTERS]];
  /**
   * @var ImportValuesDescriber
   */
  private $importValuesDescriber;
  /**
   * @var int
   */
  private $currentYear;

  public function __construct(
    ImportValuesDescriber $importValuesDescriber,
    int $currentYear
  ) {
    $this->importValuesDescriber = $importValuesDescriber;
    $this->currentYear = $currentYear;
  }

  public function validateValues(\Typ $singleProgramLine, array $activityValues, ?\Aktivita $originalActivity): ImportStepResult {
    $sanitizedValues = [];
    if ($originalActivity) {
      $sanitizedValues = $originalActivity->rawDb();
      // remove values originating in another tables
      $sanitizedValues = array_intersect_key(
        $sanitizedValues,
        array_fill_keys(AktivitaSqlSloupce::vsechnySloupce(), true)
      );
    }
    $tagIds = null;
    $storytellersIds = null;

    $sanitizedValues[AktivitaSqlSloupce::ID_AKCE] = $originalActivity
      ? $originalActivity->id()
      : null;

    $programLineIdResult = $this->getValidatedProgramLineId($activityValues, $originalActivity);
    if ($programLineIdResult->isError()) {
      return ImportStepResult::error($programLineIdResult->getError());
    }
    $sanitizedValues[AktivitaSqlSloupce::TYP] = $programLineIdResult->getSuccess();
    unset($programLineIdResult);

    $activityUrlResult = $this->getValidatedUrl($activityValues, $singleProgramLine, $originalActivity);
    if ($activityUrlResult->isError()) {
      return ImportStepResult::error($activityUrlResult->getError());
    }
    $activityUrl = $activityUrlResult->getSuccess();
    $sanitizedValues[AktivitaSqlSloupce::URL_AKCE] = $activityUrl;
    unset($activityUrlResult);

    $activityNameResult = $this->getValidatedActivityName($activityValues, $activityUrl, $singleProgramLine, $originalActivity);
    if ($activityNameResult->isError()) {
      return ImportStepResult::error($activityNameResult->getError());
    }
    $sanitizedValues[AktivitaSqlSloupce::NAZEV_AKCE] = $activityNameResult->getSuccess();
    unset($activityNameResult);

    $shortAnnotationResult = $this->getValidatedShortAnnotation($activityValues, $originalActivity);
    if ($shortAnnotationResult->isError()) {
      return ImportStepResult::error($shortAnnotationResult->getError());
    }
    $sanitizedValues[AktivitaSqlSloupce::POPIS_KRATKY] = $shortAnnotationResult->getSuccess();
    unset($shortAnnotationResult);

    $tagIdsResult = $this->getValidatedTagIds($activityValues, $originalActivity);
    if ($tagIdsResult->isError()) {
      return ImportStepResult::error($tagIdsResult->getError());
    }
    $tagIds = $tagIdsResult->getSuccess();
    unset($tagIdsResult);

    $longAnnotationResult = $this->getValidatedLongAnnotation($activityValues, $originalActivity);
    if ($longAnnotationResult->isError()) {
      return ImportStepResult::error($longAnnotationResult->getError());
    }
    $longAnnotation = $longAnnotationResult->getSuccess();
    unset($longAnnotationResult);

    $activityStartResult = $this->getValidatedStart($activityValues, $originalActivity);
    if ($activityStartResult->isError()) {
      return ImportStepResult::error($activityStartResult->getError());
    }
    $sanitizedValues[AktivitaSqlSloupce::ZACATEK] = $activityStartResult->getSuccess();
    unset($activityStartResult);

    $activityEndResult = $this->getValidatedEnd($activityValues, $originalActivity);
    if ($activityEndResult->isError()) {
      return ImportStepResult::error($activityEndResult->getError());
    }
    $sanitizedValues[AktivitaSqlSloupce::KONEC] = $activityEndResult->getSuccess();
    unset($activityEndResult);

    $locationIdResult = $this->getValidatedLocationId($activityValues, $originalActivity);
    if ($locationIdResult->isError()) {
      return ImportStepResult::error($locationIdResult->getError());
    }
    $sanitizedValues[AktivitaSqlSloupce::LOKACE] = $locationIdResult->getSuccess();
    unset($locationIdResult);

    $storytellersIdsResult = $this->getValidatedStorytellersIds($activityValues, $originalActivity);
    if ($storytellersIdsResult->isError()) {
      return ImportStepResult::error($storytellersIdsResult->getError());
    }
    $storytellersIds = $storytellersIdsResult->getSuccess();
    unset($storytellersIdsResult);

    $unisexCapacityResult = $this->getValidatedUnisexCapacity($activityValues, $originalActivity);
    if ($unisexCapacityResult->isError()) {
      return ImportStepResult::error($unisexCapacityResult->getError());
    }
    $sanitizedValues[AktivitaSqlSloupce::KAPACITA] = $unisexCapacityResult->getSuccess();
    unset($unisexCapacityResult);

    $menCapacityResult = $this->getValidatedMenCapacity($activityValues, $originalActivity);
    if ($menCapacityResult->isError()) {
      return ImportStepResult::error($menCapacityResult->getError());
    }
    $sanitizedValues[AktivitaSqlSloupce::KAPACITA_M] = $menCapacityResult->getSuccess();
    unset($menCapacityResult);

    $womenCapacityResult = $this->getValidatedWomenCapacity($activityValues, $originalActivity);
    if ($womenCapacityResult->isError()) {
      return ImportStepResult::error($womenCapacityResult->getError());
    }
    $sanitizedValues[AktivitaSqlSloupce::KAPACITA_F] = $womenCapacityResult->getSuccess();
    unset($womenCapacityResult);

    $forTeamResult = $this->getValidatedForTeam($activityValues, $originalActivity);
    if ($forTeamResult->isError()) {
      return ImportStepResult::error($forTeamResult->getError());
    }
    $sanitizedValues[AktivitaSqlSloupce::TEAMOVA] = $forTeamResult->getSuccess();
    unset($forTeamResult);

    $minimalTeamCapacityResult = $this->getValidatedMinimalTeamCapacity($activityValues, $originalActivity);
    if ($minimalTeamCapacityResult->isError()) {
      return ImportStepResult::error($minimalTeamCapacityResult->getError());
    }
    $sanitizedValues[AktivitaSqlSloupce::TEAM_MIN] = $minimalTeamCapacityResult->getSuccess();
    unset($minimalTeamCapacityResult);

    $maximalTeamCapacityResult = $this->getValidatedMaximalTeamCapacity($activityValues, $originalActivity);
    if ($maximalTeamCapacityResult->isError()) {
      return ImportStepResult::error($maximalTeamCapacityResult->getError());
    }
    $sanitizedValues[AktivitaSqlSloupce::TEAM_MAX] = $maximalTeamCapacityResult->getSuccess();
    unset($maximalTeamCapacityResult);

    $priceResult = $this->getValidatedPrice($activityValues, $originalActivity);
    if ($priceResult->isError()) {
      return ImportStepResult::error($priceResult->getError());
    }
    $sanitizedValues[AktivitaSqlSloupce::CENA] = $priceResult->getSuccess();
    unset($priceResult);

    $withoutDiscountResult = $this->getValidatedWithoutDiscount($activityValues, $originalActivity);
    if ($withoutDiscountResult->isError()) {
      return ImportStepResult::error($withoutDiscountResult->getError());
    }
    $sanitizedValues[AktivitaSqlSloupce::BEZ_SLEVY] = $withoutDiscountResult->getSuccess();
    unset($withoutDiscountResult);

    $equipmentResult = $this->getValidatedEquipment($activityValues, $originalActivity);
    if ($equipmentResult->isError()) {
      return ImportStepResult::error($equipmentResult->getError());
    }
    $sanitizedValues[AktivitaSqlSloupce::VYBAVENI] = $equipmentResult->getSuccess();
    unset($equipmentResult);

    $stateIdResult = $this->getValidatedStateId($activityValues, $originalActivity);
    if ($stateIdResult->isError()) {
      return ImportStepResult::error($stateIdResult->getError());
    }
    $sanitizedValues[AktivitaSqlSloupce::STAV] = $stateIdResult->getSuccess();
    unset($stateIdResult);

    $yearResult = $this->getValidatedYear($originalActivity);
    if ($yearResult->isError()) {
      return ImportStepResult::error($yearResult->getError());
    }
    $sanitizedValues[AktivitaSqlSloupce::ROK] = $yearResult->getSuccess();
    unset($yearResult);

    $instanceIdResult = $this->getValidatedInstanceId($originalActivity);
    if ($instanceIdResult->isError()) {
      return ImportStepResult::error($instanceIdResult->getError());
    }
    $sanitizedValues[AktivitaSqlSloupce::PATRI_POD] = $instanceIdResult->getSuccess();
    unset($instanceIdResult);

    $potentialImageUrlsResult = $this->getPotentialImageUrls($activityValues, $activityUrl);
    if ($potentialImageUrlsResult->isError()) {
      return ImportStepResult::error($potentialImageUrlsResult->getError());
    }
    $potentialImageUrls = $potentialImageUrlsResult->getSuccess();
    unset($potentialImageUrlsResult);

    return ImportStepResult::success([
      'values' => $sanitizedValues,
      'longAnnotation' => $longAnnotation,
      'storytellersIds' => $storytellersIds,
      'tagIds' => $tagIds,
      'potentialImageUrls' => $potentialImageUrls,
    ]);
  }

  private function getPotentialImageUrls(array $activityValues, string $activityUrl): ImportStepResult {
    $imageUrl = $activityValues[ExportAktivitSloupce::OBRAZEK] ?? null;
    if (!$imageUrl) {
      return ImportStepResult::success([]);
    }
    if (preg_match('~[.](jpg|png|gif)$~i', $imageUrl)) {
      return ImportStepResult::success([$imageUrl]);
    }
    $imageUrlWithoutExtension = rtrim($imageUrl, '/') . '/' . $activityUrl;
    return ImportStepResult::success([
      $imageUrlWithoutExtension . '.jpg',
      $imageUrlWithoutExtension . '.png',
      $imageUrlWithoutExtension . '.gif',
    ]);
  }

  private function getValidatedStateId(array $activityValues, ?\Aktivita $originalActivity): ImportStepResult {
    $stateValue = $activityValues[ExportAktivitSloupce::STAV] ?? null;
    if ((string)$stateValue === '') {
      return ImportStepResult::success($originalActivity && $originalActivity->stav()
        ? $originalActivity->stav()->id()
        : \Stav::NOVA
      );
    }
    $state = $this->getStateFromValue((string)$stateValue);
    if ($state) {
      return ImportStepResult::success($state->id());
    }
    return ImportStepResult::error(sprintf(
      "Neznámý stav '%s' u aktivity %s",
      $stateValue,
      $this->importValuesDescriber->describeActivityByInputValues($activityValues, $originalActivity)
    ));
  }

  private function getStateFromValue(string $StateValue): ?\Stav {
    $StateInt = (int)$StateValue;
    if ($StateInt > 0) {
      return $this->getStateById($StateInt);
    }
    return $this->getStateByName($StateValue);
  }

  private function getStateById(int $id): ?\Stav {
    return $this->getStatesCache()['id'][$id] ?? null;
  }

  private function getStateByName(string $name): ?\Stav {
    return $this->getStatesCache()['keyFromName'][ImportKeyUnifier::toUnifiedKey(mb_substr($name, 0, 3, 'UTF-8'), [])] ?? null;
  }

  private function getStatesCache(): array {
    if (!$this->StatesCache) {
      $this->StatesCache = ['id' => [], 'keyFromName' => []];
      $States = \Stav::zVsech();
      foreach ($States as $State) {
        $this->StatesCache['id'][$State->id()] = $State;
        $keyFromName = ImportKeyUnifier::toUnifiedKey(mb_substr($State->nazev(), 0, 3, 'UTF-8'), array_keys($this->StatesCache['keyFromName']));
        $this->StatesCache['keyFromName'][$keyFromName] = $State;
      }
    }
    return $this->StatesCache;
  }

  private function getValidatedEquipment(array $activityValues, ?\Aktivita $originalActivity): ImportStepResult {
    $equipmentValue = $activityValues[ExportAktivitSloupce::VYBAVENI] ?? null;
    if ((string)$equipmentValue === '') {
      return ImportStepResult::success($originalActivity
        ? $originalActivity->vybaveni()
        : ''
      );
    }
    return ImportStepResult::success($equipmentValue);
  }

  private function getValidatedMinimalTeamCapacity(array $activityValues, ?\Aktivita $originalActivity): ImportStepResult {
    $minimalTeamCapacityValue = $activityValues[ExportAktivitSloupce::MINIMALNI_KAPACITA_TYMU] ?? null;
    if ((string)$minimalTeamCapacityValue === '') {
      return ImportStepResult::success($originalActivity
        ? $originalActivity->tymMinKapacita()
        : 0
      );
    }
    $minimalTeamCapacity = (int)$minimalTeamCapacityValue;
    if ($minimalTeamCapacity > 0) {
      return ImportStepResult::success($minimalTeamCapacity);
    }
    if ((string)$minimalTeamCapacityValue === '0') {
      return ImportStepResult::success(0);
    }
    return ImportStepResult::error(sprintf(
      "Podivná minimální kapacita týmu '%s' u aktivity %s. Očekáváme celé kladné číslo.",
      $minimalTeamCapacityValue,
      $this->importValuesDescriber->describeActivityByInputValues($activityValues, $originalActivity)
    ));
  }

  private function getValidatedMaximalTeamCapacity(array $activityValues, ?\Aktivita $originalActivity): ImportStepResult {
    $maximalTeamCapacityValue = $activityValues[ExportAktivitSloupce::MAXIMALNI_KAPACITA_TYMU] ?? null;
    if ((string)$maximalTeamCapacityValue === '') {
      return ImportStepResult::success($originalActivity
        ? $originalActivity->tymMaxKapacita()
        : 0
      );
    }
    $maximalTeamCapacity = (int)$maximalTeamCapacityValue;
    if ($maximalTeamCapacity > 0) {
      return ImportStepResult::success($maximalTeamCapacity);
    }
    if ((string)$maximalTeamCapacityValue === '0') {
      return ImportStepResult::success(0);
    }
    return ImportStepResult::error(sprintf(
      "Podivná maximální kapacita týmu '%s' u aktivity %s. Očekáváme celé kladné číslo.",
      $maximalTeamCapacityValue,
      $this->importValuesDescriber->describeActivityByInputValues($activityValues, $originalActivity)
    ));
  }

  private function getValidatedForTeam(array $activityValues, ?\Aktivita $originalActivity): ImportStepResult {
    $forTeamValue = $activityValues[ExportAktivitSloupce::JE_TYMOVA] ?? null;
    if ((string)$forTeamValue === '') {
      return ImportStepResult::success(
        $originalActivity && $originalActivity->tymova()
          ? 1
          : 0
      );
    }
    $forTeam = $this->parseBoolean($forTeamValue);
    if ($forTeam !== null) {
      return ImportStepResult::success(
        $forTeam
          ? 1
          : 0
      );
    }
    return ImportStepResult::error(sprintf(
      "Podivný zápis, zda je aktivita týmová '%s' u aktivity %s. Očekáváme pouze 1, 0, ano, ne.",
      $forTeamValue,
      $this->importValuesDescriber->describeActivityByInputValues($activityValues, $originalActivity)
    ));
  }

  private function getValidatedStorytellersIds(array $activityValues, ?\Aktivita $originalActivity): ImportStepResult {
    $storytellersString = $activityValues[ExportAktivitSloupce::VYPRAVECI] ?? null;
    if (!$storytellersString) {
      return ImportStepResult::success($originalActivity
        ? $originalActivity->getOrganizatoriIds()
        : []
      );
    }
    $storytellersIds = [];
    $invalidStorytellersValues = [];
    $storytellersValues = array_map('trim', explode(',', $storytellersString));
    foreach ($storytellersValues as $storytellerValue) {
      $storyteller = $this->getStorytellerFromValue($storytellerValue);
      if (!$storyteller) {
        $invalidStorytellersValues[] = $storytellerValue;
      } else {
        $storytellersIds[] = $storyteller->id();
      }
    }
    if ($invalidStorytellersValues) {
      return ImportStepResult::error(sprintf(
        'Neznámí vypravěči %s pro aktivitu %s.',
        implode(',', array_map(static function (string $invalidStorytellerValue) {
          return "'$invalidStorytellerValue'";
        }, $invalidStorytellersValues)),
        $this->importValuesDescriber->describeActivityByInputValues($activityValues, $originalActivity)
      ));
    }
    return ImportStepResult::success($storytellersIds);
  }

  private function getStorytellerFromValue(string $storytellerValue): ?\Uzivatel {
    $storytellerInt = (int)$storytellerValue;
    if ($storytellerInt > 0) {
      return $this->getStorytellerById($storytellerInt);
    }
    return $this->getStorytellerByEmail($storytellerValue)
      ?? $this->getStorytellerByName($storytellerValue)
      ?? $this->getStorytellerByNick($storytellerValue);
  }

  private function getStorytellerById(int $id): ?\Uzivatel {
    return $this->getStorytellersCache()['id'][$id] ?? null;
  }

  private function getStorytellerByEmail(string $email): ?\Uzivatel {
    if (strpos($email, '@') === false) {
      return null;
    }
    $key = ImportKeyUnifier::toUnifiedKey($email, [], ImportKeyUnifier::UNIFY_UP_TO_SPACES);
    return $this->getStorytellersCache()['keyFromEmail'][$key] ?? null;
  }

  private function getStorytellerByName(string $name): ?\Uzivatel {
    $key = ImportKeyUnifier::toUnifiedKey($name, [], $this->keyUnifyDepth['storytellers']['fromName']);
    return $this->getStorytellersCache()['keyFromName'][$key] ?? null;
  }

  private function getStorytellerByNick(string $nick): ?\Uzivatel {
    $key = ImportKeyUnifier::toUnifiedKey($nick, [], $this->keyUnifyDepth['storytellers']['fromNick']);
    return $this->getStorytellersCache()['keyFromNick'][$key] ?? null;
  }

  private function getStorytellersCache(): array {
    if (!$this->storytellersCache) {
      $this->storytellersCache = ['id' => [], 'keyFromEmail' => [], 'keyFromName' => [], 'keyFromNick' => [], 'storytellers' => []];

      $storytellers = \Uzivatel::organizatori();

      foreach ($storytellers as $storyteller) {
        $this->storytellersCache['id'][$storyteller->id()] = $storyteller;
        $keyFromEmail = ImportKeyUnifier::toUnifiedKey($storyteller->mail(), array_keys($this->storytellersCache['keyFromEmail']), ImportKeyUnifier::UNIFY_UP_TO_SPACES);
        $this->storytellersCache['keyFromEmail'][$keyFromEmail] = $storyteller;
      }

      for ($nameKeyUnifyDepth = $this->keyUnifyDepth['storytellers']['fromName']; $nameKeyUnifyDepth >= 0; $nameKeyUnifyDepth--) {
        $keyFromNameCache = [];
        foreach ($storytellers as $storyteller) {
          $name = $storyteller->jmeno();
          if ($name === '') {
            continue;
          }
          try {
            $keyFromCivilName = ImportKeyUnifier::toUnifiedKey($name, array_keys($this->storytellersCache['keyFromName']), $nameKeyUnifyDepth);
            $keyFromNameCache[$keyFromCivilName] = $storyteller;
            // if unification was too aggressive and we had to lower level of depth / lossy compression, we have to store the lowest level for later picking-up values from cache
          } catch (DuplicatedUnifiedKeyException $unifiedKeyException) {
            continue 2; // lower key depth
          }
        }
        $this->storytellersCache['keyFromName'] = $keyFromNameCache;
        $this->keyUnifyDepth['storytellers']['fromName'] = min($this->keyUnifyDepth['storytellers']['fromName'], $nameKeyUnifyDepth);
        break; // all names converted to unified and unique keys
      }

      for ($nickKeyUnifyDepth = $this->keyUnifyDepth['storytellers']['fromNick']; $nickKeyUnifyDepth >= 0; $nickKeyUnifyDepth--) {
        $keyFromNickCache = [];
        foreach ($storytellers as $storyteller) {
          $nick = $storyteller->nick();
          if ($nick === '') {
            continue;
          }
          try {
            $keyFromNick = ImportKeyUnifier::toUnifiedKey($nick, array_keys($this->storytellersCache['keyFromNick']), $nickKeyUnifyDepth);
            $keyFromNickCache[$keyFromNick] = $storyteller;
            // if unification was too aggressive and we had to lower level of depth / lossy compression, we have to store the lowest level for later picking-up values from cache
          } catch (DuplicatedUnifiedKeyException $unifiedKeyException) {
            continue 2; // lower key depth
          }
        }
        $this->storytellersCache['keyFromNick'] = $keyFromNickCache;
        $this->keyUnifyDepth['storytellers']['fromNick'] = min($this->keyUnifyDepth['storytellers']['fromNick'], $nickKeyUnifyDepth);
        break; // all nicks converted to unified and unique keys
      }
    }
    return $this->storytellersCache;
  }

  private function getValidatedLongAnnotation(array $activityValues, ?\Aktivita $originalActivity): ImportStepResult {
    if (!empty($activityValues[ExportAktivitSloupce::DLOUHA_ANOTACE])) {
      return ImportStepResult::success($activityValues[ExportAktivitSloupce::DLOUHA_ANOTACE]);
    }
    return ImportStepResult::success($originalActivity
      ? $originalActivity->popis()
      : ''
    );
  }

  private function getValidatedTagIds(array $activityValues, ?\Aktivita $originalActivity): ImportStepResult {
    $tagsString = $activityValues[ExportAktivitSloupce::TAGY] ?? '';
    if ($tagsString === '' && $originalActivity) {
      $tagIds = [];
      $invalidTagsValues = [];
      foreach ($originalActivity->tagy() as $tagValue) {
        $tag = $this->getTagFromValue($tagValue);
        if (!$tag) {
          $invalidTagsValues[] = $tagValue;
        } else {
          $tagIds[] = $tag->id();
        }
      }
      if ($invalidTagsValues) {
        trigger_error(
          E_USER_WARNING,
          sprintf('There are some strange tags coming from activity %s, which are unknown %s', $originalActivity->id(), implode(',', $invalidTagsValues))
        );
      }
      return ImportStepResult::success($tagIds);
    }
    $tagIds = [];
    $invalidTagsValues = [];
    $tagsValues = array_map('trim', explode(',', $tagsString));
    foreach ($tagsValues as $tagValue) {
      if ($tagValue === '') {
        continue;
      }
      $tag = $this->getTagFromValue($tagValue);
      if (!$tag) {
        $invalidTagsValues[] = $tagValue;
      } else {
        $tagIds[] = $tag->id();
      }
    }
    if ($invalidTagsValues) {
      return ImportStepResult::error(
        sprintf(
          'U aktivity %s jsou neznámé tagy %s.',
          $this->importValuesDescriber->describeActivityByInputValues($activityValues, $originalActivity),
          implode(',', array_map(static function (string $invalidTagValue) {
              return "'$invalidTagValue'";
            },
              $invalidTagsValues
            )
          )
        )
      );
    }
    return ImportStepResult::success($tagIds);
  }

  private function getTagFromValue(string $tagValue): ?\Tag {
    $tagInt = (int)$tagValue;
    if ($tagInt > 0) {
      return $this->getTagById($tagInt);
    }
    return $this->getTagByName($tagValue);
  }

  private function getTagById(int $id): ?\Tag {
    return $this->getTagsCache()['id'][$id] ?? null;
  }

  private function getTagByName(string $name): ?\Tag {
    return $this->getTagsCache()['keyFromName'][ImportKeyUnifier::toUnifiedKey($name, [])] ?? null;
  }

  private function getTagsCache(): array {
    if (!$this->tagsCache) {
      $this->tagsCache = ['id' => [], 'keyFromName' => []];
      $tags = \Tag::zVsech();
      foreach ($tags as $tag) {
        $this->tagsCache['id'][$tag->id()] = $tag;
        $keyFromName = ImportKeyUnifier::toUnifiedKey($tag->nazev(), array_keys($this->tagsCache['keyFromName']));
        $this->tagsCache['keyFromName'][$keyFromName] = $tag;
      }
    }
    return $this->tagsCache;
  }

  private function getValidatedShortAnnotation(array $activityValues, ?\Aktivita $originalActivity): ImportStepResult {
    if (!empty($activityValues[ExportAktivitSloupce::KRATKA_ANOTACE])) {
      return ImportStepResult::success($activityValues[ExportAktivitSloupce::KRATKA_ANOTACE]);
    }
    return ImportStepResult::success($originalActivity
      ? $originalActivity->kratkyPopis()
      : ''
    );
  }

  private function getValidatedInstanceId(?\Aktivita $originalActivity): ImportStepResult {
    return ImportStepResult::success($this->findParentInstanceId($originalActivity));
  }

  private function getValidatedYear(?\Aktivita $originalActivity): ImportStepResult {
    if (!$originalActivity) {
      return ImportStepResult::success($this->currentYear);
    }
    $year = $originalActivity->zacatek()
      ? (int)$originalActivity->zacatek()->format('Y')
      : null;
    if (!$year) {
      $year = $originalActivity->konec()
        ? (int)$originalActivity->konec()->format('Y')
        : null;
    }
    if ($year) {
      if ($year !== $this->currentYear) {
        return ImportStepResult::error(sprintf(
          'Aktivita %s je pro ročník %d, ale teď je ročník %d.',
          $this->importValuesDescriber->describeActivity($originalActivity),
          $year,
          $this->currentYear
        ));
      }
      return ImportStepResult::success($year);
    }
    return ImportStepResult::success($this->currentYear);
  }

  private function getValidatedWithoutDiscount(array $activityValues, ?\Aktivita $originalActivity): ImportStepResult {
    $withoutDiscountValue = $activityValues[ExportAktivitSloupce::BEZ_SLEV] ?? null;
    if ((string)$withoutDiscountValue === '') {
      return ImportStepResult::success($originalActivity && $originalActivity->bezSlevy()
        ? 1
        : 0
      );
    }
    $withoutDiscount = $this->parseBoolean($withoutDiscountValue);
    if ($withoutDiscount !== null) {
      return ImportStepResult::success(
        $withoutDiscount
          ? 1
          : 0
      );
    }
    return ImportStepResult::error(sprintf(
      "Podivný zápis 'bez slevy': '%s' u aktivity %s. Očekáváme pouze 1, 0, ano, ne.",
      $withoutDiscountValue,
      $this->importValuesDescriber->describeActivityByInputValues($activityValues, $originalActivity)
    ));
  }

  private function parseBoolean($value): ?bool {
    if (is_bool($value)) {
      return $value;
    }
    switch (substr((string)$value, 0, 1)) {
      case '0' :
      case 'n' :
      case 'f' :
        return false;
      case '1' :
      case 'a' :
      case 'y' :
        return true;
      default :
        return null;
    }
  }

  private function getValidatedUnisexCapacity(array $activityValues, ?\Aktivita $originalActivity): ImportStepResult {
    $capacityValue = $activityValues[ExportAktivitSloupce::KAPACITA_UNISEX] ?? null;
    if ((string)$capacityValue === '') {
      return ImportStepResult::success($originalActivity
        ? $originalActivity->getKapacitaUnisex()
        : null
      );
    }
    $capacityInt = (int)$capacityValue;
    if ($capacityInt > 0) {
      return ImportStepResult::success($capacityInt);
    }
    if ((string)$capacityValue === '0') {
      return ImportStepResult::success(0);
    }
    return ImportStepResult::error(sprintf(
      "Podivná unisex kapacita '%s' u aktivity %s. Očekáváme celé kladné číslo.",
      $capacityValue,
      $this->importValuesDescriber->describeActivityByInputValues($activityValues, $originalActivity)
    ));
  }

  private function getValidatedMenCapacity(array $activityValues, ?\Aktivita $originalActivity): ImportStepResult {
    $capacityValue = $activityValues[ExportAktivitSloupce::KAPACITA_MUZI] ?? null;
    if ((string)$capacityValue === '') {
      return ImportStepResult::success($originalActivity
        ? $originalActivity->getKapacitaMuzu()
        : null
      );
    }
    $capacityInt = (int)$capacityValue;
    if ($capacityInt > 0) {
      return ImportStepResult::success($capacityInt);
    }
    if ((string)$capacityValue === '0') {
      return ImportStepResult::success(0);
    }
    return ImportStepResult::error(sprintf(
      "Podivná kapacita mužů '%s' u aktivity %s. Očekáváme celé kladné číslo.",
      $capacityValue,
      $this->importValuesDescriber->describeActivityByInputValues($activityValues, $originalActivity)
    ));
  }

  private function getValidatedWomenCapacity(array $activityValues, ?\Aktivita $originalActivity): ImportStepResult {
    $capacityValue = $activityValues[ExportAktivitSloupce::KAPACITA_ZENY] ?? null;
    if ((string)$capacityValue === '') {
      return ImportStepResult::success($originalActivity
        ? $originalActivity->getKapacitaZen()
        : null
      );
    }
    $capacityInt = (int)$capacityValue;
    if ($capacityInt > 0) {
      return ImportStepResult::success($capacityInt);
    }
    if ((string)$capacityValue === '0') {
      return ImportStepResult::success(0);
    }
    return ImportStepResult::error(sprintf(
      "Podivná kapacita žen '%s' u aktivity %s. Očekáváme celé kladné číslo.",
      $capacityValue,
      $this->importValuesDescriber->describeActivityByInputValues($activityValues, $originalActivity)
    ));
  }

  private function getValidatedPrice(array $activityValues, ?\Aktivita $originalActivity): ImportStepResult {
    $priceValue = $activityValues[ExportAktivitSloupce::CENA] ?? null;
    if ((string)$priceValue === '') {
      return ImportStepResult::success($originalActivity
        ? $originalActivity->cenaZaklad()
        : 0.0
      );
    }
    $priceFloat = (float)$priceValue;
    if ($priceFloat !== 0.0) {
      return ImportStepResult::success($priceFloat);
    }
    if ((string)$priceFloat === '0' || (string)$priceFloat === '0.0') {
      return ImportStepResult::success(0.0);
    }
    return ImportStepResult::error(sprintf(
      "Podivná cena aktivity '%s' u aktivity %s. Očekáváme číslo.",
      $priceValue,
      $this->importValuesDescriber->describeActivityByInputValues($activityValues, $originalActivity)
    ));
  }

  private function getValidatedLocationId(array $activityValues, ?\Aktivita $originalActivity): ImportStepResult {
    $locationValue = $activityValues[ExportAktivitSloupce::MISTNOST] ?? null;
    if (!$locationValue) {
      if ($originalActivity) {
        return ImportStepResult::success($originalActivity->lokaceId());
      }
      return ImportStepResult::success(null);
    }
    $location = $this->getLocationFromValue((string)$locationValue);
    if ($location) {
      return ImportStepResult::success($location->id());
    }
    return ImportStepResult::error(sprintf(
      "Neznámá lokace '%s' u aktivity %s.",
      $locationValue,
      $this->importValuesDescriber->describeActivityByInputValues($activityValues, $originalActivity)
    ));
  }

  private function getLocationFromValue(string $locationValue): ?\Lokace {
    $locationInt = (int)$locationValue;
    if ($locationInt > 0) {
      return $this->getProgramLocationById($locationInt);
    }
    return $this->getProgramLocationByName($locationValue);
  }

  private function getProgramLocationById(int $id): ?\Lokace {
    return $this->getProgramLocationsCache()['id'][$id] ?? null;
  }

  private function getProgramLocationByName(string $name): ?\Lokace {
    return $this->getProgramLocationsCache()['keyFromName'][ImportKeyUnifier::toUnifiedKey($name, [], ImportKeyUnifier::UNIFY_UP_TO_NUMBERS_AND_LETTERS)] ?? null;
  }

  private function getProgramLocationsCache(): array {
    if (!$this->programLocationsCache) {
      $this->programLocationsCache = ['id' => [], 'keyFromName' => []];
      $locations = \Lokace::zVsech();
      foreach ($locations as $location) {
        $this->programLocationsCache['id'][$location->id()] = $location;
        $keyFromName = ImportKeyUnifier::toUnifiedKey($location->nazev(), array_keys($this->programLocationsCache['keyFromName']), ImportKeyUnifier::UNIFY_UP_TO_NUMBERS_AND_LETTERS);
        $this->programLocationsCache['keyFromName'][$keyFromName] = $location;
      }
    }
    return $this->programLocationsCache;
  }

  private function getValidatedStart(array $activityValues, ?\Aktivita $originalActivity): ImportStepResult {
    $startValue = $activityValues[ExportAktivitSloupce::ZACATEK] ?? null;
    if (!$startValue) {
      if (!$originalActivity) {
        return ImportStepResult::success(null);
      }
      $activityStart = $originalActivity->zacatek();
      return ImportStepResult::success($activityStart
        ? $activityStart->formatDb()
        : null
      );
    }
    if (empty($activityValues[ExportAktivitSloupce::DEN])) {
      return ImportStepResult::error(
        sprintf(
          'U aktivity %s je sice začátek (%s), ale chybí u ní den.',
          $this->importValuesDescriber->describeActivityByInputValues($activityValues, $originalActivity),
          $activityValues[ExportAktivitSloupce::ZACATEK]
        )
      );
    }
    return $this->createDateTimeFromRangeBorder($this->currentYear, $activityValues[ExportAktivitSloupce::DEN], $activityValues[ExportAktivitSloupce::ZACATEK]);
  }

  private function getValidatedEnd(array $activityValues, ?\Aktivita $originalActivity): ImportStepResult {
    $activityEndValue = $activityValues[ExportAktivitSloupce::KONEC] ?? null;
    if (!$activityEndValue) {
      if (!$originalActivity) {
        return ImportStepResult::success(null);
      }
      $activityEnd = $originalActivity->konec();
      return ImportStepResult::success($activityEnd
        ? $activityEnd->formatDb()
        : null
      );
    }
    if (empty($activityValues[ExportAktivitSloupce::DEN])) {
      return ImportStepResult::error(
        sprintf(
          'U aktivity %s je sice konec (%s), ale chybí u ní den.',
          $this->importValuesDescriber->describeActivityByInputValues($activityValues, $originalActivity),
          $activityValues[ExportAktivitSloupce::KONEC]
        )
      );
    }
    return $this->createDateTimeFromRangeBorder($this->currentYear, $activityValues[ExportAktivitSloupce::DEN], $activityValues[ExportAktivitSloupce::KONEC]);
  }

  private function createDateTimeFromRangeBorder(int $year, string $dayName, string $hoursAndMinutes): ImportStepResult {
    try {
      $date = DateTimeGamecon::denKolemZacatkuGameconuProRok($dayName, $year);
    } catch (\Exception $exception) {
      return ImportStepResult::error(sprintf("Nepodařilo se vytvořit datum z roku %d, dne '%s' a času '%s'. Chybný formát datumu. Detail: %s", $year, $dayName, $hoursAndMinutes, $exception->getMessage()));
    }

    if (!preg_match('~^(?<hours>\d+)(\s*:\s*(?<minutes>\d+))?$~', $hoursAndMinutes, $timeMatches)) {
      return ImportStepResult::error(sprintf("Nepodařilo se nastavit čas podle roku %d, dne '%s' a času '%s'. Chybný formát času '%s'.", $year, $dayName, $hoursAndMinutes, $hoursAndMinutes));
    }
    $hours = (int)$timeMatches['hours'];
    $minutes = (int)($timeMatches['minutes'] ?? 0);
    $dateTime = $date->setTime($hours, $minutes, 0, 0);
    if (!$dateTime) {
      return ImportStepResult::error(sprintf("Nepodařilo se nastavit čas podle roku %d, dne '%s' a času '%s'. Chybný formát.", $year, $dayName, $hoursAndMinutes));
    }
    return ImportStepResult::success($dateTime->formatDb());
  }

  private function getValidatedUrl(array $activityValues, \Typ $singleProgramLine, ?\Aktivita $originalActivity): ImportStepResult {
    $activityUrl = $activityValues[ExportAktivitSloupce::URL] ?? null;
    if (!$activityUrl) {
      if ($originalActivity) {
        return ImportStepResult::success($originalActivity->urlId());
      }
      if (empty($activityValues[ExportAktivitSloupce::NAZEV])) {
        return ImportStepResult::error(sprintf(
          'Nová aktivita %s nemá ani URL, ani název, ze kterého by URL šlo vytvořit.',
          $this->importValuesDescriber->describeActivityByInputValues($activityValues, $originalActivity)
        ));
      }
      $activityUrl = $this->toUrl($activityValues[ExportAktivitSloupce::NAZEV]);
    }
    $activityUrl = $this->toUrl($activityUrl);
    $occupiedByActivities = dbFetchAll(<<<SQL
SELECT id_akce, nazev_akce, patri_pod
FROM akce_seznam
WHERE url_akce = $1 AND rok = $2 AND typ = $3
SQL
      ,
      [$activityUrl, $this->currentYear, $singleProgramLine->id()]
    );
    if ($occupiedByActivities) {
      foreach ($occupiedByActivities as $occupiedByActivity) {
        $occupiedByActivityId = (int)$occupiedByActivity['id_akce'];
        $occupiedActivityInstanceId = $occupiedByActivity['patri_pod']
          ? (int)$occupiedByActivity['patri_pod']
          : null;
        if ($this->isIdentifierOccupied($occupiedByActivityId, $occupiedActivityInstanceId, $activityUrl, $singleProgramLine, $originalActivity)) {
          return ImportStepResult::error(sprintf(
            "URL '%s'%s %s aktivity %s už je obsazena jinou existující aktivitou %s.",
            $activityUrl,
            empty($activityValues[ExportAktivitSloupce::URL])
              ? ' (odhadnutá z názvu)'
              : '',
            $originalActivity
              ? 'upravované'
              : 'nové',
            $this->importValuesDescriber->describeActivityByInputValues($activityValues, $originalActivity),
            $this->importValuesDescriber->describeActivityById($occupiedByActivityId)
          ));
        }
      }
    }
    return ImportStepResult::success($activityUrl);
  }

  private function toUrl(string $value): string {
    $sanitized = strtolower(odstranDiakritiku($value));
    return preg_replace('~\W+~', '-', $sanitized);
  }

  private function getValidatedActivityName(array $activityValues, ?string $activityUrl, \Typ $singleProgramLine, ?\Aktivita $originalActivity): ImportStepResult {
    $activityNameValue = $activityValues[ExportAktivitSloupce::NAZEV] ?? null;
    if (!$activityNameValue) {
      return $originalActivity
        ? ImportStepResult::success($originalActivity->nazev())
        : ImportStepResult::error(sprintf(
          'Chybí název u importované aktivity %s.',
          $this->importValuesDescriber->describeActivityByInputValues($activityValues, $originalActivity)
        ));
    }
    $occupiedByActivities = dbFetchAll(<<<SQL
SELECT id_akce, nazev_akce, patri_pod
FROM akce_seznam
WHERE nazev_akce = $1 AND rok = $2 AND typ = $3 LIMIT 1
SQL
      , [$activityNameValue, $this->currentYear, $singleProgramLine->id()]
    );
    if ($occupiedByActivities) {
      foreach ($occupiedByActivities as $occupiedByActivity) {
        $occupiedByActivityId = (int)$occupiedByActivity['id_akce'];
        $occupiedActivityInstanceId = $occupiedByActivity['patri_pod']
          ? (int)$occupiedByActivity['patri_pod']
          : null;
        if ($this->isIdentifierOccupied($occupiedByActivityId, $occupiedActivityInstanceId, $activityUrl, $singleProgramLine, $originalActivity)) {
          return ImportStepResult::error(sprintf(
            "Název '%s' %s už je obsazený jinou existující aktivitou %s.",
            $activityNameValue,
            $originalActivity
              ? sprintf('upravované aktivity %s', $this->importValuesDescriber->describeActivity($originalActivity))
              : 'nové aktivity',
            $this->importValuesDescriber->describeActivityById((int)$occupiedByActivityId)
          ));
        }
      }
    }
    return ImportStepResult::success($activityNameValue);
  }

  private function getValidatedProgramLineId(array $activityValues, ?\Aktivita $originalActivity): ImportStepResult {
    $programLineValue = $activityValues[ExportAktivitSloupce::PROGRAMOVA_LINIE] ?? null;
    if ((string)$programLineValue === '') {
      return $originalActivity
        ? ImportStepResult::success($originalActivity->typId())
        : ImportStepResult::error(sprintf('Chybí programová linie u aktivity %s.', $this->importValuesDescriber->describeActivityByInputValues($activityValues, null)));
    }
    $programLine = $this->getProgramLineFromValue((string)$programLineValue);
    return $programLine
      ? ImportStepResult::success($programLine->id())
      : ImportStepResult::error(sprintf(
        "Neznámá programová linie '%s' u aktivity %s.",
        $programLineValue,
        $this->importValuesDescriber->describeActivityByInputValues($activityValues, null)
      ));
  }

  private function getProgramLineFromValue(string $programLineValue): ?\Typ {
    $programLineInt = (int)$programLineValue;
    if ($programLineInt > 0) {
      return $this->getProgramLineById($programLineInt);
    }
    return $this->getProgramLineByName($programLineValue);
  }

  private function getProgramLineById(int $id): ?\Typ {
    return $this->getProgramLinesCache()['id'][$id] ?? null;
  }

  private function getProgramLineByName(string $name): ?\Typ {
    return $this->getProgramLinesCache()['keyFromName'][ImportKeyUnifier::toUnifiedKey($name, [])] ?? null;
  }

  private function getProgramLinesCache(): array {
    if (!$this->programLinesCache) {
      $this->programLinesCache = ['id' => [], 'keyFromName' => []];
      $programLines = \Typ::zVsech();
      foreach ($programLines as $programLine) {
        $this->programLinesCache['id'][$programLine->id()] = $programLine;
        $keyFromName = ImportKeyUnifier::toUnifiedKey($programLine->nazev(), array_keys($this->programLinesCache['keyFromName']));
        $this->programLinesCache['keyFromName'][$keyFromName] = $programLine;
      }
    }
    return $this->programLinesCache;
  }

  private function isIdentifierOccupied(
    int $occupiedByActivityId,
    ?int $occupiedActivityInstanceId,
    ?string $activityUrl,
    \Typ $singleProgramLine,
    ?\Aktivita $originalActivity
  ): bool {
    return (!$originalActivity
        || ($occupiedByActivityId !== $originalActivity->id() && (!$occupiedActivityInstanceId || $occupiedActivityInstanceId !== $originalActivity->patriPod()))
        || ($occupiedActivityInstanceId
          && ($parentInstanceId = $this->findParentInstanceId($originalActivity))
          && $occupiedActivityInstanceId != $parentInstanceId
        )
      )
      && ($activityUrl === null
        || \Aktivita::idMozneHlavniAktivityPodleUrl($activityUrl, $this->currentYear, $singleProgramLine->id()) === null
      );
  }

  private function findParentInstanceId(?\Aktivita $originalActivity): ?int {
    if ($originalActivity) {
      $instanceId = $originalActivity->patriPod();
      return $instanceId
        ? (int)$instanceId
        : null;
    }
    return null;
  }

}