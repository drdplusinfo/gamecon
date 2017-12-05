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
      jenomVolneAktivity: false
    };

    this.prepniVolneAktivity = this.prepniVolneAktivity.bind(this);
    this.zmenLinie = this.zmenLinie.bind(this);
    this.zvolTentoDen = this.zvolTentoDen.bind(this);
    this.zvolTutoAktivitu = this.zvolTutoAktivitu.bind(this);
  }

  prepniVolneAktivity() {
    this.setState({jenomVolneAktivity: !this.state.jenomVolneAktivity});
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

  uklidLinie(linie) {
    // seřaď linie podle pořadí a dej jim vlajku zvolená
    let upraveneLinie = linie.map(lajna => Object.assign({}, lajna, {zvolena: true}));
    return upraveneLinie.sort((lajnaA, lajnaB) => lajnaA.poradi - lajnaB.poradi);
  }

  render() {
    return (
      <div>
        <Header />
        <ZvolTypy linie = {this.state.linie} zmenLinie = {this.zmenLinie} jenomVolneAktivity = {this.state.jenomVolneAktivity}
          prepniVolneAktivity = {this.prepniVolneAktivity} />
        <ZvolDen zvolenyDen = {this.state.zvolenyDen} zvolTentoDen = {this.zvolTentoDen} />
        <Rozvrh data = {this.props.data} linie = {this.state.linie} zvolenyDen = {this.state.zvolenyDen} zvolTutoAktivitu = {this.zvolTutoAktivitu} />
        {this.state.zvolenaAktivita.id &&
          <DetailAktivity aktivita = {this.state.zvolenaAktivita} linie = {this.props.data.linie} zvolTutoAktivitu = {this.zvolTutoAktivitu}/>
        }
      </div>
    )
  }

}
