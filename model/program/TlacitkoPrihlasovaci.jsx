class TlacitkoPrihlasovaci extends React.Component {
  constructor (props) {
    super(props)

    this.povahaTlacitka = this.povahaTlacitka.bind(this)
    this.prihlas = this.prihlas.bind(this)
    this.odhlas = this.odhlas.bind(this)
    this.aktivita = this.props.aktivita
  }

  odhlas () {
    this.props.api.odhlas(this.aktivita.id,
      (data) => {},
      (error) => {
        console.log(error)
      })
  }

  odhlasNahradnika () {
    console.log('Odhlášen jako náhradník') // TODO: Nahradit za reálnou metodu až bude implementována
  }

  prihlas () {
    this.props.api.prihlas(this.aktivita.id,
      (data) => {},
      (error) => {
        console.log(error)
      })
  }

  prihlasNahradnika () {
    console.log('Přihlášen jako náhradník') // TODO: Nahradit za reálnou metodu až bude implementována
  }

  uzivatelSeMusiRegistrovatNaGC () {
    console.log('Před přihlášením na aktivitu se nejdřív <a href="/prihlaska">zaregistruj na Gamecon</a>. Není to nic těžkého, zvládneš to za 5 minut.') // TODO: Nahradit za pop-up
  }

  povahaTlacitka () {
    if (!this.props.data.spustenoPrihlasovani) {
      console.log('0')
      return null
    }
    if (!this.props.data.uzivatelPrihlasen) {
      console.log('1')
      return {text: 'Přihlásit', metoda: this.uzivatelSeMusiRegistrovatNaGC}
    }
    if (this.aktivita.organizuje) {
      console.log('2')
      return null
    }
    if (!this.aktivita.otevrenoPrihlasovani) {
      console.log('3')
      return null
    }
    if (this.aktivita.prihlasen) {
      console.log('4')
      return {text: 'Odhlásit', metoda: this.odhlas}
    }
    if (!this.props.aktivitaJePlnaProPohlaviUzivatele(this.aktivita, this.props.data.uzivatelPohlavi)) {
      console.log('5')
      return {text: 'Přihlásit', metoda: this.prihlas}
    }
    if (this.aktivita.prihlasenJakoNahradnik) {
      console.log('6')
      return {text: 'Odhlásit jako náhradník', metoda: this.prihlasNahradnika}
    }
    if (this.aktivita.nahradnictviMozne) {
      console.log('7')
      return {text: 'Přihlásit jako náhradník', metoda: this.odhlasNahradnika}
    }
    console.log('8')
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
        <TymovyModal
          aktivita={this.aktivita}
          api={this.props.api}
          zavriModal={this.props.zavriModal}
          zobrazen={this.props.zobrazenTymovyModal}
        />
      </div>
    )
  }
}
