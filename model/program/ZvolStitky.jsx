class ZvolStitky extends React.Component {
  constructor(props) {
    super(props);

    //Používáme react-autosuggest https://github.com/moroshko/react-autosuggest
    //Je to kontrolovaná komponenta, držime v stave value input pole
    //suggestions jsou na začátku prázdné, protože box s návrhy je zavřený
    //zvolené štítky je pole názvů štítku, které jsou zvolené. Potřebujeme je tady
    //uchovávat, aby si zachovávaly pořadí, ve kterém byly přidány
    this.state = {
      value: '',
      suggestions: [],
      zvoleneStitky: []
    };

    this.onChange = this.onChange.bind(this);
  }

  //Změní štítky výše v hierarchii pomocí funkce zmenStitky, kterou máme v props
  //Přepne jesli je štítek zvolený nebo ne
  prepniStitek(nazevStitku, zvoleny) {
    let zmeneneStitky = this.props.stitky.map(stitek => {
      if(stitek.nazev === nazevStitku){
        stitek.zvoleny = zvoleny;
      }
      return stitek;
    })
    this.props.zmenStitky(zmeneneStitky);
  }

  //přidej štítek do pole zvolených štítků, jestli tam už není a přepni ho na zapnutý
  pridejStitek(nazevStitku) {
    if(this.state.zvoleneStitky.indexOf(nazevStitku) === -1) {
      this.prepniStitek(nazevStitku, true);

      let noveZvoleneStitky = this.state.zvoleneStitky.slice();
      noveZvoleneStitky.push(nazevStitku);
      this.setState({zvoleneStitky: noveZvoleneStitky});
    }
  }

  //vytvoří ze zvolených šítků elementy
  vykresliStitky() {
    let poleStitku = this.state.zvoleneStitky.map((nazevStitku, index) => {
      return (
        <li className = "stitek" key = {index}>
          <span>{nazevStitku}</span>
          <button onClick = {() => this.zrusStitek(nazevStitku)}>x</button>
        </li>
      );
    });

    return <ul>{poleStitku}</ul>;
  }

  //odeber štítek z pole zvolených štítků a přepni ho na vypnutý
  zrusStitek(nazevStitku) {
    this.prepniStitek(nazevStitku, false);

    let noveZvoleneStitky = this.state.zvoleneStitky.filter(zvolenyStitek => {
      return zvolenyStitek != nazevStitku;
    });
    this.setState({zvoleneStitky: noveZvoleneStitky});
  }

  // musíme naučit Autosuggest jak vypočítat návrhy
  // ze všech štítků navrhujeme ty, které obsahují text, který je právě v input poli
  // nenavrhujeme nikdy šítek "i pro nováčky", ten má samostatné volení jinde v aplikaci
  getSuggestions(value) {
    let inputValue = value.trim().toLowerCase();

    return this.props.stitky.filter(stitek =>
      stitek.nazev.toLowerCase().indexOf(inputValue) > -1
      && stitek.nazev !== 'i pro nováčky'
    );
  };

  // Když se zvolí štítek, chceme jeho název a ne celý objekt
  getSuggestionValue(suggestion) {
    return suggestion.nazev;
  }

  // Autosuggest zavolá tuto funkci když se mění input pole
  onChange(event, { newValue }) {
    this.setState({
      value: newValue
    });
  };

  // Autosuggest zavolá tuto funkci vždy když se mají aktualizovat štítky
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  // Autosuggest zavolá tuto funkci když se mají vymazat návrhy
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  // Autosuggest zavolá tuto funkci, když si uživatel vybere jeden z návrhů
  onSuggestionSelected = (event, { suggestion }) => {
    this.pridejStitek(suggestion.nazev);

    this.setState({
      value: '',
      suggestions: [],
    });
  }

  // Určuje v jaké podobě budou návrhy vytvořeny
  renderSuggestion = suggestion => (
    <div>
      {suggestion.nazev}
    </div>
  );

  render() {
    const { value, suggestions } = this.state;

    // Autosuggest předá tyto props inputovému poli, můžeme si tady nastavit,
    // jaké atributy ten input má mít
    const inputProps = {
      placeholder: 'Zvol štítek',
      value: value,
      onChange: this.onChange
    };

    return (
      <div>
        <br/>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          onSuggestionSelected = {this.onSuggestionSelected}
          highlightFirstSuggestion = {true}
          inputProps={inputProps}
        />
        {this.vykresliStitky()}
        <br/>
      </div>
    );
  }
}
