class TlacitkaAktivity extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      tymovyModal: false,
      kolapsovanyModal: false,
    }

    this.aktivita = this.props.aktivita
    this.TlacitkoDleSdruzenostiAktivity = this.TlacitkoDleSdruzenostiAktivity.bind(this)
    this.zavriModal = this.zavriModal.bind(this)
    this.zobrazKolapsovanyModal = this.zobrazKolapsovanyModal.bind(this)
    this.zobrazTymovyModal = this.zobrazTymovyModal.bind(this)
  }

  TlacitkoDleSdruzenostiAktivity () {
    if (this.aktivita.sdruzene) {
      return (
        <TlacitkoSdruzeneAktivity
          aktivita={this.aktivita}
          aktivitaJePlnaProPohlaviUzivatele={this.props.aktivitaJePlnaProPohlaviUzivatele}
          api={this.props.api}
          data={this.props.data}
          tridaTlacitka='tlacitko_sdruzene'
          zobrazenKolapsovanyModal={this.state.kolapsovanyModal}
          zobrazKolapsovanyModal={this.zobrazKolapsovanyModal}
          zavriModal={this.zavriModal}
        />
      )
    } else {
      return (
        <div>
          <TlacitkoPrihlasovaci
            aktivita={this.aktivita}
            aktivitaJePlnaProPohlaviUzivatele={this.props.aktivitaJePlnaProPohlaviUzivatele}
            api={this.props.api}
            data={this.props.data}
            tridaTlacitka='tlacitko_prihlasit'
            zavriModal={this.zavriModal}
            zobrazenTymovyModal={this.state.tymovyModal}
            zobrazTymovyModal={this.zobrazTymovyModal}
          />
          <TlacitkoTymove
            aktivita={this.aktivita}
            aktivitaJePlnaProPohlaviUzivatele={this.props.aktivitaJePlnaProPohlaviUzivatele}
            api={this.props.api}
            tridaTlacitka='tlacitko_tym'
            zavriModal={this.zavriModal}
            zobrazenTymovyModal={this.state.tymovyModal}
            zobrazTymovyModal={this.zobrazTymovyModal}
          />
        </div>
      )
    }
  }

  zavriModal () {
    this.setState({tymovyModal: false, kolapsovanyModal: false})
  }

  zobrazKolapsovanyModal () {
    this.setState({kolapsovanyModal: true})
  }

  zobrazTymovyModal () {
    this.setState({tymovyModal: true})
  }

  render () {
    return (
      this.TlacitkoDleSdruzenostiAktivity()
    )
  }
}
