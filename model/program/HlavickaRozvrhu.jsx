function HlavickaRozvrhu () {
  let hlavicka = [<th className = "tabulka-hlavicka-nazvu"></th>];
  
  for (let hodina = KONSTANTY.ZACATEK_PROGRAMU; hodina <= 23; hodina++) {
    hlavicka.push(<th className = "tabulka-hlavicka-cas">{hodina}</th>);
  }

  return <tr>{hlavicka}</tr>;
}