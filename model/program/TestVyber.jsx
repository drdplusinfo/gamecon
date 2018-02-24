class TestVyber extends React.Component {
  constructor() {
    super()

    this.state = {
      hraci: [],
      kapacita: 5,
    }
    this.zmenHrace = this.zmenHrace.bind(this)
  }

  zmenHrace(index, novaHodnota) {
    let novyStavHracu = this.state.hraci.slice()
    novyStavHracu[index] = novaHodnota
    this.setState({
      hraci: novyStavHracu
    })
  }

  render() {
    console.log(this.state.hraci.filter(x => x))
    let vybery = []

    for (let i=0; i<this.state.kapacita; i++) {
      vybery.push(
        <VyberHrace
          hraci = {this.state.hraci}
          index = {i}
          key = {i}
          zmenHrace = {this.zmenHrace}
          api = {this.props.api}
          />
      )
    }

    return <div>{vybery}</div>
  }
}