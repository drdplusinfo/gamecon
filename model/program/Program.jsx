//začátek programu je v 8:00, předpoklámáme konec o půlnoci;
class Program extends React.Component {

  constructor(props) {
    super(props);
    this.zapniUpdateUIPriZmeneDat();
    
    this.props.data = this.props.api.zakladniData;

    let linie = this.uklidLinie(this.props.data.linie);
    // zobrazujeme všechny, nejenom volné aktivity
    // zvolenaAktivita je číslo - id zvolenej aktivity
    this.state = {
      linie: linie,
      zvolenyDen: KONSTANTY.DNY_V_TYDNU.CTVRTEK,
      zvolenaAktivita: null,
      stitky: this.ziskejStitky(),
      jenVolneAktivity: false
    };

    this.odhlas = this.odhlas.bind(this);
    this.prihlas = this.prihlas.bind(this);
    this.prepniVolneAktivity = this.prepniVolneAktivity.bind(this);
    this.ziskejStitky = this.ziskejStitky.bind(this);
    this.zmenLinie = this.zmenLinie.bind(this);
    this.zmenStitky = this.zmenStitky.bind(this);
    this.zvolTentoDen = this.zvolTentoDen.bind(this);
    this.zvolTutoAktivitu = this.zvolTutoAktivitu.bind(this);
  }

  odhlas(idAktivity) {
    this.props.api.odhlas(idAktivity, (data) => {
      //odhlášen, aktualizuj UI
    });
  }

  prihlas(idAktivity) {
    this.props.api.prihlas(idAktivity, (data) => {
      //přihlášen, aktualizuj UI
    }, (chyba) => {
      //TODO: jak zobrazit tuto chybu hezky?
      alert(chyba);
    });
  }

  prepniVolneAktivity() {
    this.setState({jenVolneAktivity: !this.state.jenVolneAktivity});
  }

  uklidLinie(linie) {
    // seřaď linie podle pořadí a dej jim vlajku zvolená
    let upraveneLinie = linie.map(lajna => Object.assign({}, lajna, {zvolena: true}));
    return upraveneLinie.sort((lajnaA, lajnaB) => lajnaA.poradi - lajnaB.poradi);
  }

  zapniUpdateUIPriZmeneDat() {
    this.props.api.zmenaZakladnichDat = this.forceUpdate.bind(this);
  }

  ziskejStitky() {
    //Projdi pole aktivit, vytáhni všechny štítky a přiřaď je do pole stitky
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
    this.setState({zvolenaAktivita: aktivita.id});
  }

  render() {
    let api = {
      detail: this.props.api.detail,
      odhlas: this.odhlas,
      prihlas: this.prihlas
    }
    return (
      <div>
        <Header />
        <ZvolTypy
          jenVolneAktivity = {this.state.jenVolneAktivity}
          linie = {this.state.linie}
          stitky = {this.state.stitky}
          prepniVolneAktivity = {this.prepniVolneAktivity}
          zmenLinie = {this.zmenLinie}
          zmenStitky = {this.zmenStitky}
        />
        <ZvolStitky
          stitky = {this.state.stitky}
          zmenStitky = {this.zmenStitky}
        />
        <ZvolDen
          zvolenyDen = {this.state.zvolenyDen}
          zvolTentoDen = {this.zvolTentoDen}
        />
        <Rozvrh
          api = {api}
          data = {this.props.data}
          jenVolneAktivity = {this.state.jenVolneAktivity}
          linie = {this.state.linie}
          stitky = {this.state.stitky}
          zvolenyDen = {this.state.zvolenyDen}
          zvolTutoAktivitu = {this.zvolTutoAktivitu}
        />
        {this.state.zvolenaAktivita &&
          <DetailAktivity
            api = {api}
            data = {this.props.data}
            zvolenaAktivita = {this.state.zvolenaAktivita}
            zvolTutoAktivitu = {this.zvolTutoAktivitu}
          />
        }
      </div>
    )
  }

}
