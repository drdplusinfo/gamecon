class TymovyModal extends React.Component {
  constructor (props) {
    super(props)

    // Při konstruování týmového modalu načti kompletní týmová data
    if (this.props.aktivita.prihlasen) {
      this.props.api.nactiDetailTymu(this.props.aktivita.id, () => { this.inicializujDalsiKola() }, (error) => console.log(error))
    }

    // Definice proměnných v modalu
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
    if (this.aktivita.prihlasen && !this.aktivita.tymovaData.zamcenaDo && this.aktivita.tymovaData.hraci) {
      this.momentalneMax = this.aktivita.kapacitaUniverzalni
    } else {
      this.momentalneMax = this.aktivita.tymovaData.maxKapacita
    }

    // Stavy modalu
    this.state = {
      nazevTymu: this.aktivita.tymovaData.nazevTymu,
      potencialniHraci: this.incializujPotencialniHrace(),
      momentalneMax: this.momentalneMax,
      idsDalsichKol: []
    }

    // Bindování funkcí
    this.handleClick = this.handleClick.bind(this)
    this.inicializujDalsiKola = this.inicializujDalsiKola.bind(this)
    this.pridejInputHrace = this.pridejInputHrace.bind(this)
    this.prihlasTym = this.prihlasTym.bind(this)
    this.zrusModal = this.zrusModal.bind(this)
    this.zmenNazevTymu = this.zmenNazevTymu.bind(this)
    this.zmenHrace = this.zmenHrace.bind(this)
  }

  handleClick (event) {
    event.stopPropagation()
  }

  inicializujDalsiKola () {
    let idsPrvnichTerminu = this.aktivita.tymovaData.vyberKol.map((kolo) => {
      return kolo[0].id
    })
    this.setState({idsDalsichKol: idsPrvnichTerminu})
  }

  incializujPotencialniHrace () {
    // Vrať pole potenciálních hráčů mínus TymLidr
    return new Array(this.kapacitaMax - 1).fill({
      jmeno: '',
      id: null,
      zvolen: false
    })
  }

  odeberInputHrace (i) {
    let hraci = this.state.potencialniHraci.filter((el, index) => index !== i)
    this.setState({momentalneMax: this.state.momentalneMax - 1, potencialniHraci: hraci})
  }

  pridejInputHrace () {
    let hraci = this.state.potencialniHraci.slice()
    hraci.push({
      jmeno: '',
      id: null,
      zvolen: false
    })
    this.setState({
      momentalneMax: this.state.momentalneMax + 1,
      potencialniHraci: hraci
    })
  }

  prihlasTym () {
    let idsSpoluhracu = []
    this.state.potencialniHraci.map((hrac, index) => {
      if (hrac.id) {
        idsSpoluhracu.push(hrac.id)
      }
    })
    this.props.api.prihlasTym(this.aktivita.id, idsSpoluhracu, this.state.nazevTymu, this.state.momentalneMax, this.state.idsDalsichKol, () => {}, (error) => console.log(error))
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
    // Vypiš neodebratelná místa mínus TymLidr
    for (let i = 0; i < this.kapacitaMin - 1; i++) {
      output.push(
        <VyberHrace
          hraci={this.state.potencialniHraci}
          index={i}
          zmenHrace={this.zmenHrace}
          api = {this.props.api}
        />
        , <br />
      )
    }
    // Vypiš odebratelná místa mínus TymLidr
    for (let i = this.kapacitaMin - 1; i < this.state.momentalneMax - 1; i++) {
      output.push(
        <VyberHrace
          hraci={this.state.potencialniHraci}
          index={i}
          zmenHrace={this.zmenHrace}
          api = {this.props.api}
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

  zobrazVolnaMista () {
    let output = []
    for (let i = this.aktivita.tymovaData.hraci.length; i < this.state.momentalneMax; i++) {
      output.push(
        <input type='text' value='volné místo (může se přihlásit kdokoliv)' disabled={true} />
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

  zmenHrace (index, novaHodnota) {
    let hraci = this.state.potencialniHraci.slice()
    hraci[index] = novaHodnota
    this.setState({potencialniHraci: hraci})
  }

  zmenNazevTymu (event) {
    this.setState({nazevTymu: event.target.value})
  }

  renderModalCekaNaNacteniDat () {
    // po vyrenderování modalu se aktivita zamče a přihlásí se týmlídr
    this.props.api.prihlasTymlidra(this.aktivita.id, () => { this.inicializujDalsiKola() }, (error) => console.log(error))
    return (
      <div className='tymovy-modal' onClick={this.handleClick}>
        <div className='tymovy-modal--vnitrek'>
          <div className='modal-tlacitko_zavrit' onClick={this.zrusModal}>Odhlásit a zrušit</div>
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
          <button onClick={() => { this.prihlasTym(); this.props.zavriModal() }}>Přihlásit tým</button>
          <button onClick={this.props.zavriModal}>Přihlásit tým později</button>
        </div>
      </div>
    )
  }

  renderModalTymPrihlasen () {
    let output
    if (this.aktivita.tymovaData.hraci) {
      output =
        <div>
          <div>{this.state.nazevTymu}</div>
          {this.zobrazPrihlaseneHrace()}
          {this.zobrazVolnaMista()}
          <button onClick={() => { this.props.api.nastavKapacituTymu(this.aktivita.id, this.state.momentalneMax); this.props.zavriModal() }}>Potvrď novou kapacitu</button>
        </div>
    } else {
      output = <Loader />
    }
    return (
      <div className='tymovy-modal' onClick={this.handleClick}>
        <div className='tymovy-modal--vnitrek'>
          <div className='modal-tlacitko_zavrit' onClick={this.props.zavriModal}>Zavřít</div>
          <h2>Týmová aktivita</h2>
          <p>Aktivita je týmová a tvůj tým (družina) je již přihlášen. Nyní můžeš jen odebírat nebo přidávat místa, která se otevřou pro přihlášení komukoli.</p>
          {output}
        </div>
      </div>
    )
  }

  render () {
    if (!this.aktivita.prihlasen) return this.renderModalCekaNaNacteniDat()
    if (this.aktivita.prihlasen) {
      if (this.aktivita.tymovaData.zamcenaDo) return this.renderModalTymlidrPrihlasen()
      return this.renderModalTymPrihlasen()
    }
  }
}
