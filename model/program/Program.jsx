class Program extends React.Component {

  constructor (props) {
    super(props)

    console.log(this.props.api.zakladniData)

    this.zapniUpdateUIPriZmeneDat()


    this.state = {
      linie: this.uklidLinie(this.props.api.zakladniData.linie),
      zvolenyDen: KONSTANTY.DNY_V_TYDNU.CTVRTEK,
      zvolenaAktivita: {},
      stitky: this.ziskejStitky(),
      zobrazJenVolneAktivity: false,
      mujProgramZapnuty: false
    }

    this.aktivitaJePlnaProPohlaviUzivatele = this.aktivitaJePlnaProPohlaviUzivatele.bind(this)
    this.prepniZobrazeniVolnychAktivit = this.prepniZobrazeniVolnychAktivit.bind(this)
    this.zmenLinie = this.zmenLinie.bind(this)
    this.zmenStitky = this.zmenStitky.bind(this)
    this.zvolMujProgram = this.zvolMujProgram.bind(this)
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
    this.props.api.zakladniData.aktivity.forEach(aktivita => {
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

  zvolMujProgram () {
    this.setState({
      mujProgramZapnuty: true,
      zvolenyDen: null
    })
  }

  zvolTentoDen (cisloDneVTydnu) {
    this.setState({
      mujProgramZapnuty: false,
      zvolenyDen: cisloDneVTydnu
    })
  }

  zvolTutoAktivitu (aktivita) {
    console.log('Zvol tuto aktivitu volá: ', aktivita)
    this.setState({zvolenaAktivita: aktivita})
  }

  componentWillUpdate (nextProps, nextState) {
    console.log(nextState)
  }

  render () {
    return (
      <div>
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
        <ZvolDenNeboMujProgram
          mujProgramZapnuty = {this.state.mujProgramZapnuty}
          zvolMujProgram = {this.zvolMujProgram}
          zvolenyDen={this.state.zvolenyDen}
          zvolTentoDen={this.zvolTentoDen}
        />
        {
          this.state.mujProgramZapnuty ?
          <MujProgram
            data = {this.props.api.zakladniData}
            zvolTutoAktivitu={this.zvolTutoAktivitu}
          />
          :
          <Rozvrh
            aktivitaJePlnaProPohlaviUzivatele={this.aktivitaJePlnaProPohlaviUzivatele}
            api={this.props.api}
            data={this.props.api.zakladniData}
            zobrazJenVolneAktivity={this.state.zobrazJenVolneAktivity}
            linie={this.state.linie}
            stitky={this.state.stitky}
            zvolenyDen={this.state.zvolenyDen}
            zvolTutoAktivitu={this.zvolTutoAktivitu}
          />
        }
        {this.state.zvolenaAktivita.id &&
          <DetailAktivity
            api={this.props.api}
            data={this.props.api.zakladniData}
            zvolenaAktivita={this.state.zvolenaAktivita}
            zvolTutoAktivitu={this.zvolTutoAktivitu}
            aktivitaJePlnaProPohlaviUzivatele={this.aktivitaJePlnaProPohlaviUzivatele}
          />
        }
      </div>
    )
  }
}
