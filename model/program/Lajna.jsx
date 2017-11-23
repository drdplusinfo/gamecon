class Lajna extends React.Component {

  constructor(props) {
    super(props);

    this.vytvorPoleAktivit = this.vytvorPoleAktivit.bind(this);
    this.vytvorTabulkuZPole = this.vytvorTabulkuZPole.bind(this);
  }

  vytvorPoleAktivit() {
    let pole = []
    pole.push(new Array(16).fill(null));

    this.props.aktivity.forEach(aktivita => {
      let delka = (new Date(aktivita.konec) - new Date(aktivita.zacatek)) / 3600000;
      let zacatekIndex = new Date(aktivita.zacatek).getHours() - 8;
      //řeší, že 24:00 se vyhodnotí jako 0:00
      if (zacatekIndex == -8){
        zacatekIndex = 16;
      }

      let volnyRadek = -1;

      pole.forEach((radek, index) => {
        let obsazeno = false;
        for(let i = zacatekIndex; i<zacatekIndex + delka; i++){
          if(radek[i]){
            obsazeno = true;
            break;
          }
        }
        if(!obsazeno){
          volnyRadek = index;
        }
      });

      if(volnyRadek == -1){
        pole.push(new Array(16).fill(null));
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
    let styl = {border: "1px solid black", height: "100%"}
    return pole.map(radekPole => {
      let radekTabulky = [];
      for(let i = 0; i<radekPole.length; i++){
        if(!radekPole[i]){
          radekTabulky.push(<td style = {styl}>&nbsp;</td>);
        }
        else {
          radekTabulky.push(<td colSpan={radekPole[i].delka} style = {styl}>{radekPole[i].nazev}</td>);
          i += radekPole[i].delka - 1;
        }
      }
      return <tr>{radekTabulky}</tr>;
    });
  }

  render() {
    let pole = this.vytvorPoleAktivit();
    let tabulka = this.vytvorTabulkuZPole(pole);
    let styl = {border: "2px solid red"}
    
    return (
      <tbody style = {styl}>
        <th rowSpan = {pole.length + 1}>{this.props.nazev}</th>
        {tabulka}
      </tbody>
    )
  }
}
