class Lajna extends React.Component {

  constructor(props) {
    super(props);

    this.vytvorPoleAktivit = this.vytvorPoleAktivit.bind(this);
    this.vytvorTabulkuZPole = this.vytvorTabulkuZPole.bind(this);
  }

  vytvorPoleAktivit() {
    let pole = []
    pole.push(new Array(24 - ZACATEK_PROGRAMU).fill(null));

    this.props.aktivity.forEach(aktivita => {
      let delka = (new Date(aktivita.konec) - new Date(aktivita.zacatek)) / 3600000;
      let zacatekIndex = new Date(aktivita.zacatek).getHours() - ZACATEK_PROGRAMU;
      /* kdyz je zacatekIndex záporný, je to tím, že začátek aktivity je jakoby už v dalším dni,
      po 23 hodině následuje jakoby 0 hodina, toto musíme vykompenzovat */
      if(zacatekIndex < 0) {
        zacatekIndex += 24;
      }

      let volnyRadek = -1;

      pole.forEach((radek, index) => {
        let volno = true;
        for(let i = zacatekIndex; i<zacatekIndex + delka; i++){
          if(radek[i]){
            volno = false;
            break;
          }
        }
        if(volno) {
          volnyRadek = index;
        }
      });

      if(volnyRadek == -1) {
        pole.push(new Array(24 - ZACATEK_PROGRAMU).fill(null));
        volnyRadek = pole.length - 1;
      }

      pole[volnyRadek][zacatekIndex] = aktivita;
      for(let i = zacatekIndex + 1; i<zacatekIndex + delka; i++) {
        pole[volnyRadek][i] = 'obsazeno';
      }

      aktivita.delka = delka;
    });

    return pole;
  }

  vytvorTabulkuZPole(pole) {
    return pole.map(radekPole => {
      let radekTabulky = [];

      for(let i = 0; i<radekPole.length; i++){
        if(!radekPole[i]) {
          radekTabulky.push(<td className = "tabulka-prazdna-bunka">&nbsp;</td>);
        } else {
          radekTabulky.push(<Aktivita aktivita = {radekPole[i]} zvolTutoAktivitu = {this.props.zvolTutoAktivitu}/>);
          i += radekPole[i].delka - 1;
        }
      }
      return <tr>{radekTabulky}</tr>;
    });
  }

  render() {
    let pole = this.vytvorPoleAktivit();
    let tabulka = this.vytvorTabulkuZPole(pole);

    return (
      <tbody className = "tabulka-linie">
        <th rowSpan = {pole.length + 1}>{this.props.nazev}</th>
        {tabulka}
      </tbody>
    )
  }
}
