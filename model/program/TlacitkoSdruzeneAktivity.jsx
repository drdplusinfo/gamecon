class TlacitkoSdruzeneAktivity extends React.Component {
  constructor (props) {
    super(props)

    this.zavriModal = this.zavriModal.bind(this)
    this.zobrazKolapsovanyModal = this.zobrazKolapsovanyModal.bind(this)
  }

  zavriModal () {
    this.props.zavriModal()
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
          api={this.props.api}
          data={this.props.data}
          zobrazen={this.props.zobrazenKolapsovanyModal}
          zavriModal={this.zavriModal}
        />
      </div>
    )
  }
}
