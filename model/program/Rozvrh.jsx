class Rozvrh extends React.Component {

  filtrujAktivity(aktivity) {
    let vyfiltrovane = this.filtrujOrganizacni(aktivity);
    vyfiltrovane = this.filtrujPodleDne(vyfiltrovane);
    vyfiltrovane = this.filtrujPodleLinie(vyfiltrovane);
    vyfiltrovane = this.filtrujPodleStitku(vyfiltrovane);
    return this.filtrujVolneAktivity(vyfiltrovane);
  }

  filtrujOrganizacni(aktivity) {
    //TODO: sem přijde nějaký test, který nechá jen organizační aktivity, na kterých
    //se přihlášený uživatel účastní
    // momentálně vyfiltruje všechny organizační
    return aktivity.filter(aktivita => aktivita.linie != 10);
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
    if (this.props.jenVolneAktivity) {
      return aktivity.filter(aktivita => {
        let kapacita = aktivita.kapacitaZeny + aktivita.kapacitaMuzi + aktivita.kapacitaUniverzalni;
        let prihlaseno = aktivita.prihlasenoZen + aktivita.prihlasenoMuzu;
        return kapacita == 0 ? true : kapacita > prihlaseno;
      })
    }
    return aktivity;
  }

  filtrujLinie(linie){
    //TODO: tady bude nějaký test, který vyfiltruje/nechá "Organizační výpomoc", jestli je uživatel
    //přihlášen na nějaké tahání beden
    return linie.filter(lajna => lajna.poradi > 0);
  }

  najdiAktivityKLinii(aktivity, lajna) {
    return aktivity.filter(aktivita => aktivita.linie == lajna.id);
  }

  vytvorLinie(aktivity, linie) {
    let vyfiltrovaneLinie = this.filtrujLinie(linie);

    //když jsou aktivity prázné, napiš hlášku - demo
    //TODO: probrat jestli to vůbec dělat takto
    if(aktivity.length === 0) {
      return (
        <tbody className = 'tabulka-linie'>
          {vyfiltrovaneLinie.map((lajna, index) =>
            <tr>
              <th className = 'tabulka-linie'>{lajna.nazev[0].toUpperCase() + lajna.nazev.slice(1)}</th>
              {index == 0 &&
              <td className = 'tabulka-zadne-aktivity' colSpan = {24-ZACATEK_PROGRAMU} rowSpan = {linie.length}>
                Pro zvolené filtry je tady hovno
              </td>}
            </tr>
          )}
        </tbody>
      );
    } else {
      return vyfiltrovaneLinie.map(lajna => {
        return (
          <Lajna
            aktivity = {this.najdiAktivityKLinii(aktivity, lajna)}
            api = {this.props.api}
            key = {lajna.id}
            nazev = {lajna.nazev[0].toUpperCase() + lajna.nazev.slice(1)}
            zvolTutoAktivitu = {this.props.zvolTutoAktivitu}
          />
        );
      });
    }
  }

  vytvorHlavicku() {
    let hlavicka = [<th className = "tabulka-hlavicka-nazvu"></th>];
    for (let hodina = ZACATEK_PROGRAMU; hodina <= 23; hodina++) {
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
