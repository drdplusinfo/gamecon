class TymovyModal extends React.Component {
  constructor (props) {
    super(props)

    this.props.api.nactiDetailTymu(this.aktivita.id)

    // Definice proměnných v modalu
    this.aktivita = this.props.aktivita
    if (this.aktivita.tymovaData) {
      this.nazevTymu = this.aktivita.tymovaData.nazevTymu
      this.hraci = this.aktivita.tymovaData.hraci
      this.kapacitaMin = this.aktivita.tymovaData.minKapacita
      this.kapacitaMax = this.aktivita.tymovaData.maxKapacita
      this.momentalneMax = 4
      if (!this.aktivita.zamcenaDo) {
        this.rezervaceVyprsi = Date.now() + 72 * 3600000
      } else {
        this.rezervaceVyprsi = this.props.aktivita.zamcenaDo
      }
    }

    // Stavy modalu
    this.state = {
      nazevTymu: this.nazevTymu,
      hraciTymovky: this.hraci,
      momentalneMax: this.momentalneMax,
      idsDalsichKol: this.incializujDalsiKola()
    }

    // Bindování funkcí
    this.handleClick = this.handleClick.bind(this)
    this.prihlasit = this.prihlasit.bind(this)
    this.prihlasitPozdeji = this.prihlasitPozdeji.bind(this)
    this.zrusModal = this.zrusModal.bind(this)
    this.zmenNazevTymu = this.zmenNazevTymu.bind(this)
    this.zmenHrace = this.zmenHrace.bind(this)
  }

  handleClick (event) {
    event.stopPropagation()
  }

  incializujDalsiKola () {
    if (this.aktivita.tymovaData.idsDalsichKol) {
      let idsPrvnichTerminu = this.aktivita.tymovaData.idsDalsichKol.map(kolo => kolo[0].id)
      return idsPrvnichTerminu
    }
    return []
  }

  odeberInputHrace (i) {
    let hraci = this.props.hraciTymovky.filter((el, index) => index !== i)
    this.setState({momentalneMax: this.state.momentalneMax - 1, hraci: hraci})
  }

  pridejInputHrace () {
    this.setState({momentalneMax: this.state.momentalneMax + 1})
  }

  prihlasit () {
    // TODO zavolej api
    this.props.zavriModal()
  }

  prihlasitPozdeji () {
    if (this.props.aktivita.prihlasen) {
      this.props.zavriModal()
    } else {
      this.props.api.prihlasTymlidra(this.props.aktivita.id)
    }
  }

  vytvorVyberDalsichKol () {
    if (!this.props.aktivita.tymovaData.vyberKol) {
      return null
    }

    let vyberKol = this.props.aktivita.tymovaData.vyberKol.map((kolo, index) => {
      let moznosti = kolo.map(moznost => <option value={moznost.id}>{moznost.nazev}</option>)
      let text
      if (index === 0) {
        text = <span>Další kolo(a) chci hrát v</span>
      } else {
        text = <span>a</span>
      }
      return (
        <div>
          {text}
          <select value={this.state.idsDalsichKol[index]} onChange={(event) => this.zmenVyberKola(index, event.target.value)}>
            {moznosti}
          </select>
        </div>
      )
    })
    console.log(vyberKol)
    return (
      <div>
        {vyberKol}
      </div>
    )
  }

  zmenVyberKola (index, noveId) {
    let noveIdsKol = this.state.idsDalsichKol.slice()
    noveIdsKol[index] = noveId
    this.setState({
      idsDalsichKol: noveIdsKol
    })
  }

  vytvorVyberHracu () {
    console.log('Zavolal jsem funkci vytvorVyberHracu')
    let output = []
    for (let i = 0; i < this.kapacitaMax; i++) {
      if (i < this.kapacitaMin) {
        // Na začátku jsou neodobratelná místa
        output.push(
          <VyberHrace
            hrac={this.state.hraciTymovky[i]}
            hraci={this.state.hraciTymovky}
            index={i}
            zmenHrace={this.zmenHrace}
          />
          , <br />
        )
      } else if (i < this.state.momentalneMax) {
        // Pak následují odebratelná místa
        output.push(
          <VyberHrace
            hrac={this.state.hraciTymovky[i]}
            hraci={this.state.hraciTymovky}
            index={i}
            zmenHrace={this.zmenHrace}
          />
        )
        output.push(
          <button onClick={() => this.odeberInputHrace(i)}>x</button>
          , <br />
        )
      } else {
        // Na závěr jsou místa, které je možné přidat
        output.push(
          <button onClick={() => this.pridejInputHrace()}>+</button>
          , <br />
        )
      }
    }
    return (
      <div>
        {output}
      </div>
    )
  }

  zrusModal () {
    this.props.zavriModal()
    this.props.api.odhlas(this.aktivita.id)
  }

  zmenHrace (index, noveJmeno) {
    let hraci = this.props.hraciTymovky.slice()
    hraci[index] = noveJmeno
    this.setState({hraci: hraci})
  }

  zmenNazevTymu (event) {
    this.setState({nazevTymu: event.target.value})
  }

  renderModalNikdoNeprihlasen () {
    // po vyrenderování modalu se aktivita zamče a přihlásí se týmlídr
    this.props.api.prihlasTymlidra(this.aktivita.id)
    return (
      <div className='tymovy-modal' onClick={this.handleClick}>
        <div className='tymovy-modal--vnitrek'>
          <div className='modal-tlacitko_zavrit' onClick={this.zrusModal}>Zrušit</div>
          <h2>Týmová aktivita</h2>
          <p>Aktivita je týmová a máš právo sestavit si tým (družinu). Po odeslání
          budou automaticky přihlášeni a informováni e-mailem.</p>
          <p>Políčka, která necháš prázdná se otevřou pro přihlášení komukoli. Ta,
          která odebereš, se znepřístupní</p>
          <p>Na vyplnění zbývá</p>
          <Casovac rezervaceVyprsi={this.rezervaceVyprsi} />
          <input
            onChange={this.zmenNazevTymu}
            placeholder='Název týmu (družiny)'
            type='text'
            value={this.state.nazevTymu} />
          {this.vytvorVyberHracu()}
          {this.vytvorVyberDalsichKol()}
          <button onClick={this.prihlasit}>Přihlásit</button>
          <button onClick={this.prihlasitPozdeji}>Přihlásit hráče později</button>
        </div>
      </div>
    )
  }

  renderModalTymlidrPrihlasen () {

  }

  renderModalTymPrihlasen () {

  }

  render () {
    if (this.aktivita.tymovaData.hraci === null) return this.renderModalNikdoNeprihlasen()
    if (this.aktivita.tymovaData.hraci) {
      if (this.aktivita.zamcenaDo) return this.renderModalTymlidrPrihlasen()
      return this.renderModalTymPrihlasen()
    }
  }
}
