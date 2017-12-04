class ZvolLinie extends React.Component {

  constructor(props) {
    super(props);
  }

  //když klikáme, přepínáme jestli je linie zapnutá nebo vypnutá, měníme pole zvolených linií
  handleClick(lajna) {
    let noveZvoleneLinie = this.props.zvoleneLinie.slice();

    //zjisti index lajny v poli zvolených linií. Jestli tam je, vyhoď ji. Jestli tam není, přidej jí.
    let indexLajny = this.props.zvoleneLinie.findIndex((lajnaVPoli) => {
      return lajnaVPoli.nazev == lajna.nazev;
    });
    if(indexLajny >= 0) {
      noveZvoleneLinie.splice(indexLajny, 1);
    } else {
      noveZvoleneLinie.push(lajna);
    }
    this.props.zvolTytoLinie(noveZvoleneLinie);
  }

  render() {
    //vyfiltruj záporné pořadí
    let linie = this.props.linie.filter(lajna => lajna.poradi>0);

    //Udělej tlačítko pro každou linii
    let tlacitkaLinii = linie.map(lajna => {
      //farba pro nezvolené linie je experimentálně červená
      let className = "vyber-linie-nezvolena";
      let index = this.props.zvoleneLinie.findIndex(lajnaVPoli => lajnaVPoli.nazev == lajna.nazev);

      //jestli je linie mezi zvolenými, uděláme jí experimentálně zelenou
      if(index>-1) {
        className = "vyber-linie-zvolena";
      }

      return <button onClick = {() => this.handleClick(lajna)} className = {className}>
        {lajna.nazev.charAt(0).toUpperCase() + lajna.nazev.slice(1)}
      </button>
    });

    return (
      <div>
          {tlacitkaLinii}
      </div>
    );
  }
}
