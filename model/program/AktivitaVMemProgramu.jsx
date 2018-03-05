function AktivitaVMemProgramu (props) {
  function zjistiJmenoLinie () {
    let linieAktivity = props.linie.find(lajna => lajna.id == props.aktivita.linie)

    return linieAktivity.nazev.slice(0, 1).toUpperCase() + linieAktivity.nazev.slice(1)
  }

  function urciTridu (aktivita) {
    if (aktivita.organizuje) {
      return 'bunka_organizuje'
    }
    if (aktivita.prihlasenJakoNahradnik) {
      return 'bunka_nahradnik'
    }
    if (aktivita.prihlasen) {
      return 'bunka_prihlasen'
    }
  }

  return (
    <td
      className = {urciTridu(props.aktivita)}
      colSpan={props.aktivita.delka}
      onClick={() => props.zvolTutoAktivitu(props.aktivita)}>
      <span>{props.aktivita.nazev}</span>
      <span>{zjistiJmenoLinie()}</span>
    </td>
  )
}
