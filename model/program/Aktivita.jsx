function Aktivita(props) {
  let aktivita = props.aktivita;
  //názvy tříd u kapacity
  const ZENY = "zeny";
  const MUZI = "muzi";
  const UNIVERZALNI = "univerzalni";
  //obalující div
  const KAPACITA = "kapacita";

  function zjistiKapacitu(aktivita) {
    let {prihlaseno_f, prihlaseno_m, kapacita_f, kapacita_m, kapacita_u} = aktivita;
    if(kapacita_f + kapacita_m + kapacita_u <= 0) {
      //aktivita bez omezení
      return null;
    }
    else if(prihlaseno_f + prihlaseno_m >= kapacita_f + kapacita_m + kapacita_u) {
      //beznadějně plno
      let zeny = prihlaseno_f > 0 ? <span className = {ZENY}>({prihlaseno_f}/{prihlaseno_f})</span> : '';
      let muzi = prihlaseno_m > 0 ? <span className = {MUZI}>({prihlaseno_m}/{prihlaseno_m})</span> : '';
      return <div className = {KAPACITA}>{zeny}{muzi}</div>;
    }
    else if(prihlaseno_m >= kapacita_m + kapacita_u) {
      //muži zabrali všechny svá i univerzální místa
      let zeny = kapacita_f > 0 ? <span className = {ZENY}>({prihlaseno_f}/{kapacita_f})</span> : '';
      let muzi = kapacita_m > 0 ? <span className = {MUZI}>({prihlaseno_m}/{prihlaseno_m})</span> : '';
      return <div className = {KAPACITA}>{zeny}{muzi}</div>;
    }
    else if(prihlaseno_f >= kapacita_f + kapacita_u) {
      //ženy zabrali všechny svá i univerzální místa
      let zeny = kapacita_f > 0 ? <span className = {ZENY}>({prihlaseno_f}/{kapacita_f})</span> : '';
      let muzi = kapacita_m > 0 ? <span className = {MUZI}>({prihlaseno_m}/{kapacita_m})</span> : '';
      return <div className = {KAPACITA}>{zeny}{muzi}</div>;
    }
    else {
      //jinak volno, žádné pohlaví nevyžralo limit míst
      let univerzalni = <span className = {UNIVERZALNI}>({prihlaseno_f+prihlaseno_m}/{kapacita_f+kapacita_m+kapacita_u})</span>
      return <div className = {KAPACITA}>{univerzalni}</div>
    }

  }

  return (
    <td colSpan={aktivita.delka} className = "tabulka-aktivita" onClick = {() => props.zvolTutoAktivitu(aktivita)}>
      <span>{aktivita.nazev}</span>
      <br/>
      {zjistiKapacitu(aktivita)}
    </td>
  );
}
