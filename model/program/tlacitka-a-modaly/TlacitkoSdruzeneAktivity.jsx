class TlacitkoSdruzeneAktivity extends React.Component {
  constructor (props) {
    super(props)

    this.zobrazKolapsovanyModal = this.zobrazKolapsovanyModal.bind(this)
  }

  zobrazKolapsovanyModal (event) {
    event.stopPropagation()
    this.props.zobrazKolapsovanyModal()
  }

  render () {
    return (
      <div>
        <button onClick={this.zobrazKolapsovanyModal} className={this.props.tridaTlacitka}>
          Zobrazit aktivity
        </button>
        <KolapsovanyModal
          aktivita={this.props.aktivita}
          aktivitaJePlnaProPohlaviUzivatele={this.props.aktivitaJePlnaProPohlaviUzivatele}
          api={this.props.api}
          data={this.props.data}
          zobrazenKolapsovanyModal={this.props.zobrazenKolapsovanyModal}
          zobrazenTymovyModal={this.props.zobrazenTymovyModal}
          zobrazTymovyModal={this.props.zobrazTymovyModal}
          zavriModal={this.props.zavriModal}
        />
      </div>
    )
  }
}
