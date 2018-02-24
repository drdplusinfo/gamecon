class TymovyModal extends React.Component {
  constructor (props) {
    super(props)

    if (this.props.aktivita.prihlasen) {
      this.props.api.nactiDetailTymu(this.props.aktivita.id)
    }

    // Definice proměnných v modalu
    // TODO Zamyslet se, proč je tam první if a dát data přímo do state (nevyužívat zbytečných proměnných)
    this.aktivita = this.props.aktivita
    if (this.aktivita.tymovaData) {
      this.kapacitaMin = this.aktivita.tymovaData.minKapacita
      this.kapacitaMax = this.aktivita.tymovaData.maxKapacita
      if (!this.aktivita.tymovaData.zamcenaDo) {
        this.rezervaceVyprsi = Date.now() + 72 * 3600000
      } else {
        this.rezervaceVyprsi = new Date(this.aktivita.tymovaData.zamcenaDo)
      }
    }

    // Stavy modalu
    this.state = {
      nazevTymu: this.aktivita.tymovaData.nazevTymu,
      potencialniHraci: [],
      momentalneMax: this.aktivita.tymovaData.maxKapacita,
      idsDalsichKol: this.incializujDalsiKola()
    }

    // Bindování funkcí
    this.handleClick = this.handleClick.bind(this)
    this.pridejInputHrace = this.pridejInputHrace.bind(this)
    this.prihlasTym = this.prihlasTym.bind(this)
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
    let hraci = this.state.potencialniHraci.filter((el, index) => index !== i)
    this.setState({momentalneMax: this.state.momentalneMax - 1, potencialniHraci: hraci})
  }

  pridejInputHrace () {
    this.setState({momentalneMax: this.state.momentalneMax + 1})
  }

  prihlasTym () {
    // TODO zavolej api
    console.log('Přihlásil se tým, nutno dodělat volání API')
  }

  vytvorVyberDalsichKol () {
    if (!this.props.aktivita.tymovaData.vyberKol) {
      return null
    }

    let vyberKol = this.props.aktivita.tymovaData.vyberKol.map((kolo, index) => {
      let moznosti = kolo.map(moznost => <option value={moznost.id}>{moznost.nazev}</option>)
      let text
      if (index === 0) {
        text = <span>Další kolo(a) chci hrát v </span>
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

  zobrazPrihlaseneHrace () {
    console.log(this.aktivita.tymovaData.hraci)
    if (this.aktivita.tymovaData.hraci) {
      return this.aktivita.tymovaData.hraci.map((hrac, index) => {
        return (
          <div>
            <input type='text' key={index} value={hrac} disabled={true} />
            <br />
          </div>
        )
      })
    }
  }

  zobrazPotencialniHrace () {
    let output = []
    // Vypiš neodebratelná místa
    for (let i = 0; i < this.kapacitaMin - 1; i++) {
      output.push(
        <VyberHrace
          hraci={this.state.hraciTymovky}
          index={i}
          zmenHrace={this.zmenHrace}
        />
        , <br />
      )
    }
    // Vypiš odebratelná místa
    for (let i = this.kapacitaMin - 1; i < this.state.momentalneMax; i++) {
      output.push(
        <VyberHrace
          hraci={this.state.hraciTymovky}
          index={i}
          zmenHrace={this.zmenHrace}
        />
        ,
        <button onClick={() => this.odeberInputHrace(i)}>Odebrat hráče</button>,
        <br />
      )
    }
    if (this.state.momentalneMax < this.kapacitaMax) {
      output.push(<button onClick={this.pridejInputHrace}>Přidat hráče</button>)
    }
    return <div>{output}</div>
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
    this.props.api.prihlasTymlidra(this.aktivita.id, () => {}, (error) => console.log(error))
    return (
      <div className='tymovy-modal' onClick={this.handleClick}>
        <div className='tymovy-modal--vnitrek'>
          <div className='modal-tlacitko_zavrit' onClick={this.zrusModal}>Zrušit</div>
          <h2>Týmová aktivita</h2>
          <p>Aktivita je týmová a máš právo sestavit si tým (družinu). Po odeslání
          budou automaticky přihlášeni a informováni e-mailem.</p>
          <p>Políčka, která necháš prázdná se otevřou pro přihlášení komukoli. Ta,
          která odebereš, se znepřístupní</p>
          <Loader />
        </div>
      </div>
    )
  }

  renderModalTymlidrPrihlasen () {
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
          {this.zobrazPrihlaseneHrace()}
          {this.zobrazPotencialniHrace()}
          {this.vytvorVyberDalsichKol()}
          <button onClick={this.prihlasTym}>Přihlásit tým</button>
          <button onClick={this.props.zavriModal}>Přihlásit tým později</button>
        </div>
      </div>
    )
  }

  renderModalTymPrihlasen () {
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
          <button onClick={this.prihlasTym}>Přihlásit tým</button>
          <button onClick={this.props.zavriModal}>renderModalTymPrihlasen</button>
        </div>
      </div>
    )
  }

  render () {
    if (!this.aktivita.prihlasen) return this.renderModalNikdoNeprihlasen()
    if (this.aktivita.prihlasen) {
      if (this.aktivita.tymovaData.zamcenaDo) return this.renderModalTymlidrPrihlasen()
      return this.renderModalTymPrihlasen()
    }
  }
}
