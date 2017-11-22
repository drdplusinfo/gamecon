class Program extends React.Component {

  constructor(props) {
    super(props);
    console.log(this.props.data);
    this.props.data.linie = this.uklidLinie(this.props.data.linie);

    // na začátku jsou všechny linie zvolené (viditelné)
    // zvolený den je středa - 3
    this.state = {
      zvoleneLinie: [],
      zvolenyDen: 3
    };

    this.zvolTytoLinie = this.zvolTytoLinie.bind(this);
    this.zvolTentoDen = this.zvolTentoDen.bind(this);
  }

  zvolTytoLinie(linie) {
    this.setState({zvoleneLinie: linie});
  }

  zvolTentoDen(cisloDneVTydnu) {
    this.setState({zvolenyDen: cisloDneVTydnu});
  }

  uklidLinie(linie) {
    // dej linie do pole a seřaď je podle pořadí
    var linieVPoli = [];
    for(var cisloLinie in linie) {
      linieVPoli.push(linie[cisloLinie]);
    }
    return linieVPoli.sort((lajnaA, lajnaB) => lajnaA.poradi - lajnaB.poradi);
  }

  render() {
    return (
      <div>
        <Header />
        <ZvolLinie linie = {this.props.data.linie} zvoleneLinie = {this.state.zvoleneLinie} zvolTytoLinie = {this.zvolTytoLinie} />
        <ZvolDen zvolenyDen = {this.state.zvolenyDen} zvolTentoDen = {this.zvolTentoDen}/>
        <Rozvrh data= {this.props.data} zvoleneLinie = {this.state.zvoleneLinie} zvolenyDen = {this.state.zvolenyDen}/>
      </div>
    )
  }

}
