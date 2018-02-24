class Program extends React.Component {

  constructor (props) {
    super(props)

    console.log(this.props.api.zakladniData)

    this.zapniUpdateUIPriZmeneDat()

    this.data = this.props.api.zakladniData

    this.state = {
      linie: this.uklidLinie(this.data.linie),
      zvolenyDen: KONSTANTY.DNY_V_TYDNU.CTVRTEK,
      idZvoleneAktivity: null,
      stitky: this.ziskejStitky(),
      zobrazJenVolneAktivity: false
    }

    this.aktivitaJePlnaProPohlaviUzivatele = this.aktivitaJePlnaProPohlaviUzivatele.bind(this)
    this.prepniZobrazeniVolnychAktivit = this.prepniZobrazeniVolnychAktivit.bind(this)
    this.zmenLinie = this.zmenLinie.bind(this)
    this.zmenStitky = this.zmenStitky.bind(this)
    this.zvolTentoDen = this.zvolTentoDen.bind(this)
    this.zvolTutoAktivitu = this.zvolTutoAktivitu.bind(this)
  }

  aktivitaJePlnaProPohlaviUzivatele (aktivita, pohlavi) {
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

  prepniZobrazeniVolnychAktivit () {
    this.setState({zobrazJenVolneAktivity: !this.state.zobrazJenVolneAktivity})
  }

  uklidLinie (linie) {
    // seřaď linie podle pořadí a nastav je jako zvolené
    let upraveneLinie = linie.map(lajna => Object.assign({}, lajna, {zvolena: true}))
    return upraveneLinie.sort((lajnaA, lajnaB) => lajnaA.poradi - lajnaB.poradi)
  }

  zapniUpdateUIPriZmeneDat () {
    this.props.api.zmenaZakladnichDat = this.forceUpdate.bind(this)
  }

  ziskejStitky () {
    // Projdi pole aktivit, vytáhni všechny štítky a nastav je jako nezvolené
    let stitky = []
    this.data.aktivity.forEach(aktivita => {
      aktivita.stitky.forEach(stitek => {
        if (!(stitky.includes(stitek))) {
          stitky.push(stitek)
        }
      })
    })
    stitky = stitky.map(stitek => {
      return {
        nazev: stitek,
        zvoleny: false
      }
    })
    return stitky
  }

  zmenLinie (linie) {
    this.setState({linie: linie})
  }

  zmenStitky (stitky) {
    this.setState({stitky: stitky})
  }

  zvolTentoDen (cisloDneVTydnu) {
    this.setState({zvolenyDen: cisloDneVTydnu})
  }

  zvolTutoAktivitu (aktivita) {
    console.log(aktivita)
    this.setState({idZvoleneAktivity: aktivita.id})
  }

  render () {
    return (
      <div>
        <TestVyber 
          api = {this.props.api}
          aktivita = {this.data.aktivity.find(aktivita => aktivita.tymovaData)}
        />
        <Header />
        <ZvolTypy
          zobrazJenVolneAktivity={this.state.zobrazJenVolneAktivity}
          linie={this.state.linie}
          stitky={this.state.stitky}
          prepniZobrazeniVolnychAktivit={this.prepniZobrazeniVolnychAktivit}
          zmenLinie={this.zmenLinie}
          zmenStitky={this.zmenStitky}
        />
        <ZvolStitky
          stitky={this.state.stitky}
          zmenStitky={this.zmenStitky}
        />
        <ZvolDen
          zvolenyDen={this.state.zvolenyDen}
          zvolTentoDen={this.zvolTentoDen}
        />
        <Rozvrh
          aktivitaJePlnaProPohlaviUzivatele={this.aktivitaJePlnaProPohlaviUzivatele}
          api={this.props.api}
          data={this.data}
          zobrazJenVolneAktivity={this.state.zobrazJenVolneAktivity}
          linie={this.state.linie}
          stitky={this.state.stitky}
          zvolenyDen={this.state.zvolenyDen}
          zvolTutoAktivitu={this.zvolTutoAktivitu}
        />
        {this.state.idZvoleneAktivity &&
          <DetailAktivity
            api={this.props.api}
            data={this.data}
            idZvoleneAktivity={this.state.idZvoleneAktivity}
            zvolTutoAktivitu={this.zvolTutoAktivitu}
            aktivitaJePlnaProPohlaviUzivatele={this.aktivitaJePlnaProPohlaviUzivatele}
          />
        }
      </div>
    )
  }
}
