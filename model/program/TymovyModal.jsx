class TymovyModal extends React.Component {
  constructor (props) {
    super(props)

    // Definice proměnných v modalu
    this.aktivita = this.props.aktivita
    if (this.aktivita.tymovaData) {
      var nazevTymu = this.aktivita.tymovaData.nazevTymu
      var hraci = this.aktivita.tymovaData.hraci
      this.kapacitaMin = this.aktivita.tymovaData.minKapacita
      this.kapacitaMax = this.aktivita.tymovaData.maxKapacita
      var momentalneMax = 4
      if (!this.aktivita.zamcenaDo) {
        this.rezervaceVyprsi = Date.now() + 72 * 3600000
      } else {
        this.rezervaceVyprsi = this.props.aktivita.zamcenaDo
      }
    }

    // Stavy modalu
    this.state = {
      nazevTymu: nazevTymu,
      hraci: hraci,
      momentalneMax: momentalneMax
    }

    // Bindování funkcí
    this.handleClick = this.handleClick.bind(this)
    this.prihlasit = this.prihlasit.bind(this)
    this.prihlasitPozdeji = this.prihlasitPozdeji.bind(this)
    this.zavriModal = this.zavriModal.bind(this)
    this.zmenNazevTymu = this.zmenNazevTymu.bind(this)
    this.zmenHrace = this.zmenHrace.bind(this)
  }

  handleClick (event) {
    event.stopPropagation()
  }

  odeberInputHrace(i) {
    let hraci = this.state.hraci.filter((el, index) => index !== i);
    this.setState({momentalneMax: this.state.momentalneMax - 1, hraci: hraci});
  }

  pridejInputHrace() {
    this.setState({momentalneMax: this.state.momentalneMax + 1});
  }

  prihlasit() {
    //TODO zavolej api
    this.props.zavriModal();
  }

  prihlasitPozdeji() {
    if (this.props.aktivita.prihlasen) {
      this.props.zavriModal();
    }
    else {
      this.props.api.prihlasTymlidra(this.props.aktivita.id);
    }
  }

  vytvorVyberHracu() {
    let output = [];
    for (let i = 0; i < this.kapacitaMax; i++) {
      if (i < this.kapacitaMin) {
        //Na začátku jsou neodobratelná místa
        output.push(
          <VyberHrace
            hrac = {this.state.hraci[i]}
            hraci = {this.state.hraci}
            index = {i}
            zmenHrace = {this.zmenHrace}
          />
          , <br/>
        );
      } else if (i < this.state.momentalneMax) {
        //Pak následují odebratelná místa
        output.push(
          <VyberHrace
            hrac = {this.state.hraci[i]}
            hraci = {this.state.hraci}
            index = {i}
            zmenHrace = {this.zmenHrace}
          />
        );
        output.push(
          <button onClick = {() => this.odeberInputHrace(i)}>x</button>
          , <br/>
        );
      } else {
        //Na závěr jsou místa, které je možné přidat
        output.push(
          <button onClick = {() => this.pridejInputHrace()}>+</button>
          , <br/>
        );
      }
    }
    return (
      <div>
        {output}
      </div>
    );
  }

  zavriModal() {
    this.props.zavriModal();
  }

  zmenHrace(index, noveJmeno) {
    let hraci = this.state.hraci.slice();
    hraci[index] = noveJmeno;
    this.setState({hraci: hraci});
  }

  zmenNazevTymu(event) {
    this.setState({nazevTymu: event.target.value});
  }

  render() {
    /* týmový modal je "neviditelný" když není zobrazen. Protože nechceme, aby byl při
    zavření zničen, chceme, aby si držel data */
    if (!this.props.zobrazenTymovyModal) {
      return null;
    }
    console.log(this.aktivita.tymovaData)
    return (
      <div className='tymovy-modal' onClick={this.handleClick}>
        <div className='tymovy-modal--vnitrek'>
          <div className='modal-tlacitko_zavrit' onClick={this.zavriModal}>Zavřít</div>
          <h2>Týmová aktivita</h2>
          <p>Aktivita je týmová a máš právo sestavit si tým (družinu). Po odeslání
          budou automaticky přihlášeni a informováni e-mailem.</p>
          <p>Políčka, která necháš prázdná se otevřou pro přihlášení komukoli. Ta,
          která odebereš, se znepřístupní</p>
          <p>Na vyplnění zbývá</p>
          <Casovac rezervaceVyprsi={this.rezervaceVyprsi}/>
          <input
            onChange={this.zmenNazevTymu}
            placeholder='jméno týmu'
            type='text'
            value={this.state.tym} />
          {this.vytvorVyberHracu()}
          <button onClick={this.prihlasit}>Přihlásit</button>
          <button onClick={this.prihlasitPozdeji}>Přihlásit hráče později</button>
        </div>
      </div>
    )
  }
}
