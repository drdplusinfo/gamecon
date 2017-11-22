class Lajna extends React.Component {

  constructor(props) {
    super(props);

    this.vytvorPole = this.vytvorPole.bind(this);
    this.vytvorTabulkuZPole = this.vytvorTabulkuZPole.bind(this);
  }

  vytvorPole() {
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

    let polePrazdne = true;
    pole[0].forEach(item => {
      if(item){
        polePrazdne = false;
      }
    });
    return polePrazdne ? [] : pole;
  }

  vytvorTabulkuZPole(pole) {
    let style = {border: "1px solid black"}
    return pole.map(radekPole => {
      let radekTabulky = [];
      for(let i = 0; i<radekPole.length; i++){
        if(!radekPole[i]){
          radekTabulky.push(<td style = {style}>{i}</td>);
        }
        else {
          radekTabulky.push(<td colSpan={radekPole[i].delka} style = {style}>{radekPole[i].nazev}</td>);
          i += radekPole[i].delka - 1;
        }
      }
      return <tr>{radekTabulky}</tr>;
    });
  }

  render() {
    let pole = this.vytvorPole();
    console.log(pole);
    let tabulka = this.vytvorTabulkuZPole(pole);
    let akt = this.props.aktivity.map(aktivita => <span>{aktivita.nazev}</span>);
    return (
      <div>
        <h2>{this.props.nazev}</h2>
        <table>{tabulka}</table>
      </div>
    )
  }
}
