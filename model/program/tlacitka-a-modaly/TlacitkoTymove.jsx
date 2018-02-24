class TlacitkoTymove extends React.Component {
  constructor (props) {
    super(props)

    this.povahaTlacitka = this.povahaTlacitka.bind(this)
    this.aktivita = this.props.aktivita
  }

  povahaTlacitka () {
    if (this.aktivita.tymovaData && this.aktivita.prihlasen) {
      if (this.aktivita.tymovaData.zamcenaDo) {
        return {text: 'Vybrat tým', metoda: this.props.zobrazTymovyModal}
      }
      return {text: 'Upravit tým', metoda: this.props.zobrazTymovyModal}
    }
    return null
  }

  vytvorTlacitko () {
    let povahaTlacitka = this.povahaTlacitka()
    if (povahaTlacitka) {
      return (
        <button className={this.props.tridaTlacitka} onClick={(event) => { event.stopPropagation(); povahaTlacitka.metoda() }}>
          {povahaTlacitka.text}
        </button>
      )
    } else {
      return null
    }
  }

  render () {
    return (
      <div>
        {this.vytvorTlacitko()}
        {this.props.zobrazenTymovyModal &&
        <TymovyModal
          aktivita={this.aktivita}
          api={this.props.api}
          zavriModal={this.props.zavriModal}
        />}
      </div>
    )
  }
}
