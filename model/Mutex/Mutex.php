<?php declare(strict_types=1);

namespace Gamecon\Mutex;

use Gamecon\Cas\DateTimeCz;

class Mutex
{
  /**
   * @var string
   */
  private $akce;

  public function __construct(string $akce) {
    $this->akce = $akce;
  }

  public function cekejAZamkni(int $cekejMaxMilisekund, \DateTimeInterface $do, string $klic, int $uzivatelId = null): bool {
    $start = microtime(true);
    $zbyvaMilisekund = $cekejMaxMilisekund;
    while (!($zamceno = $this->zamkni($do, $klic, $uzivatelId))) {
      $trvani = microtime(true) - $start;
      $zbyvaMilisekund -= $trvani;
      usleep(min($zbyvaMilisekund, 100));
    }
    return $zamceno;
  }

  public function zamkni(\DateTimeInterface $do, string $klic, int $userId = null): bool {
    dbQuery(<<<SQL
DELETE FROM mutex WHERE akce = $1 AND do < NOW()
SQL
      , [$this->akce]
    );
    if ($this->zamceno()) {
      return false;
    }
    dbQuery(<<<SQL
INSERT IGNORE INTO mutex(akce, klic, zamknul, od, do) VALUES ($1, $2, $3, NOW(), $4)
SQL
      , [$this->akce, $klic, $userId, $do->format(DateTimeCz::FORMAT_DB)]
    );
    return $this->zamceno();
  }

  public function zamceno(): bool {
    return (bool)dbOneCol(<<<SQL
SELECT 1 FROM mutex WHERE klic = $1 AND do >= NOW()
SQL
    );
  }

  public function odemkni(string $klic): bool {
    dbQuery(<<<SQL
DELETE FROM mutex WHERE akce = $1 AND klic = $2
SQL
      , [$this->akce, $klic]
    );
    return $this->zamceno();
  }
}
