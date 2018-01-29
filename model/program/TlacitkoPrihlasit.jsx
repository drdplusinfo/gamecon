class TlacitkoPrihlasit extends React.Component {
  constructor() {
    super();

    this.state = {
      tymovyModal: false,
      drdModal: false
    };
    this.prihlasOdhlas = this.prihlasOdhlas.bind(this);
    this.zavriModal = this.zavriModal.bind(this);
  }

  aktivitaPlna() {
    let akt = this.props.aktivita;
    if (akt.kapacitaZeny + akt.kapacitaMuzi + akt.kapacitaUniverzalni === 0) {
      //když je kapacita nula, aktivita je bez omezení
      return false;
    }

    if (akt.prihlasenoMuzu + akt.prihlasenoZen >= akt.kapacitaZeny + akt.kapacitaMuzi + akt.kapacitaUniverzalni) {
      //beznadějně plno
      return true;
    }

    //testujeme kapacitu pro uživatelovo pohlaví
    let pohlavi = this.props.uzivatelPohlavi;
    if (pohlavi === "m" && akt.prihlasenoMuzu >= akt.kapacitaMuzi + akt.kapacitaUniverzalni) {
      return true;
    }
    if (pohlavi === "f" && akt.prihlasenoZen >= akt.kapacitaZeny + akt.kapacitaUniverzalni) {
      return true;
    }

    return false;
  }

  muzeKlikatTlacitko() {
    let akt = this.props.aktivita;
    //metoda zjišťuje, jestli se tlačítko přihlásit vůbec má zobrazit
    if (akt.prihlasen) {
      return true;
    }

    if (akt.organizuje || !akt.otevrenoPrihlasovani || akt.probehnuta) {
      //return false;
    }

    //TODO mělo by být akt.nahradnictviMozne když to tam bude
    let nahradnictviMozne = false;
    if (this.aktivitaPlna() && !nahradnictviMozne) {
      return false;
    }

    return true;
  }

  odhlas() {
    this.props.api.odhlas(this.props.aktivita.id);
  }

  prihlas() {
    let akt = this.props.aktivita;
    //TODO: doplň check na prvního přihlášeného
    if (akt.tymova) {
      if (akt.nazev.includes('Čtvrtfinále')) {
        this.setState({drdModal: true});
      }
      else {
      //když je týmová a první přihlášený, ukaž modal
      this.setState({tymovyModal: true});
      return;
      //reálně přihlaš
      this.props.api.prihlas(akt.id);
      }
    }
  return;
  }

  prihlasOdhlas(event) {
    event.stopPropagation();

    if (this.props.aktivita.prihlasen) {
      this.odhlas();
    } else {
      this.prihlas();
    }
  }

  zavriModal() {
    this.setState({tymovyModal: false, drdModal: false});
  }

  render() {
    let tlacitko = this.muzeKlikatTlacitko() ?
     <button onClick = {this.prihlasOdhlas} className = {this.props.trida}>
       {this.props.aktivita.prihlasen ? 'Odhlásit' : 'Přihlásit'}
     </button>
     : null;

    return (
       <div>
         {tlacitko}
         {this.props.aktivita.tymova &&
           <TymovyModal
             aktivita = {this.props.aktivita}
             api = {this.props.api}
             zavriModal = {this.zavriModal}
             zobrazen = {this.state.tymovyModal}
           />
        }
        <DrdModal
          aktivita = {this.props.aktivita}
          zavriModal = {this.zavriModal}
          zobrazen = {this.state.drdModal}
        />
       </div>
    );
  }

}
