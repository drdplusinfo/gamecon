class TlacitkoSdruzeneAktivity extends React.Component {
  constructor (props) {
    super(props)

    this.zavriModal = this.zavriModal.bind(this)
    this.zobrazKolapsovanyModal = this.zobrazKolapsovanyModal.bind(this)
  }

  zavriModal () {
    this.props.zavriModal()
  }

  zobrazKolapsovanyModal () {
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
          uzivatelPohlavi={this.props.uzivatelPohlavi}
          zobrazen={this.props.kolapsovanyModal}
          zavriModal={this.zavriModal}
        />
      </div>
    )
  }
}
