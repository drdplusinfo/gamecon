<?php declare(strict_types=1);

namespace Gamecon\Admin\Modules\Aktivity\Import;

use Gamecon\Admin\Modules\Aktivity\Import\Exceptions\DuplicatedUnifiedKeyException;

class ImportUsersCache
{
  private $users;
  private $usersPerId;
  private $usersPerEmail;
  private $usersPerName;
  private $usersPerNick;
  private $fromNameKeyUnifyDepth = ImportKeyUnifier::UNIFY_UP_TO_LETTERS;
  private $fromNickKeyUnifyDepth = ImportKeyUnifier::UNIFY_UP_TO_LETTERS;
  private $fromEmailKeyUnifyDepth = ImportKeyUnifier::UNIFY_UP_TO_DIACRITIC;


  public function getUserById(int $id): ?\Uzivatel {
    return $this->getUsersPerId()[$id] ?? null;
  }

  public function getUserByEmail(string $email): ?\Uzivatel {
    if (strpos($email, '@') === false) {
      return null;
    }
    $key = ImportKeyUnifier::toUnifiedKey($email, [], ImportKeyUnifier::UNIFY_UP_TO_DIACRITIC);
    return $this->getUsersPerEmail()[$key] ?? null;
  }

  public function getUserByName(string $name): ?\Uzivatel {
    $key = ImportKeyUnifier::toUnifiedKey($name, [], $this->fromNameKeyUnifyDepth);
    return $this->getUsersPerName()[$key] ?? null;
  }

  public function getUserByNick(string $nick): ?\Uzivatel {
    $key = ImportKeyUnifier::toUnifiedKey($nick, [], $this->fromNickKeyUnifyDepth);
    return $this->getUsersPerNick()[$key] ?? null;
  }

  /**
   * @return \Uzivatel[]
   */
  private function getUsersPerId(): array {
    if ($this->usersPerId === null) {
      $this->usersPerId = [];
      foreach ($this->getUsers() as $user) {
        $this->usersPerId[$user->id()] = $user;
      }
    }
    return $this->usersPerId;
  }

  /**
   * @return \Uzivatel[]
   */
  private function getUsersPerEmail(): array {
    if ($this->usersPerEmail === null) {
      $this->usersPerEmail = [];
      $conflictingKeys = [];
      for ($emailKeyUnifyDepth = $this->fromEmailKeyUnifyDepth; $emailKeyUnifyDepth >= 0; $emailKeyUnifyDepth--) {
        $usersPerEmail = [];
        foreach ($this->getUsers() as $user) {
          $mail = $user->mail();
          if ($mail === '') {
            continue;
          }
          try {
            $keyFromEmail = ImportKeyUnifier::toUnifiedKey($mail, array_keys($usersPerEmail), $emailKeyUnifyDepth);
            if (in_array($keyFromEmail, $conflictingKeys, true)) {
              continue; // can not use this user as his mail is in conflict with another one
            }
            $usersPerEmail[$keyFromEmail] = $user;
            // if unification was too aggressive and we had to lower level of depth / lossy compression, we have to store the lowest level for later picking-up values from cache
          } catch (DuplicatedUnifiedKeyException $unifiedKeyException) {
            if ($emailKeyUnifyDepth > 0) {
              continue 2; // lower key depth
            }
            $conflictingKeys[] = $unifiedKeyException->getDuplicatedKey();
            unset($usersPerEmail[$unifiedKeyException->getDuplicatedKey()]); // better to remove conflicting emails than throw them all
          }
        }
        $this->usersPerEmail = $usersPerEmail;
        $this->fromEmailKeyUnifyDepth = min($this->fromEmailKeyUnifyDepth, $emailKeyUnifyDepth);
        break; // all emails converted to unified and unique keys
      }
    }
    return $this->usersPerEmail;
  }

  /**
   * @return \Uzivatel[]
   */
  private function getUsersPerName(): array {
    if ($this->usersPerName === null) {
      $this->usersPerName = [];
      $conflictingKeys = [];
      for ($nameKeyUnifyDepth = $this->fromNameKeyUnifyDepth; $nameKeyUnifyDepth >= 0; $nameKeyUnifyDepth--) {
        $usersPerName = [];
        foreach ($this->getUsers() as $user) {
          $name = $user->jmeno();
          if ($name === '') {
            continue;
          }
          try {
            $keyFromCivilName = ImportKeyUnifier::toUnifiedKey($name, array_keys($usersPerName), $nameKeyUnifyDepth);
            if (in_array($keyFromCivilName, $conflictingKeys, true)) {
              continue; // can not use this user as his name is in conflict with another one
            }
            $usersPerName[$keyFromCivilName] = $user;
            // if unification was too aggressive and we had to lower level of depth / lossy compression, we have to store the lowest level for later picking-up values from cache
          } catch (DuplicatedUnifiedKeyException $unifiedKeyException) {
            if ($nameKeyUnifyDepth > 0) {
              continue 2; // lower key depth
            }
            $conflictingKeys[] = $unifiedKeyException->getDuplicatedKey();
            unset($usersPerName[$unifiedKeyException->getDuplicatedKey()]); // better to remove conflicting names than throw them all
          }
        }
        $this->usersPerName = $usersPerName;
        $this->fromNameKeyUnifyDepth = min($this->fromNameKeyUnifyDepth, $nameKeyUnifyDepth);
        break; // all names converted to unified and unique keys
      }
    }
    return $this->usersPerName;
  }

  /**
   * @return \Uzivatel[]
   */
  private function getUsersPerNick(): array {
    if ($this->usersPerNick === null) {
      $this->usersPerNick = [];
      $conflictingKeys = [];
      for ($nickKeyUnifyDepth = $this->fromNickKeyUnifyDepth; $nickKeyUnifyDepth >= 0; $nickKeyUnifyDepth--) {
        $usersPerNickKey = [];
        foreach ($this->getUsers() as $user) {
          $nick = $user->nick();
          if ($nick === '') {
            continue;
          }
          try {
            $keyFromNick = ImportKeyUnifier::toUnifiedKey($nick, array_keys($usersPerNickKey), $nickKeyUnifyDepth);
            if (in_array($keyFromNick, $conflictingKeys, true)) {
              continue; // can not use this user as his nick is in conflict with another one
            }
            $usersPerNickKey[$keyFromNick] = $user;
            // if unification was too aggressive and we had to lower level of depth / lossy compression, we have to store the lowest level for later picking-up values from cache
          } catch (DuplicatedUnifiedKeyException $unifiedKeyException) {
            if ($nickKeyUnifyDepth > 0) {
              continue 2; // lower key depth
            }
            $conflictingKeys[] = $unifiedKeyException->getDuplicatedKey();
            unset($usersPerNickKey[$unifiedKeyException->getDuplicatedKey()]); // better to remove conflicting nicks than throw them all
          }
        }
        $this->usersPerNick = $usersPerNickKey;
        $this->fromNickKeyUnifyDepth = min($this->fromNickKeyUnifyDepth, $nickKeyUnifyDepth);
        break; // all nicks converted to unified and unique keys
      }
    }
    return $this->usersPerNick;
  }

  /**
   * @return \Uzivatel[]
   */
  private function getUsers(): array {
    if ($this->users === null) {
      $this->users = \Uzivatel::vsichni();
    }
    return $this->users;
  }
}
