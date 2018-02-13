function Aktivita(props) {
  let aktivita = props.aktivita;

  return (
    <td colSpan={aktivita.delka} className = "tabulka-aktivita" onClick = {() => props.zvolTutoAktivitu(aktivita)}>
      <span>{aktivita.nazev}</span>
      <br/>
      <ZobrazeniKapacity
        aktivita = {aktivita}
        tridy = {{
          tridaZeny: 'kapacita-zeny',
          tridaMuzi: 'kapacita-muzi',
          tridaUniverzalni: 'kapacita-univerzalni',
          tridaKapacita: 'kapacita'
        }}
      />

      <TlacitkoPrihlasit
        aktivita = {aktivita}
        api = {props.api}
        trida = 'tlacitko-prihlasit--aktivita'
        uzivatelPohlavi = {props.uzivatelPohlavi}
      />

    </td>
  );
}
