class Aktivita extends React.Component {
  constructor (props) {
    super(props)

    this.aktivita = this.props.aktivita
    this.aktivitaJePlnaProPohlaviUzivatele = this.aktivitaJePlnaProPohlaviUzivatele.bind(this)
  }

  aktivitaJePlnaProPohlaviUzivatele (aktivita, pohlavi) {
    console.log('zavolal jsem metodu aktivitaJePlnaProPohlaviUzivatele')
    if (aktivita.prihlasenoMuzu + aktivita.prihlasenoZen >= aktivita.kapacitaMuzi + aktivita.kapacitaZeny + aktivita.kapacitaUniverzalni) {
      return true
    }
    if (pohlavi === 'm' && aktivita.prihlasenoMuzu >= aktivita.kapacitaMuzi + aktivita.kapacitaUniverzalni) {
      return true
    }
    if (pohlavi === 'f' && aktivita.prihlasenoZen >= aktivita.kapacitaZeny + aktivita.kapacitaUniverzalni) {
      return true
    }
    return false
  }

  urciTriduBunky () {
    if (this.aktivita.organizuje) {
      return 'organizuje' // uživatel je vypravěč
    }
    if (this.aktivita.prihlasen) {
      return 'prihlasen'
    }
    if (this.aktivita.prihlasenJakoNahradnik) {
      return 'nahradnik'
    }
    if (this.aktivitaJePlnaProPohlaviUzivatele(this.aktivita, this.props.uzivatelPohlavi)) {
      return 'prihlaseniNemozne'
    }
    if (this.aktivita.vDalsiVlne) {
      return 'vDalsiVlne'
    }
    if (this.aktivita.otevrenoPrihlasovani) {
      return 'neprihlasen'
    }
    return 'prihlaseniNemozne'
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
          aktivitaJePlnaProPohlaviUzivatele={this.aktivitaJePlnaProPohlaviUzivatele}
        />
      </td>
    )
  }
}
