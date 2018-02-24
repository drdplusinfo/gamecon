class VyberHrace extends React.Component {
  constructor(props) {
    super(props)
    //Používáme react-autosuggest https://github.com/moroshko/react-autosuggest
    //Je to kontrolovaná komponenta, hodnota hráče přichází v props
    //navrhy jsou na začátku prázdné, protože box s návrhy je zavřený
    this.state = {
      aktualniHodnota: '',
      navrhy: []
    }

    this.priZmene = this.priZmene.bind(this)
    this.priZadostiONacitaniNavrhu = this.priZadostiONacitaniNavrhu.bind(this)
    this.priZadostiOVymazaniNavrhu = this.priZadostiOVymazaniNavrhu.bind(this)
    this.priZvoleniNavrhu = this.priZvoleniNavrhu.bind(this)
  }

  // musíme naučit Autosuggest jak vypočítat návrhy
  // ze všech hráčů navrhujeme ty, které obsahují text, který je právě v input poli
  nactiNavrhy(hodnotaVInputu) {
    if (hodnotaVInputu.length >= 3) {
      this.props.api.najdiHrace(hodnotaVInputu, (navrhyHracu) => {
        this.setState({
          navrhy: navrhyHracu
        })
      })
    } else {
      this.setState({
        navrhy: []
      })
    }
  }

  // Autosuggest zavolá tuto funkci když se mění input pole
  priZmene(event, zmena) {
    this.setState({
      aktualniHodnota: zmena.newValue,
    })
  }

  // Autosuggest zavolá tuto funkci vždy když se mají aktualizovat štítky
  priZadostiONacitaniNavrhu(zadost) {
    this.nactiNavrhy(zadost.value)
  }

  // Autosuggest zavolá tuto funkci když se mají vymazat návrhy
  priZadostiOVymazaniNavrhu() {
    this.setState({
      navrhy: []
    })
  }

  // Autosuggest zavolá tuto funkci, když si uživatel vybere jeden z návrhů
  priZvoleniNavrhu(event, zvolenyPrvek) {
    this.props.zmenHrace(this.props.index, zvolenyPrvek.suggestion)

    this.setState({
      aktualniHodnota: zvolenyPrvek.suggestion.jmeno,
      navrhy: []
    })
  }

  // Určuje v jaké podobě budou návrhy vytvořeny
  vyrenderujNavrh(navrh) {
    return (
      <div>
        {navrh.jmeno}
      </div>
    )
  }

  ziskejHodnotuNavrhu(navrh) {
    return navrh
  }

  render(){
    // Autosuggest předá tyto props inputovému poli, můžeme si tady nastavit,
    // jaké atributy ten input má mít
    let inputProps = {
      placeholder: 'další hráč',
      value: this.state.aktualniHodnota,
      onChange: this.priZmene
    }
    return (
      <Autosuggest
        suggestions={this.state.navrhy}
        onSuggestionsFetchRequested={this.priZadostiONacitaniNavrhu}
        onSuggestionsClearRequested={this.priZadostiOVymazaniNavrhu}
        getSuggestionValue={this.ziskejHodnotuNavrhu}
        renderSuggestion={this.vyrenderujNavrh}
        onSuggestionSelected = {this.priZvoleniNavrhu}
        highlightFirstSuggestion = {true}
        inputProps={inputProps}
        id = {"inputHrace" + this.props.index}
      />
    )
  }
}
