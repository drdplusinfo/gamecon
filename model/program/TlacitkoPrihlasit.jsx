function TlacitkoPrihlasit(props) {

  function muzeSePrihlasit() {
    //TODO: testujeme to na front-endu nebo to dělá server? Hlavně ohledně kapacity
    //provizorně vracíme true, ať se tlačítka zobrazí
    return true;
    //pak by tady mohlo být taky něco na styl
    //return !props.aktivita.organizuje && props.aktivita.otevreno_prihlasovani;
  }

  function odhlas() {
    //nějak odhlaš
  }

  function prihlas() {
    if (props.aktivita.tymova) {
      //udělej něco jiného, speciálního pro týmové aktivity
      return;
    }

    props.api.prihlas(props.aktivita.id, function(data) {
      //Hurá, přihlášen, co víc může člověk chtít?
    }, function(chyba) {
      //TODO: jak zobrazit tuto chybu hezky?
      alert(chyba);
    })
  }

  function prihlasOdhlas(event) {
    event.stopPropagation();

    if (props.aktivita.prihlasen) {
      odhlas();
    } else {
      prihlas();
    }
  }

  return (
     muzeSePrihlasit() ?
      <button onClick = {prihlasOdhlas} className = {props.trida}>
        {props.aktivita.prihlasen ? 'Odhlásit' : 'Přihlásit'}
      </button>
      : null

  );
}
