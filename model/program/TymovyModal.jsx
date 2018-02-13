class TymovyModal extends React.Component {
  constructor(props) {
    super(props);

    //jestli už hráč vyplňoval tým a klikl přihlásit později, v datech aktivity
    //by mělo být nějaké info - jméno týmu, vypnění hráči
    //jestli ne, bude jméno týmu prázdný string a hráči prázdné pole
    //každopádně by tam taky mělo být minimum a maximum hráčů a kolik je momentálně
    //aktivních míst
    //TODO: toto vše se vezme z dat aktivity, tzn. z props
    let tym = "Kačičky", hraci = ["Pepa", "Honza", "Fedor", "Vasilij"], momentalneMax = 4;
    let kapacitaMin = 1, kapacitaMax = 5, rezervaceVyprsi = Date.now() + 72*3600000;

    this.kapacitaMin = kapacitaMin;
    this.kapacitaMax = kapacitaMax;
    this.rezervaceVyprsi = rezervaceVyprsi;
    this.state = {
      tym: tym,
      hraci: hraci,
      momentalneMax: momentalneMax
    }

    this.handleClick = this.handleClick.bind(this);
    this.prihlasit = this.prihlasit.bind(this);
    this.prihlasitPozdeji = this.prihlasitPozdeji.bind(this);
    this.zavriModal = this.zavriModal.bind(this);
    this.zmenTym = this.zmenTym.bind(this);
    this.zmenHrace = this.zmenHrace.bind(this);
  }

  handleClick(event) {
    //nechceme, aby event vybublal a dělal bordel
    event.stopPropagation();
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

  zmenTym(event) {
    this.setState({tym: event.target.value});
  }

  render() {
    /* týmový modal je "neviditelný" když není zobrazen. Protože nechceme, aby byl při
    zavření zničen, chceme, aby si držel data */
    if (!this.props.zobrazen) {
      return null;
    }
    return (
      <div className = "tymovy-modal" onClick = {this.handleClick}>
        <div className = "tymovy-modal--vnitrek">
          <div className = "modal-tlacitko_zavrit" onClick = {this.zavriModal}>Zavřít</div>
          <h2>Týmová aktivita</h2>
          <p>Aktivita je týmová a máš právo sestavit si tým (družinu). Po odeslání
          budou automaticky přihlášeni a informováni e-mailem.</p>
          <p>Políčka, která necháš prázdná se otevřou pro přihlášení komukoli. Ta,
          která odebereš, se znepřístupní</p>
          <p>Na vyplnění zbývá</p>
          <Casovac rezervaceVyprsi = {this.rezervaceVyprsi}/>
          <input
            onChange = {this.zmenTym}
            placeholder = "jméno týmu"
            type = "text"
            value = {this.state.tym} />
          {this.vytvorVyberHracu()}
          <button onClick = {this.prihlasit}>Přihlásit</button>
          <button onClick = {this.prihlasitPozdeji}>Přihlásit hráče později</button>
        </div>
      </div>
    );
  }
}
