//začátek programu je v 8:00, předpoklámáme konec o půlnoci;
const ZACATEK_PROGRAMU = 8;

class Program extends React.Component {

  constructor(props) {
    super(props);
    console.log(this.props.data);
    let linie = this.uklidLinie(this.props.data.linie);

    // na začátku je zvolený den čtvrtek - 4
    // zobrazujeme všechny, nejenom volné aktivity
    // zvolenaAktivita je číslo - id zvolenej aktivity
    this.state = {
      data: this.props.data,
      linie: linie,
      zvolenyDen: 4,
      zvolenaAktivita: null,
      stitky: this.ziskejStitky(),
      jenVolneAktivity: false
    };

    this.odhlas = this.odhlas.bind(this);
    this.prihlas = this.prihlas.bind(this);
    this.prepniVolneAktivity = this.prepniVolneAktivity.bind(this);
    this.ziskejStitky = this.ziskejStitky.bind(this);
    this.zmenAktivitu = this.zmenAktivitu.bind(this);
    this.zmenLinie = this.zmenLinie.bind(this);
    this.zmenStitky = this.zmenStitky.bind(this);
    this.zvolTentoDen = this.zvolTentoDen.bind(this);
    this.zvolTutoAktivitu = this.zvolTutoAktivitu.bind(this);
  }

  odhlas(idAktivity) {
    this.props.api.odhlas(idAktivity, (data) => {
      //odhlášen, změň stav
      console.log("odhlášen");
      this.zmenAktivitu(idAktivity, "prihlasen", false);

      let aktivita = this.state.data.aktivity.find(akt => akt.id === idAktivity);
      if (this.state.data.uzivatelPohlavi === "f") {
        this.zmenAktivitu(idAktivity, "prihlasenoZen", aktivita.prihlasenoZen - 1);
      } else if (this.state.data.uzivatelPohlavi === "m") {
        this.zmenAktivitu(idAktivity, "prihlasenoMuzu", aktivita.prihlasenoMuzu - 1);
      }
    });
  }

  prihlas(idAktivity) {
    this.props.api.prihlas(idAktivity, (data) => {
      //přihlášen, změň stav
      console.log("přihlášen");
      this.zmenAktivitu(idAktivity, "prihlasen", true);

      let aktivita = this.state.data.aktivity.find(akt => akt.id === idAktivity);
      if (this.state.data.uzivatelPohlavi === "f") {
        this.zmenAktivitu(idAktivity, "prihlasenoZen", aktivita.prihlasenoZen + 1);
      } else if (this.state.data.uzivatelPohlavi === "m") {
        this.zmenAktivitu(idAktivity, "prihlasenoMuzu", aktivita.prihlasenoMuzu + 1);
      }
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

  zmenAktivitu(idAktivity, klic, hodnota) {
    let noveAktivity = this.state.data.aktivity.map(aktivita => {
      if (aktivita.id === idAktivity) {
        return Object.assign({}, aktivita, {[klic]: hodnota});
      }
      return aktivita;
    });
    let noveData = Object.assign({}, this.state.data, {aktivity: noveAktivity});
    this.setState({data: noveData});
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
          data = {this.state.data}
          jenVolneAktivity = {this.state.jenVolneAktivity}
          linie = {this.state.linie}
          stitky = {this.state.stitky}
          zvolenyDen = {this.state.zvolenyDen}
          zvolTutoAktivitu = {this.zvolTutoAktivitu}
        />
        {this.state.zvolenaAktivita &&
          <DetailAktivity
            api = {api}
            data = {this.state.data}
            zvolenaAktivita = {this.state.zvolenaAktivita}
            zvolTutoAktivitu = {this.zvolTutoAktivitu}
          />
        }
      </div>
    )
  }

}
