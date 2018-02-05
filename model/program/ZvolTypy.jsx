function ZvolTypy(props) {
  //jména css tříd pro tlačítka
  const LINIE_ZVOLENA = "vyber-linie-zvolena";
  const LINIE_NEZVOLENA = "vyber-linie-nezvolena";
  const PRO_NOVACKY_ZVOLENO = "pro-novacky-zvoleno";
  const PRO_NOVACKY_NEZVOLENO = "pro-novacky-nezvoleno";
  const VOLNE_AKTIVITY_ZVOLENO = "volne-aktivity-zvoleno";
  const VOLNE_AKTIVITY_NEZVOLENO = "volne-aktivity-nezvoleno";

  function prepniLajnu(lajna) {
    //když klikáme, přepínáme jestli je linie zapnutá nebo vypnutá
    let upraveneLinie = props.linie.map(lajnaVPoli => {
      if (lajnaVPoli.nazev === lajna.nazev) {
        lajnaVPoli.zvolena = !lajnaVPoli.zvolena;
      }
      return lajnaVPoli;
    });
    props.zmenLinie(upraveneLinie);
  }

  function prepniProNovacky() {
    let upraveneStitky = props.stitky.map(stitek => {
      if (stitek.nazev === "i pro nováčky"){
        stitek.zvoleny = !stitek.zvoleny;
      }
      return stitek;
    });
    props.zmenStitky(upraveneStitky);
  }

  function prepniZobrazeniVolnychAktivit() {
    props.prepniZobrazeniVolnychAktivit();
  }

  function vytvorTlacitkaLinii() {
    //Udělej tlačítko pro každou linii a vrať pole tlačítek
    return props.linie.map(lajna => {
      let className = lajna.zvolena ? LINIE_ZVOLENA : LINIE_NEZVOLENA;
      return (
        <button onClick = {() => prepniLajnu(lajna)} className = {className}>
          {lajna.nazev.charAt(0).toUpperCase() + lajna.nazev.slice(1)}
        </button>
      );
    });
  }

  function vytvorTlacitkoProNovacky() {
    let stitekProNovacky = props.stitky.find(stitek => stitek.nazev === "i pro nováčky");
    let className = stitekProNovacky.zvoleny ? PRO_NOVACKY_ZVOLENO : PRO_NOVACKY_NEZVOLENO;
    return (
      <button onClick = {prepniProNovacky} className = {className}>
        i pro nováčky
      </button>
    );
  }

  function vytvorTlacitkoVolneAktivity() {
    let className = props.zobrazJenVolneAktivity ? VOLNE_AKTIVITY_ZVOLENO : VOLNE_AKTIVITY_NEZVOLENO;
    return (
      <button onClick = {prepniZobrazeniVolnychAktivit} className = {className}>
        volné aktivity
      </button>
    )
  }

  return (
    <div>
        {vytvorTlacitkaLinii()}
        {vytvorTlacitkoProNovacky()}
        {vytvorTlacitkoVolneAktivity()}
    </div>
  );

}
