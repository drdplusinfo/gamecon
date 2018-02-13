class TlacitkoPrihlasit extends React.Component {
  constructor() {
    super();

    this.state = {
      tymovyModal: false,
      kolapsovanyModal: false
    };
    this.prihlasOdhlas = this.prihlasOdhlas.bind(this);
    this.zavriModal = this.zavriModal.bind(this);
  }

  aktivitaJePlna(aktivita) {
    if (this.aktivitaJeBezOmezeni(aktivita)) {
      return false;
    }
    if (this.aktivitaJeBeznadejnePlna(aktivita)) {
      return true;
    }

    return this.aktivitaJePlnaProPohlaviUzivatele(aktivita, this.props.uzivatelPohlavi);
  }

  aktivitaJeBezOmezeni(aktivita) {
    return aktivita.kapacitaZeny + aktivita.kapacitaMuzi + aktivita.kapacitaUniverzalni === 0;
  }

  aktivitaJeBeznadejnePlna(aktivita) {
    return aktivita.prihlasenoMuzu + aktivita.prihlasenoZen >= aktivita.kapacitaZeny + aktivita.kapacitaMuzi + aktivita.kapacitaUniverzalni;
  }

  aktivitaJePlnaProPohlaviUzivatele(aktivita, pohlavi) {
    if (pohlavi === "m" && aktivita.prihlasenoMuzu >= aktivita.kapacitaMuzi + aktivita.kapacitaUniverzalni) {
      return true;
    }
    if (pohlavi === "f" && aktivita.prihlasenoZen >= aktivita.kapacitaZeny + aktivita.kapacitaUniverzalni) {
      return true;
    }
    return false;
  }

  aktivitaJePrazdnaATymova(aktivita) {
    return aktivita.tymova;  // TODO: v ostré verzi přidat && aktivita.prihlasenoZen + aktivita.prihlasenoMuzu === 0;
  }

  aktivitaSeMaKolapsovat(aktivita) {
    return aktivita.sdruzit;
  }

  maBytTlacitkoZobrazene() {
    const aktivita = this.props.aktivita;

    if (this.aktivitaSeMaKolapsovat(aktivita)) {
      return this.aktivitaSeMaKolapsovat(aktivita);
    }

    if (this.proUzivateleJeAktivitaNepristupna(aktivita)) {
      return false;
    }

    if (this.muzeSeOdhlasit(aktivita)) {
      return true;
    }

    if (this.muzeSeOdhlasitJakoNahradnik(aktivita)) {
      return true;
    }

    if (this.aktivitaJePlna(aktivita)) {
      return this.muzeSePrihlasitJakoNahradnik();
    }

    return true;
  }

  muzeSeOdhlasit(aktivita) {
    return aktivita.prihlasen;
  }

  muzeSeOdhlasitJakoNahradnik(aktivita) {
    //TODO zkontrolovat
    return aktivita.prihlasenJakoNahradnik;
  }

  muzeSePrihlasitJakoNahradnik(aktivita) {
    //TODO mělo by být aktivita.nahradnictviMozne když to bude v datech
    let nahradnictviMozne = false;
    return nahradnictviMozne;
  }

  proUzivateleJeAktivitaNepristupna(aktivita) {
    return aktivita.organizuje || !aktivita.otevrenoPrihlasovani;
  }

  odhlasZAktivity(aktivita) {
    this.props.api.odhlas(aktivita.id, (data) => {});
  }

  prihlasNaAktivitu(aktivita) {
    if (this.aktivitaSeMaKolapsovat(aktivita)) {
      this.setState({kolapsovanyModal: true});
      return;
    }

    if (this.aktivitaJePrazdnaATymova(aktivita)) {
      this.setState({tymovyModal: true});
      return;
    }

    //reálně přihlaš
    this.props.api.prihlas(aktivita.id,
      (data) => {},
      (error) => {
        console.log(error);
    });
  }

  prihlasOdhlas(event) {
    event.stopPropagation();

    if (this.props.aktivita.prihlasen) {
      this.odhlasZAktivity(this.props.aktivita);
    } else {
      this.prihlasNaAktivitu(this.props.aktivita);
    }
  }

  urciTextTlacitka() {
    const aktivita = this.props.aktivita;

    if (this.muzeSeOdhlasit(aktivita)) {
      return 'Odhlásit';
    }

    if (this.muzeSeOdhlasitJakoNahradnik(aktivita)) {
      return 'Odhlásit jako náhradník';
    }

    if (this.aktivitaJePlna(aktivita) && this.muzeSePrihlasitJakoNahradnik(aktivita)) {
      return 'Přihlásit jako náhradník';
    }

    return 'Přihlásit';
  }

  vytvorTlacitko() {
    if (this.maBytTlacitkoZobrazene()) {
      return (
        <button onClick = {this.prihlasOdhlas} className = {this.props.trida}>
          {this.urciTextTlacitka()}
        </button>
      );
    }

    return null;
  }

  zavriModal() {
    this.setState({tymovyModal: false, kolapsovanyModal: false});
  }

  render() {
    return (
      <div>
        {this.vytvorTlacitko()}
        <TymovyModal
          aktivita = {this.props.aktivita}
          api = {this.props.api}
          zavriModal = {this.zavriModal}
          zobrazen = {this.state.tymovyModal}
        />
        <KolapsovanyModal
          aktivita = {this.props.aktivita}
          api = {this.props.api}
          zavriModal = {this.zavriModal}
          zobrazen = {this.state.kolapsovanyModal}
          uzivatelPohlavi = {this.props.uzivatelPohlavi}
        />
      </div>
    );
  }
}
