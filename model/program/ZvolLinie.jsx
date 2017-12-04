class ZvolLinie extends React.Component {

  constructor(props) {
    super(props);
  }

  //když klikáme, přepínáme jestli je linie zapnutá nebo vypnutá
  handleClick(lajna) {
    let upraveneLinie = this.props.linie.map(lajnaVPoli => {
      if (lajnaVPoli.nazev === lajna.nazev) {
        lajnaVPoli.zvolena = !lajnaVPoli.zvolena;
      }
      return lajnaVPoli;
    });
    this.props.zmenLinie(upraveneLinie);
  }

  render() {
    //vyfiltruj záporné pořadí
    let linie = this.props.linie.filter(lajna => lajna.poradi>0);

    //Udělej tlačítko pro každou linii
    let tlacitkaLinii = linie.map(lajna => {
      let className = lajna.zvolena ? "vyber-linie-zvolena" : "vyber-linie-nezvolena";
      return (
        <button onClick = {() => this.handleClick(lajna)} className = {className}>
          {lajna.nazev.charAt(0).toUpperCase() + lajna.nazev.slice(1)}
        </button>
      );
    });

    return (
      <div>
          {tlacitkaLinii}
      </div>
    );
  }
}
