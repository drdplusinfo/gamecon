class Rozvrh extends React.Component{

  constructor(props) {
    super(props)
  }

  filtrujZvoleneLinie(linie) {
    return linie.filter(lajna => lajna.zvolena && lajna.poradi > 0);
  }

  filtrujPodleDne(aktivity) {
    return aktivity.filter(aktivita => new Date(aktivita.zacatek).getDay() == this.props.zvolenyDen);
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
        let kapacita = aktivita.kapacita_f + aktivita.kapacita_m + aktivita.kapacita_u;
        let prihlaseno = aktivita.prihlaseno_f + aktivita.prihlaseno_m;
        return kapacita == 0 ? true : kapacita > prihlaseno;
      })
    }
    return aktivity;
  }

  najdiAktivityKLinii(aktivity, lajna) {
    return aktivity.filter(aktivita => aktivita.linie == lajna.id);
  }

  vytvorHlavicku() {
    let hlavicka = [<th className = "tabulka-hlavicka-nazvu"></th>];
    for (let hodina = ZACATEK_PROGRAMU; hodina <= 23; hodina++) {
      hlavicka.push(<th className = "tabulka-hlavicka-cas">{hodina}</th>);
    }
    return hlavicka;
  }

  render() {
    let aktivityDne = this.filtrujPodleDne(this.props.data.aktivity);
    aktivityDne = this.filtrujPodleStitku(aktivityDne);
    aktivityDne = this.filtrujVolneAktivity(aktivityDne);
    let zvoleneLinie = this.filtrujZvoleneLinie(this.props.linie);

    let linie = zvoleneLinie.map(lajna => {
      return <Lajna key = {lajna.id} aktivity = {this.najdiAktivityKLinii(aktivityDne, lajna)}
        nazev = {lajna.nazev[0].toUpperCase() + lajna.nazev.slice(1)}
        zvolTutoAktivitu = {this.props.zvolTutoAktivitu} />
    })

    return (
      <table className = "tabulka">
        <thead>
          <tr>{this.vytvorHlavicku()}</tr>
        </thead>
        {linie}
      </table>
    );
  }
}
