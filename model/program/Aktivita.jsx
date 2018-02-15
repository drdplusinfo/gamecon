class Aktivita extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      tymovyModal: false,
      kolapsovanyModal: false,
      trida: 'bunka-aktivity_neprihlaseno'
    }

    this.TlacitkoDleSdruzenostiAktivity = this.TlacitkoDleSdruzenostiAktivity.bind(this)
    this.zavriModal = this.zavriModal.bind(this)
    this.zobrazKolapsovanyModal = this.zobrazKolapsovanyModal.bind(this)
    this.aktivita = this.props.aktivita
    this.typ = null
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

  TlacitkoDleSdruzenostiAktivity () {
    if (this.aktivita.sdruzene) {
      return (
        <TlacitkoSdruzeneAktivity
          aktivita={this.aktivita}
          api={this.props.api}
          tridaTlacitka='tlacitko_sdruzene'
          uzivatelPohlavi={this.props.uzivatelPohlavi}
          zobrazenKolapsovanyModal={this.state.kolapsovanyModal}
          zobrazKolapsovanyModal={this.zobrazKolapsovanyModal}
          zavriModal={this.zavriModal}
        />
      )
    } else {
      return (
        <TlacitkaAktivity
          aktivita={this.aktivita}
          api={this.props.api}
          tridaTlacitka='tlacitko_nesdruzene'
          uzivatelPohlavi={this.props.uzivatelPohlavi}
          zobrazenTymovyModal={this.state.tymovyModal}
          zavriModal={this.zavriModal}
        />
      )
    }
  }

  urciTriduBunky () {
    if (this.aktivita.organizuje) {
      this.state.trida = 'organizuje' // uživatel je vypravěč
    } else if (!this.aktivita.otevrenoPrihlasovani) {
      this.state.trida = 'prihlaseniNemozne' // na aktivitu se nedá přihlásit
    } else {
      if (!this.aktivita.prihlasen) {
        if (!this.aktivitaJePlnaProPohlaviUzivatele(this.aktivita, this.props.uzivatelPohlavi)) { // je
          this.state.trida = 'neprihlasen'
        } else {
          this.state.trida = 'prihlaseniNemozne'
          }
        }
      }
    }
  }
  // TODO Manik: Toto bude potřeba dodělat dle tabulky, dále pak podminky k tlačítkům

  zavriModal () {
    this.setState({tymovyModal: false, kolapsovanyModal: false})
  }

  zobrazKolapsovanyModal () {
    this.setState({kolapsovanyModal: true})
  }

  render () {
    return (
      <td colSpan={this.aktivita.delka} className={this.state.trida} onClick={() => this.props.zvolTutoAktivitu(this.aktivita)}>
        <span>{this.aktivita.nazev}</span>
        <br />
        <ZobrazeniKapacity
          aktivita={this.aktivita}
          tridy={{
            tridaZeny: 'kapacita-zeny',
            tridaMuzi: 'kapacita-muzi',
            tridaUniverzalni: 'kapacita-univerzalni',
            tridaKapacita: 'kapacita'
          }}
        />
        {this.TlacitkoDleSdruzenostiAktivity()}
      </td>
    )
  }
}
