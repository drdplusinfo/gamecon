function Lajna(props) {

  function vytvorPoleAktivit() {
    /* Pro tuto linii vytvoří 2d pole aktivit, které přesně koresponduje pozdějšímu
    zobrazení aktivit v rozvrhu*/
    let pole = []
    pole.push(new Array(24 - ZACATEK_PROGRAMU).fill(null));

    props.aktivity.forEach(aktivita => {
      //pro každou aktivitu zjistíme jak je dlouhá(kolik hodinových slotů) a kdy začíná
      let delka = (new Date(aktivita.konec) - new Date(aktivita.zacatek)) / 3600000;
      let zacatekIndex = new Date(aktivita.zacatek).getHours() - ZACATEK_PROGRAMU;
      /* kdyz je zacatekIndex záporný, je to tím, že začátek aktivity je jakoby už v dalším dni,
      po 23 hodině následuje 0 hodina, toto musíme vykompenzovat */
      if(zacatekIndex < 0) {
        zacatekIndex += 24;
      }

      let volnyRadek = -1;

      //hledáme volný řádek, ve kterém v čase, který by chtěla zabrat tato aktivita, ještě není jiná aktivita
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

      //jestli jsme nenašli volný řádek, znamená to, že si musíme udělat nový
      if(volnyRadek == -1) {
        pole.push(new Array(24 - ZACATEK_PROGRAMU).fill(null));
        volnyRadek = pole.length - 1;
      }

      //už víme, kde je volný řádek(našli jsme ho nebo vytvořili nový)
      //a tak tam můžeme vložit aktivitu
      pole[volnyRadek][zacatekIndex] = aktivita;
      for(let i = zacatekIndex + 1; i<zacatekIndex + delka; i++) {
        pole[volnyRadek][i] = 'obsazeno';
      }

      aktivita.delka = delka;
    });

    return pole;
  }

  function vytvorTabulkuZPole(pole) {
    /*z pole, které jsme si připravili jako reprezentaci rozvrhu, chceme vytvořit
    skutečnou html tabulku*/
    return pole.map(radekPole => {
      let radekTabulky = [];

      for(let i = 0; i<radekPole.length; i++){
        if(!radekPole[i]) {
          radekTabulky.push(
            <td className = "tabulka-prazdna-bunka">
              &nbsp;
            </td>
          );
        } else {
          radekTabulky.push(
            <Aktivita
              aktivita = {radekPole[i]}
              api = {props.api}
              uzivatelPohlavi = {props.uzivatelPohlavi}
              zvolTutoAktivitu = {props.zvolTutoAktivitu}
            />
          );
          i += radekPole[i].delka - 1;
        }
      }
      return <tr>{radekTabulky}</tr>;
    });
  }

  let pole = vytvorPoleAktivit();
  return (
    <tbody className = "tabulka-linie">
      <th rowSpan = {pole.length + 1}>{props.nazev}</th>
      {vytvorTabulkuZPole(pole)}
    </tbody>
  )
}
