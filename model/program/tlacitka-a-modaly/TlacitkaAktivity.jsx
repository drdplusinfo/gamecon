class TlacitkaAktivity extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      tymovyModal: false,
      kolapsovanyModal: false,
      hraci: null
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
          zobrazenTymovyModal={this.state.tymovyModal}
          zobrazTymovyModal={this.zobrazTymovyModal}
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
            hraciTymovky={this.state.hraci}
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
    console.log('Zavolal jsem funkci zobrazTymovyModal')
    this.props.api.nactiDetailTymu(this.aktivita.id, (data) => { this.setState({hraci: this.aktivita.tymovaData.hraci}); this.setState({tymovyModal: true}); console.log(this.aktivita.tymovaData) })
  }

  render () {
    return (
      this.TlacitkoDleSdruzenostiAktivity()
    )
  }
}
