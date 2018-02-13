function ZobrazeniKapacity(props) {
  let aktivita = props.aktivita
  //názvy tříd u kapacity
  const ZENY = props.tridy.tridaZeny
  const MUZI = props.tridy.tridaMuzi
  const UNIVERZALNI = props.tridy.tridaUniverzalni
  //název třídy obalujícího divu
  const KAPACITA = props.tridy.tridaKapacita

  let {prihlasenoZen, prihlasenoMuzu, kapacitaZeny, kapacitaMuzi, kapacitaUniverzalni} = aktivita;
  if(!aktivita.sdruzit) {
    if(kapacitaZeny + kapacitaMuzi + kapacitaUniverzalni <= 0) {
      //aktivita bez omezení
      return null;
    }
    else if(prihlasenoZen + prihlasenoMuzu >= kapacitaZeny + kapacitaMuzi + kapacitaUniverzalni) {
      //beznadějně plno
      let zeny = prihlasenoZen > 0 ? <span className = {ZENY}>({prihlasenoZen}/{prihlasenoZen})</span> : '';
      let muzi = prihlasenoMuzu > 0 ? <span className = {MUZI}>({prihlasenoMuzu}/{prihlasenoMuzu})</span> : '';
      return <div className = {KAPACITA}>{zeny}{muzi}</div>;
    }
    else if(prihlasenoMuzu >= kapacitaMuzi + kapacitaUniverzalni) {
      //muži zabrali všechny svá i univerzální místa
      let zeny = kapacitaZeny > 0 ? <span className = {ZENY}>({prihlasenoZen}/{kapacitaZeny})</span> : '';
      let muzi = kapacitaMuzi > 0 ? <span className = {MUZI}>({prihlasenoMuzu}/{prihlasenoMuzu})</span> : '';
      return <div className = {KAPACITA}>{zeny}{muzi}</div>;
    }
    else if(prihlasenoZen >= kapacitaZeny + kapacitaUniverzalni) {
      //ženy zabrali všechny svá i univerzální místa
      let zeny = kapacitaZeny > 0 ? <span className = {ZENY}>({prihlasenoZen}/{prihlasenoZen})</span> : '';
      let muzi = kapacitaMuzi > 0 ? <span className = {MUZI}>({prihlasenoMuzu}/{kapacitaMuzi})</span> : '';
      return <div className = {KAPACITA}>{zeny}{muzi}</div>;
    }
    else {
      //jinak volno, žádné pohlaví nevyžralo limit míst
      let univerzalni = <span className = {UNIVERZALNI}>({prihlasenoZen+prihlasenoMuzu}/{kapacitaZeny+kapacitaMuzi+kapacitaUniverzalni})</span>
      return <div className = {KAPACITA}>{univerzalni}</div>
    }
  }
  else {
    return null;
  }
}
