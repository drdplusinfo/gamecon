function ProgramovaLinie(props) {

  function vytvorPoleAktivit() {
    /* Pro tuto linii vytvoří 2d pole aktivit, které přesně koresponduje pozdějšímu
    zobrazení aktivit v rozvrhu*/
    let pole = []
    pole.push(new Array(24 - KONSTANTY.ZACATEK_PROGRAMU).fill(null))

    let sdruzene = {}

    props.aktivity.forEach(aktivita => {
      // sdružené aktivity jeden čas překonvertovat na jednu aktivitu
      // obsahující uvnitř navíc pole všech sdružených aktivit v daný čas
      if (aktivita.sdruzit && !props.mujProgram) {
        let cas = aktivita.zacatek + ' ' + aktivita.konec
        if (!sdruzene[cas]) {
          // v daném čase ještě žádná sdružená aktivita není:
          // vytvořit pole sdružených aktivit do aktuální aktivity a přidat
          // do něj sebe samu
          aktivita.sdruzene = []
          aktivita.sdruzene.push(aktivita)
          sdruzene[cas] = aktivita.sdruzene
        } else {
          // v daném čase už sdružená aktivita je:
          // jen přidat aktuální aktivitu do sdružených v daný čas a nevypisovat
          sdruzene[cas].push(aktivita)
          return
        }
      }

      //pro každou aktivitu zjistíme jak je dlouhá(kolik hodinových slotů) a kdy začíná
      let delka = zjistiDelkuAktivity(aktivita)
      let zacatekIndex = zjistiIndexHodinyZacatkuAktivity(aktivita)

      let indexVolnehoRadku = najdiVolnyRadek(pole, zacatekIndex, delka)

      //jestli jsme nenašli volný řádek, znamená to, že si musíme udělat nový
      if(indexVolnehoRadku == -1) {
        pole.push(new Array(24 - KONSTANTY.ZACATEK_PROGRAMU).fill(null))
        indexVolnehoRadku = pole.length - 1
      }

      //už víme, kde je volný řádek(našli jsme ho nebo vytvořili nový)
      //a tak tam můžeme vložit aktivitu
      pole[indexVolnehoRadku][zacatekIndex] = aktivita
      for(let i = zacatekIndex + 1; i < zacatekIndex + delka; i++) {
        pole[indexVolnehoRadku][i] = 'obsazeno'
      }

      aktivita.delka = delka
    })

    return pole
  }

  function zjistiDelkuAktivity(aktivita) {
    return (new Date(aktivita.konec) - new Date(aktivita.zacatek)) / 3600000
  }

  function zjistiIndexHodinyZacatkuAktivity(aktivita) {
    let index = new Date(aktivita.zacatek).getHours() - KONSTANTY.ZACATEK_PROGRAMU
    /* kdyz je zacatekIndex záporný, je to tím, že začátek aktivity je jakoby už v dalším dni,
    po 23 hodině následuje 0 hodina, toto musíme vykompenzovat */
    if(index < 0) {
      index += 24
    }
    return index
  }

  function najdiVolnyRadek(pole, zacatekIndex, delka) {
    // inicializujeme na -1, co znamená volný řádek nenalezen
    let indexVolnehoRadku = -1

    //hledáme volný řádek, ve kterém v čase, který by chtěla zabrat tato aktivita, ještě není jiná aktivita
    pole.forEach((radek, index) => {
      let volno = true
      for(let i = zacatekIndex; i < zacatekIndex + delka; i++) {
        if(radek[i]){
          volno = false
          break
        }
      }
      if(volno) {
        indexVolnehoRadku = index
      }
    })

    return indexVolnehoRadku
  }

  function vytvorTabulkuZPole(pole) {
    /*z pole, které jsme si připravili jako reprezentaci rozvrhu, chceme vytvořit
    skutečnou html tabulku*/
    return pole.map(radekPole => {
      let radekTabulky = []

      for(let i = 0; i<radekPole.length; i++){
        if(!radekPole[i]) {
          radekTabulky.push(
            <td className = "tabulka-prazdna-bunka">
              &nbsp;
            </td>
          )
        } else {
          if (props.mujProgram) {
            radekTabulky.push(
              <AktivitaVMemProgramu
                aktivita = {radekPole[i]}
                zvolTutoAktivitu = {props.zvolTutoAktivitu}
                linie = {props.data.linie}
              />
            )
          } else {
            radekTabulky.push(
              <Aktivita
                aktivita = {radekPole[i]}
                aktivitaJePlnaProPohlaviUzivatele={props.aktivitaJePlnaProPohlaviUzivatele}
                api = {props.api}
                data = {props.data}
                zvolTutoAktivitu = {props.zvolTutoAktivitu}
              />
            )
          }
          i += radekPole[i].delka - 1
        }
      }
      return <tr>{radekTabulky}</tr>
    })
  }

  let pole = vytvorPoleAktivit()
  return (
    <tbody className = "tabulka-linie">
      <th rowSpan = {pole.length + 1}>{props.nazev}</th>
      {vytvorTabulkuZPole(pole)}
    </tbody>
  )
}