class ZvolDen extends React.Component {

  constructor(props) {
    super(props);

    this.zvolDen = this.zvolDen.bind(this);
  }

  zvolDen(den) {
    this.props.zvolTentoDen(den);
  }

  render() {
    return (
      <div>
        <button onClick = {this.zvolDen.bind(this, 3)}>Středa</button>
        <button onClick = {this.zvolDen.bind(this, 4)}>Čtvrtek</button>
        <button onClick = {this.zvolDen.bind(this, 5)}>Pátek</button>
        <button onClick = {this.zvolDen.bind(this, 6)}>Sobota</button>
        <button onClick = {this.zvolDen.bind(this, 0)}>Neděle</button>
      </div>
    )
  }

}
