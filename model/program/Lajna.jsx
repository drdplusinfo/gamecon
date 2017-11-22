class Lajna extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let akt = this.props.aktivity.map(aktivita => <span>{aktivita.nazev}</span>);
    return (
      <div>
        <h2>{this.props.nazev}</h2>
        {akt}
        <br/>
      </div>
    )
  }
}
