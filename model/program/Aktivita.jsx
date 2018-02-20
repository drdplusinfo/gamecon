class Aktivita extends React.Component {
  constructor (props) {
    super(props)

    this.aktivitaJePlnaProPohlaviUzivatele = this.props.aktivitaJePlnaProPohlaviUzivatele
    this.aktivita = this.props.aktivita
  }

  urciTriduBunky () {
    if (this.aktivita.organizuje) {
      return 'bunka_organizuje' // uživatel je vypravěč
    }
    if (this.aktivita.prihlasen) {
      return 'bunka_prihlasen'
    }
    if (this.aktivita.prihlasenJakoNahradnik) {
      return 'bunka_nahradnik'
    }
    if (this.aktivitaJePlnaProPohlaviUzivatele(this.aktivita, this.props.uzivatelPohlavi)) {
      return 'bunka_prihlaseniNemozne'
    }
    if (this.aktivita.vDalsiVlne) {
      return 'bunka_vDalsiVlne'
    }
    if (this.aktivita.otevrenoPrihlasovani) {
      return 'bunka_neprihlasen'
    }
    return 'bunka_prihlaseniNemozne'
  }

  render () {
    return (
      <td colSpan={this.aktivita.delka} className={this.urciTriduBunky()} onClick={() => this.props.zvolTutoAktivitu(this.aktivita)}>
        <span>{this.aktivita.nazev}</span>
        <br />
        <ZobrazeniKapacity
          aktivita={this.aktivita}
          tridy={{
            tridaZeny: 'kapacita-zeny',
            tridaMuzi: 'kapacita-muzi',
            tridaUniverzalni: 'kapacita-univerzalni',
            tridaKapacita: 'kapacita'
          }}
        />
        <TlacitkaAktivity
          aktivita={this.aktivita}
          api={this.props.api}
          data={this.props.data}
          aktivitaJePlnaProPohlaviUzivatele={this.props.aktivitaJePlnaProPohlaviUzivatele}
        />
      </td>
    )
  }
}
