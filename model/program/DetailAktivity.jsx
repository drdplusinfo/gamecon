class DetailAktivity extends React.Component {

  constructor(props) {
    super(props);
    this.zpracujKlik = this.zpracujKlik.bind(this);
  }

  zpracujKlik() {
    this.props.zvolTutoAktivitu({});
  }

  render() {
    let styl = {
      position: "fixed",
      right: "0",
      top: "0",
      height: "100%",
      zIndex: "1",
      backgroundColor: "#eee"
    }
    
    let aktivita = this.props.aktivita;
    let linie = this.props.linie.find(lajna => lajna.id == aktivita.linie);
    linie = <span>Linie: {linie.nazev}</span>;

    return (
      <div style = {styl} onClick = {this.zpracujKlik}>
        <h2>{aktivita.nazev}</h2>
        {linie}
        <br/>
        <span>Vypravěč: {aktivita.organizatori.join(', ')}</span>
      </div>
    )
  }
}
