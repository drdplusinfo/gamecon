//začátek programu je v 8:00, předpoklámáme konec o půlnoci;
const ZACATEK_PROGRAMU = 8;

class Program extends React.Component {

  constructor(props) {
    super(props);
    console.log(this.props.data);
    let linie = this.uklidLinie(this.props.data.linie);

    // na začátku je zvolený den čtvrtek - 4
    this.state = {
      linie: linie,
      zvolenyDen: 4,
      zvolenaAktivita: {},
      stitky: ziskejStitky()
    };

    this.ziskejStitky = this.ziskejStitky.bind(this);
    this.zmenLinie = this.zmenLinie.bind(this);
    this.zvolTentoDen = this.zvolTentoDen.bind(this);
    this.zvolTutoAktivitu = this.zvolTutoAktivitu.bind(this);
  }

  uklidLinie(linie) {
    // seřaď linie podle pořadí a dej jim vlajku zvolená
    let upraveneLinie = linie.map(lajna => Object.assign({}, lajna, {zvolena: true}));
    return upraveneLinie.sort((lajnaA, lajnaB) => lajnaA.poradi - lajnaB.poradi);
  }

  ziskejStitky() {
    //Projdi pole aktivit, vytáhni všechny štítky a přiřaď je do pole ziskejStitky
    let stitky = []
    this.props.data.aktivity.forEach(aktivita => {
      aktivita.stitky.forEach(stitek => {
        if (!(stitky.includes(stitek))) {
          stitky.push(stitek);
        }
      })
    })
    let stitkyObj = stitky.map(stitek => {
      return {
        nazev: stitek,
        zvoleny: true
      }
    })
    return stitkyObj;
  }

  zmenLinie(linie) {
    this.setState({linie: linie});
  }

  zvolTentoDen(cisloDneVTydnu) {
    this.setState({zvolenyDen: cisloDneVTydnu});
  }

  zvolTutoAktivitu(aktivita) {
    console.log(aktivita);
    this.setState({zvolenaAktivita: aktivita});
  }

  render() {
    return (
      <div>
        <Header />
        <ZvolLinie linie = {this.state.linie} zmenLinie = {this.zmenLinie} />
        <ZvolDen zvolenyDen = {this.state.zvolenyDen} zvolTentoDen = {this.zvolTentoDen} />
        <Rozvrh data = {this.props.data} linie = {this.state.linie} zvolenyDen = {this.state.zvolenyDen} zvolTutoAktivitu = {this.zvolTutoAktivitu} />
        {this.state.zvolenaAktivita.id &&
          <DetailAktivity aktivita = {this.state.zvolenaAktivita} linie = {this.props.data.linie} zvolTutoAktivitu = {this.zvolTutoAktivitu}/>
        }
      </div>
    )
  }

}
