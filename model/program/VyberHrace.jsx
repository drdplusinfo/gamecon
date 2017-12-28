function najdiHrace(castJmena) {
  let hraci = [
    "Pepa", "Honza", "Maník", "Godric", "Arwi", "Cemi", "Sirien",
    "Malý bobr", "Tomáš Veselý", "David František Wagner", "Tomáš Duli Dulka",
    "Aleš Dorian Svoboda"
  ];
  let cast = castJmena.trim().toLowerCase();
  return hraci.filter(hrac => {
    return hrac.toLowerCase().indexOf(cast) > -1;
  });
}

class VyberHrace extends React.Component {
  constructor(props) {
    super(props);
    //Používáme react-autosuggest https://github.com/moroshko/react-autosuggest
    //Je to kontrolovaná komponenta, hodnota hráče přichází v props
    //suggestions jsou na začátku prázdné, protože box s návrhy je zavřený
    this.state = {
      suggestions: []
    };

    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
  }

  // musíme naučit Autosuggest jak vypočítat návrhy
  // ze všech hráčů navrhujeme ty, které obsahují text, který je právě v input poli
  getSuggestions(value) {
    let hraci = najdiHrace(value);
    return hraci.filter(hrac => {
      return this.props.hraci.indexOf(hrac) === -1;
    });
  };

  //
  getSuggestionValue(suggestion) {
    return suggestion;
  }

  // Autosuggest zavolá tuto funkci když se mění input pole
  onChange(event, { newValue }) {
    this.props.zmenHrace(this.props.index, newValue);
  };

  // Autosuggest zavolá tuto funkci vždy když se mají aktualizovat štítky
  onSuggestionsFetchRequested({ value }) {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  // Autosuggest zavolá tuto funkci když se mají vymazat návrhy
  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    });
  };

  // Autosuggest zavolá tuto funkci, když si uživatel vybere jeden z návrhů
  onSuggestionSelected(event, { suggestion }) {
    this.props.zmenHrace(this.props.index, suggestion);

    this.setState({
      suggestions: []
    });
  }

  // Určuje v jaké podobě budou návrhy vytvořeny
  renderSuggestion(suggestion) {
    return (
      <div>
        {suggestion}
      </div>
    );
  }

  render(){
    const { suggestions } = this.state;
    const value = this.props.hrac || '';
    // Autosuggest předá tyto props inputovému poli, můžeme si tady nastavit,
    // jaké atributy ten input má mít
    const inputProps = {
      placeholder: 'další hráč',
      value: value,
      onChange: this.onChange
    };
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        onSuggestionSelected = {this.onSuggestionSelected}
        highlightFirstSuggestion = {true}
        inputProps={inputProps}
        id = {"inputHrace" + this.props.index}
      />
    );
  }
}
