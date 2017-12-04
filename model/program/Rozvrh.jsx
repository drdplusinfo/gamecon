class Rozvrh extends React.Component{

  constructor(props) {
    super(props)

    this.linieSAktivitami = this.props.data.linie
    .filter(lajna => lajna.poradi > 0)
    .map(lajna => {
      let aktivity = this.props.data.aktivity.filter(aktivita => aktivita.linie == lajna.id);
      return {
        id: lajna.id,
        nazev: lajna.nazev,
        aktivity: aktivity
      };
    });
  }

  filtrujZvoleneLinie(linieSAktivitami) {
    return linieSAktivitami.filter(lajna => {
      let index = this.props.zvoleneLinie.findIndex(zvolenaLajna => zvolenaLajna.nazev === lajna.nazev);
      return index > -1;
    });
  }

  filtrujPodleDne(poleAktivit) {
    return poleAktivit.filter(aktivita => new Date(aktivita.zacatek).getDay() == this.props.zvolenyDen);
  }

  render() {
    let zvoleneLinie = this.filtrujZvoleneLinie(this.linieSAktivitami);
    let linie = zvoleneLinie.map(lajna => {
      let aktivity = this.filtrujPodleDne(lajna.aktivity);
      return <Lajna key = {lajna.idLajny} aktivity = {aktivity} nazev = {lajna.nazev[0].toUpperCase() + lajna.nazev.slice(1)} zvolTutoAktivitu = {this.props.zvolTutoAktivitu}/>
    });

    let casy = new Array(16).fill(null).map((item, index) => <th className = "tabulka-hlavicka-cas">{index + 8}</th>);
    let hlavickaNazvu = <th className = "tabulka-hlavicka-nazvu"></th>;
    casy.unshift(hlavickaNazvu);

    return (
      <table className = "tabulka">
        <thead>
          <tr>{casy}</tr>
        </thead>
        {linie}
      </table>
    );
  }
}
