class Aktivita extends React.Component {
  constructor (props) {
    super(props)

    this.aktivitaJePlnaProPohlaviUzivatele = this.props.aktivitaJePlnaProPohlaviUzivatele.bind(this)
  }

  urciTriduBunky () {
    let aktivita = this.props.aktivita
    if (this.props.aktivita.sdruzene) {
      var aktivity = this.props.aktivita.sdruzene.filter(aktivita =>
        aktivita.prihlasen || aktivita.organizuje || aktivita.prihlasenJakoNahradnik
      )
      if (aktivity[0]) {
        aktivita = aktivity[0]
      }
    }
    if (aktivita.organizuje) {
      return 'bunka_organizuje'
    }
    if (aktivita.prihlasen) {
      return 'bunka_prihlasen'
    }
    if (aktivita.prihlasenJakoNahradnik) {
      return 'bunka_nahradnik'
    }
    if (this.aktivitaJePlnaProPohlaviUzivatele(aktivita, this.props.data.uzivatelPohlavi)) {
      return 'bunka_prihlaseniNemozne'
    }
    if (aktivita.vDalsiVlne) {
      return 'bunka_vDalsiVlne'
    }
    if (aktivita.otevrenoPrihlasovani) {
      return 'bunka_neprihlasen'
    }
    return 'bunka_prihlaseniNemozne'
  }

  render () {
    return (
      <td colSpan={this.props.aktivita.delka} className={this.urciTriduBunky()} onClick={() => this.props.zvolTutoAktivitu(this.props.aktivita)}>
        <span>{this.props.aktivita.nazev}</span>
        <br />
        <ZobrazeniKapacity
          aktivita={this.props.aktivita}
          tridy={{
            tridaZeny: 'kapacita-zeny',
            tridaMuzi: 'kapacita-muzi',
            tridaUniverzalni: 'kapacita-univerzalni',
            tridaKapacita: 'kapacita'
          }}
        />
        <TlacitkaAktivity
          aktivita={this.props.aktivita}
          api={this.props.api}
          data={this.props.data}
          aktivitaJePlnaProPohlaviUzivatele={this.props.aktivitaJePlnaProPohlaviUzivatele}
        />
      </td>
    )
  }
}
