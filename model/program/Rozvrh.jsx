class Rozvrh extends React.Component {

  filtrujAktivity(aktivity) {
    let vyfiltrovane = this.filtrujPodleDne(aktivity);
    vyfiltrovane = this.filtrujPodleLinie(vyfiltrovane);
    vyfiltrovane = this.filtrujPodleStitku(vyfiltrovane);
    return this.filtrujVolneAktivity(vyfiltrovane);
  }

  filtrujPodleDne(aktivity) {
    return aktivity.filter(aktivita => new Date(aktivita.zacatek).getDay() == this.props.zvolenyDen);
  }

  filtrujPodleLinie(aktivity) {
    return aktivity.filter(aktivita => {
      let aktivitaValidni = false;
      this.props.linie.forEach(lajna => {
        if (aktivita.linie == lajna.id && lajna.zvolena) {
          aktivitaValidni = true;
        }
      });
      return aktivitaValidni;
    });
  }

  filtrujPodleStitku(aktivity) {
    let zvoleneStitky = this.props.stitky.filter(stitek => stitek.zvoleny);

    return aktivity.filter(aktivita => {
      //předpokládáme, že je aktivita validní
      let aktivitaValidni = true;

      zvoleneStitky.forEach(zvolenyStitek => {
        //jestli je ve zvolených štítcích alespoň jeden, který není ve štítcích aktivity,
        //tak aktivita validní není
        let indexStitku = aktivita.stitky.findIndex(stitek => zvolenyStitek.nazev === stitek);
        if (indexStitku === -1) {
          aktivitaValidni = false
        }
      });

      return aktivitaValidni;
    });
  }

  filtrujVolneAktivity(aktivity) {
    if (this.props.zobrazJenVolneAktivity) {
      return aktivity.filter(aktivita => {
        let kapacita = aktivita.kapacitaZeny + aktivita.kapacitaMuzi + aktivita.kapacitaUniverzalni;
        let prihlaseno = aktivita.prihlasenoZen + aktivita.prihlasenoMuzu;
        return kapacita === 0 ? true : kapacita > prihlaseno;
      })
    }
    return aktivity;
  }

  najdiAktivityKLinii(aktivity, lajna) {
    return aktivity.filter(aktivita => aktivita.linie == lajna.id);
  }

  vytvorPrazdnouTabulku(linie) {
    function bocniHlavickaSJmenemLinie(lajna) {
      return <th className = 'tabulka-linie'>{lajna.nazev[0].toUpperCase() + lajna.nazev.slice(1)}</th>;
    }

    const informacniHlaskaVeVelkeBunce =
      <td className = 'tabulka-zadne-aktivity' colSpan = {24-KONSTANTY.ZACATEK_PROGRAMU} rowSpan = {linie.length}>
        Pro zvolené filtry tady nejsou žádné aktivity
      </td>;

    return (
      <tbody className = 'tabulka-linie'>
          {linie.map((lajna, index) =>
            <tr>
              {bocniHlavickaSJmenemLinie(lajna)}
              {index === 0 && informacniHlaskaVeVelkeBunce}
            </tr>
          )}
      </tbody>
    );
  }

  vytvorLinie(aktivity, linie) {
    if(aktivity.length === 0) {
      return this.vytvorPrazdnouTabulku(linie);
    } else {
      return linie.map(lajna => {
        return (
          <ProgramovaLinie
            aktivitaJePlnaProPohlaviUzivatele={this.props.aktivitaJePlnaProPohlaviUzivatele}
            aktivity = {this.najdiAktivityKLinii(aktivity, lajna)}
            api = {this.props.api}
            key = {lajna.id}
            nazev = {lajna.nazev[0].toUpperCase() + lajna.nazev.slice(1)}
            data = {this.props.data}
            zvolTutoAktivitu = {this.props.zvolTutoAktivitu}
          />
        );
      });
    }
  }

  vytvorHlavicku() {
    let hlavicka = [<th className = "tabulka-hlavicka-nazvu"></th>];
    for (let hodina = KONSTANTY.ZACATEK_PROGRAMU; hodina <= 23; hodina++) {
      hlavicka.push(<th className = "tabulka-hlavicka-cas">{hodina}</th>);
    }
    return hlavicka;
  }

  render() {
    let aktivity = this.filtrujAktivity(this.props.data.aktivity);

    return (
      <table className = "tabulka">
        <thead>
          <tr>{this.vytvorHlavicku()}</tr>
        </thead>
        {this.vytvorLinie(aktivity, this.props.linie)}
      </table>
    );
  }
}
