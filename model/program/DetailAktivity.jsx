class DetailAktivity extends React.Component {

  constructor(props) {
    super(props);
    this.zpracujKlik = this.zpracujKlik.bind(this);
  }

  zpracujKlik() {
    this.props.zvolTutoAktivitu({});
  }

  render() {
    let aktivita = this.props.aktivita;
    let linie = this.props.linie.find(lajna => lajna.id == aktivita.linie);
    linie = <span>Linie: {linie.nazev}</span>;

    return (
      <div className = "detail-aktivity" onClick = {this.zpracujKlik}>
        <h2>{aktivita.nazev}</h2>
        {linie}
        <br/>
        <span>Vypravěč: {aktivita.organizatori.join(', ')}</span>
      </div>
    )
  }
}
