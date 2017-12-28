class Casovac extends React.Component {
  constructor() {
    super();

    this.state = {
      cas: Date.now()
    }
  }

  componentDidMount() {
    this.timer = setInterval(() => this.tik(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  kolikZbyvaHodin() {
    let hodiny = Math.floor((this.props.rezervaceVyprsi - this.state.cas)/3600000);
    return hodiny >= 10 ? hodiny.toString() : "0" + hodiny;
  }

  kolikZbyvaMinut() {
    let minuty = Math.floor(((this.props.rezervaceVyprsi - this.state.cas)%3600000)/60000);
    return minuty >= 10 ? minuty.toString() : "0" + minuty;
  }

  kolikZbyvaSekund() {
    let sekundy = Math.floor(((this.props.rezervaceVyprsi - this.state.cas)%60000)/1000);
    return sekundy >= 10 ? sekundy.toString() : "0" + sekundy;
  }

  tik() {
    this.setState({cas: Date.now()});
  }

  render() {
    return (
      <div>
        <div>
          <span>{this.kolikZbyvaHodin()}</span><br />
          <span>HODIN</span>
        </div>
        <div>
          <span>{this.kolikZbyvaMinut()}</span><br />
          <span>MINUT</span>
        </div>
        <div>
          <span>{this.kolikZbyvaSekund()}</span><br />
          <span>SEKUND</span>
        </div>
      </div>
    );
  }
}
