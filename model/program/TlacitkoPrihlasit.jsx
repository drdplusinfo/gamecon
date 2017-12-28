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
    if (akt.kapacita_f + akt.kapacita_m + akt.kapacita_u === 0) {
      //když je kapacita nula, aktivita je bez omezení
      return false;
    }

    if (akt.prihlaseno_m + akt.prihlaseno_f >= akt.kapacita_f + akt.kapacita_m + akt.kapacita_u) {
      //beznadějně plno
      return true;
    }

    //provizorně testujeme s mužem, TODO pak bude třeba předat pohlaví v props
    let pohlavi = "m";
    if (pohlavi === "m" && akt.prihlaseno_m >= akt.kapacita_m + akt.kapacita_u) {
      return true;
    }
    if (pohlavi === "f" && akt.prihlaseno_f >= akt.kapacita_f + akt.kapacita_u) {
      return true;
    }

    return false;
  }

  muzeSePrihlasit() {
    let akt = this.props.aktivita;
    //metoda zjišťuje, jestli se tlačítko přihlásit vůbec má zobrazit
    if (akt.organizuje || !akt.otevreno_prihlasovani || akt.probehnuta) {
      //return false;
    }

    //TODO mělo by být akt.nahradnictvi_mozne když to tam bude
    let nahradnictvi_mozne = false;
    if (this.aktivitaPlna() && !nahradnictvi_mozne) {
      return false;
    }

    return true;
  }

  odhlas() {
    //nějak odhlaš
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
