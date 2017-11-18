class Program extends React.Component {

  constructor(props) {
    super(props);
    this.props.data.linie = this.uklidLinie(this.props.data.linie);

    // na začátku jsou všechny linie zvolené (viditelné)
    this.state = {
      zvoleneLinie: this.props.data.linie.slice()
    };

    this.zvolTytoLinie = this.zvolTytoLinie.bind(this);
  }

  zvolTytoLinie(linie) {
    this.setState({zvoleneLinie: linie});
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
        <Rozvrh zvoleneLinie = {this.state.zvoleneLinie} aktivity = {this.props.data.aktivity} />
      </div>
    )
  }

}
