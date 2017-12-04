function DetailAktivity() {
  let aktivita = this.props.aktivita;
  let linie = this.props.linie.find(lajna => lajna.id == aktivita.linie);

  return (
    <div className = "detail-aktivity" onClick = {() => this.props.zvolTutoAktivitu({})}>
      <h2>{aktivita.nazev}</h2>
      <span>Linie: {linie.nazev}</span>
      <br/>
      <span>Vypravěč: {aktivita.organizatori.join(', ')}</span>
    </div>
  )
}
