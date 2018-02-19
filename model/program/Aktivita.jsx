class Aktivita extends React.Component {
  constructor (props) {
    super(props)

    this.aktivitaJePlnaProPohlaviUzivatele = this.props.aktivitaJePlnaProPohlaviUzivatele
    this.aktivita = this.props.aktivita
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
          aktivitaJePlnaProPohlaviUzivatele={this.props.aktivitaJePlnaProPohlaviUzivatele}
        />
      </td>
    )
  }
}
