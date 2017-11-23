class Aktivita extends React.Component {

  constructor(props) {
    super(props);
    this.zpracujKlik = this.zpracujKlik.bind(this);
  }

  zpracujKlik(){
    this.props.zvolTutoAktivitu(this.props.aktivita);
  }

  render() {
    let styl = {border: "1px solid black"};
    let aktivita = this.props.aktivita;
    let kapacita;
    //TODO: dořešit jaké jsou přesně možnosti a aby server vracel kapacity skutečně v podobě, kterou chceme
    if (aktivita.kapacita_u > 0){
      kapacita = <span>({aktivita.prihlaseno_f+aktivita.prihlaseno_m}/{aktivita.kapacita_u})</span>;
    }
    else if(aktivita.kapacita_m > 0 && aktivita.kapacita_f > 0) {
      kapacita = <span>({aktivita.prihlaseno_f}/{aktivita.kapacita_f})({aktivita.prihlaseno_m}/{aktivita.kapacita_m})</span>;
    }
    else if(aktivita.kapacita_m > 0 && aktivita.kapacita_f == 0){
      kapacita = <span>({aktivita.prihlaseno_m}/{aktivita.kapacita_m})</span>;
    }
    else if(aktivita.kapacita_m == 0 && aktivita.kapacita_f > 0){
      kapacita = <span>({aktivita.prihlaseno_f}/{aktivita.kapacita_f})</span>;
    }
    return (
      <td colSpan={aktivita.delka} style = {styl} onClick = {this.zpracujKlik}>
        <span>{aktivita.nazev}</span>
        <br/>
        {kapacita}
      </td>
    );
  }
}
