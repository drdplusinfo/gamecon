function AktivitaVMemProgramu (props) {
  function zjistiJmenoLinie () {
    let linieAktivity = props.linie.find(lajna => lajna.id == props.aktivita.linie)

    return linieAktivity.nazev.slice(0, 1).toUpperCase() + linieAktivity.nazev.slice(1)
  } 

  return (
    <td 
      colSpan={props.aktivita.delka} 
      onClick={() => props.zvolTutoAktivitu(props.aktivita)}>
      <span>{props.aktivita.nazev} ({zjistiJmenoLinie()})</span>
    </td>
  )
}