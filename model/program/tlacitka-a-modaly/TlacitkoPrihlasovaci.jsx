class TlacitkoPrihlasovaci extends React.Component {
  constructor (props) {
    super(props)

    this.uzivatelMusiPockatDoOdemceni = this.uzivatelMusiPockatDoOdemceni.bind(this)
    this.uzivatelSeMusiRegistrovatNaGC = this.uzivatelSeMusiRegistrovatNaGC.bind(this)
    this.prihlasNahradnika = this.prihlasNahradnika.bind(this)
    this.odhlasNahradnika = this.odhlasNahradnika.bind(this)
    this.prihlas = this.prihlas.bind(this)
    this.odhlas = this.odhlas.bind(this)
    this.povahaTlacitka = this.povahaTlacitka.bind(this)
    this.zavolejMetoduTlacitka = this.zavolejMetoduTlacitka.bind(this)
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

  uzivatelMusiPockatDoOdemceni () {
    console.log('Jejda, tato aktivita je týmová. První, kdo se ni přihlásí, má 3 dny na sestavení týmu.<br> Pokud tým nesestaví do 3 dnů, aktivita se automaticky odemče i pro ostatní.') // TODO: Nahradit za pop-up
  }

  povahaTlacitka () {
    if (!this.props.data.spustenoPrihlasovani) {
      return null
    }
    if (!this.props.data.uzivatelPrihlasen) {
      // console.log('1')
      return {text: 'Přihlásit', metoda: this.uzivatelSeMusiRegistrovatNaGC}
    }
    if (this.aktivita.organizuje) {
      return null
    }
    if (!this.aktivita.otevrenoPrihlasovani) {
      return null
    }
    if (this.aktivita.prihlasen) {
      return {text: 'Odhlásit', metoda: this.odhlas}
    }
    if (this.aktivita.tymovaData) {
      if (this.aktivita.tymovaData.zamcenaDo) {
        return {text: 'Zamčeno', metoda: this.uzivatelMusiPockatDoOdemceni}
      }
      if (this.props.aktivitaJePlnaProPohlaviUzivatele(this.aktivita, this.props.data.uzivatelPohlavi)) {
        return null
      }
      if (this.aktivita.prihlasenoMuzu > 0 || this.aktivita.prihlasenoZen > 0) {
        // console.log('2')
        return {text: 'Přihlásit', metoda: this.prihlas}
      }
      // console.log('3')
      return {text: 'Přihlásit', metoda: this.props.zobrazTymovyModal}
    }
    if (!this.props.aktivitaJePlnaProPohlaviUzivatele(this.aktivita, this.props.data.uzivatelPohlavi)) {
      // console.log('4')
      return {text: 'Přihlásit', metoda: this.prihlas}
    }
    if (this.aktivita.prihlasenJakoNahradnik) {
      return {text: 'Odhlásit jako náhradník', metoda: this.odhlasNahradnika}
    }
    if (this.aktivita.nahradnictviMozne) {
      return {text: 'Přihlásit jako náhradník', metoda: this.prihlasNahradnika}
    }
    return null
  }

  zavolejMetoduTlacitka (povahaTlacitka) {
    /*if (this.aktivita.tymovaData) { // pokud je aktivita týmová, načti spolu s voláním i týmová data
      this.props.api.nactiDetailTymu(this.aktivita.id)
    }*/
    povahaTlacitka.metoda()
  }

  vytvorTlacitko () {
    let povahaTlacitka = this.povahaTlacitka()
    if (povahaTlacitka) {
      return (
        <button className={this.props.tridaTlacitka} onClick={(event) => { event.stopPropagation(); this.zavolejMetoduTlacitka(povahaTlacitka) }}>
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
          hraciTymovky={this.props.hraciTymovky}
          zavriModal={this.props.zavriModal}
        />}
      </div>
    )
  }
}
