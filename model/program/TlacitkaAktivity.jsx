class TlacitkaAktivity extends React.Component {
  constructor (props) {
    super(props)

    this.zavriModal = this.zavriModal.bind(this)
    this.aktivita = this.props.aktivita
  }

  zavriModal () {
    this.props.zavriModal()
  }

  vytvorTlacitko () {
  }

  render () {
    return (
      <button>
        Přihlásit
      </button>
    )
  }
}
