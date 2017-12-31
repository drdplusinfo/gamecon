class TlacitkoPrihlasit extends React.Component {
  constructor() {
    super();

    this.state = {
      tymovyModal: false
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

  muzeSePrihlasit() {
    let akt = this.props.aktivita;
    //metoda zjišťuje, jestli se tlačítko přihlásit vůbec má zobrazit
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
    //nějak odhlaš
    this.props.api.odhlas(this.props.aktivita.id, function(data) {
      //odhlášen
    });
  }

  prihlas() {
    let akt = this.props.aktivita;
    if (akt.tymova) {
      //když je týmová a první přihlášený, ukaž modal
      this.setState({tymovyModal: true});
      return;
    }

    this.props.api.prihlas(akt.id, function(data) {
      //Hurá, přihlášen, co víc může člověk chtít?
    }, function(chyba) {
      //TODO: jak zobrazit tuto chybu hezky?
      alert(chyba);
    })
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
    this.setState({tymovyModal: false});
  }

  render() {
    let tlacitko = this.muzeSePrihlasit() ?
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
       </div>
    );
  }

}
