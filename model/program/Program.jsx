//začátek programu je v 8:00, předpoklámáme konec o půlnoci;
const ZACATEK_PROGRAMU = 8;

class Program extends React.Component {

  constructor(props) {
    super(props);
    console.log(this.props.data);
    let linie = this.uklidLinie(this.props.data.linie);

    // na začátku je zvolený den čtvrtek - 4
    // zobrazujeme všechny, nejenom volné aktivity
    this.state = {
      linie: linie,
      zvolenyDen: 4,
      zvolenaAktivita: {},
      stitky: this.ziskejStitky(),
      jenVolneAktivity: false
    };

    this.prepniVolneAktivity = this.prepniVolneAktivity.bind(this);
    this.ziskejStitky = this.ziskejStitky.bind(this);
    this.zmenLinie = this.zmenLinie.bind(this);
    this.zmenStitky = this.zmenStitky.bind(this);
    this.zvolTentoDen = this.zvolTentoDen.bind(this);
    this.zvolTutoAktivitu = this.zvolTutoAktivitu.bind(this);
  }

  prepniVolneAktivity() {
    this.setState({jenVolneAktivity: !this.state.jenVolneAktivity});
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
        zvoleny: false
      }
    })
    return stitkyObj;
  }

  zmenLinie(linie) {
    this.setState({linie: linie});
  }

  zmenStitky(stitky) {
    this.setState({stitky: stitky});
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
        <ZvolTypy linie = {this.state.linie} zmenLinie = {this.zmenLinie} jenVolneAktivity = {this.state.jenVolneAktivity}
          prepniVolneAktivity = {this.prepniVolneAktivity} stitky = {this.state.stitky} zmenStitky = {this.zmenStitky}/>
        <ZvolDen zvolenyDen = {this.state.zvolenyDen} zvolTentoDen = {this.zvolTentoDen} />
        <Rozvrh data = {this.props.data} linie = {this.state.linie} stitky = {this.state.stitky} zvolenyDen = {this.state.zvolenyDen} jenVolneAktivity = {this.state.jenVolneAktivity} zvolTutoAktivitu = {this.zvolTutoAktivitu} />
        {this.state.zvolenaAktivita.id &&
          <DetailAktivity aktivita = {this.state.zvolenaAktivita} linie = {this.props.data.linie} zvolTutoAktivitu = {this.zvolTutoAktivitu}/>
        }
      </div>
    )
  }

}
