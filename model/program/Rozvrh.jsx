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
