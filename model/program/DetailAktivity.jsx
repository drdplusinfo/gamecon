class DetailAktivity extends React.Component {
  constructor() {
    super();

    this.state = {
      dlouhyPopis: ' '
    };
  }

  componentDidMount() {
    this.nactiPopis();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.zvolenaAktivita !== this.props.zvolenaAktivita) {
      this.nactiPopis();
    }
  }

  nactiPopis() {
    this.setState({dlouhyPopis: ''})
    this.props.api.detail(this.props.zvolenaAktivita, (data) => {
      this.setState({dlouhyPopis: data.popis});
    });
  }

  //udělěj element pro štítky každé kategorie(kde nějaké štítky jsou)
  //a element pro ostatní štítky
  vykresliStitky(aktivita) {
    let stitky = this.ziskejStitky(aktivita);
    let kategorie = stitky.kategorie.filter(kat => kat.stitky.length > 0);
    kategorie = kategorie.sort((katA, katB) => katA.poradi - katB.poradi);
    kategorie = kategorie.map((kat, index) => {
      return (
        <p key = {index}>{kat.nazev + ": " + kat.stitky.join(", ")}</p>
      );
    });
    return (
      <div>
        {kategorie}
        <p>{stitky.ostatni.join(", ")}</p>
      </div>
    );
  }

  ziskejStitky(aktivita) {
    let testStitky = [
      "Systém: Kdo z koho", "Systém: Oko za oko", "Herní styl: komedie", "Herní styl: na Buchtíka", "Herní styl: absurdní drama",
      "Žánr: epika", "Žánr: whatever", "Prostředí: Maníkův barák", "Prostředí: My little pony", "Prostředí: julo:pomstitel",
      "další štítek", "pro pokročilé", "pro zkušené", "nechceme nikoho"
    ];

    //TODO: v ostré verzi změnit na stitky = aktivita.stitky
    let stitky = testStitky;
    //kategorie by měly jít lehce přidávat a měnit pořadí
    let kategorie = [
      {
        nazev: "Systém",
        stitky: [],
        poradi: 1
      },
      {
        nazev: "Herní styl",
        stitky: [],
        poradi: 2
      },
      {
        nazev: "Žánr",
        stitky: [],
        poradi: 3
      },
      {
        nazev: "Prostředí",
        stitky: [],
        poradi: 4
      }
    ];
    let ostatni = [];

    //pro každý štítek testujeme pro každou kategorii, jestli patří do jedné z nich
    //jestli patří, vložíme část za dvojtečkou do objektu k dané kategorii
    //jestli nepatří do žádné kategorie, vložíme ho do pole "ostatni"
    stitky.forEach(stitek => {
      let patriDoKategorie = false;

      kategorie.forEach(kat => {
        let regex = new RegExp(kat.nazev + ': (.*)');
        let match = stitek.match(regex);
        if(match) {
          kat.stitky.push(match[1]);
          patriDoKategorie = true;
        }
      });

      if(!patriDoKategorie) {
        ostatni.push(stitek);
      }
    });

    return {
      kategorie: kategorie,
      ostatni: ostatni
    };
  }

  render() {
    let aktivita = this.props.data.aktivity.find(akt => akt.id === this.props.zvolenaAktivita);
    let linie = this.props.data.linie.find(lajna => lajna.id == aktivita.linie);

    return (
      <div className = "detail-aktivity">
        <button onClick = {() => this.props.zvolTutoAktivitu({})}>x</button>
        <h2>{aktivita.nazev}</h2>
        <p>Linie: {linie.nazev}</p>
        <p>---</p>
        {this.vykresliStitky(aktivita)}
        <p>---</p>
        <p>Vypravěč: {aktivita.organizatori.join(', ')}</p>
        <p>{aktivita.popisKratky}</p>
        <TlacitkoPrihlasit
          aktivita = {aktivita}
          api = {this.props.api}
          trida = 'tlacitko-prihlasit--detail'
          uzivatelPohlavi = {this.props.data.uzivatelPohlavi}
        />
        <p>---</p>
        <div>
          {this.state.dlouhyPopis ?
            <p>{this.state.dlouhyPopis}</p>
            : <Loader />
          }
        </div>
      </div>
    );
  }
}
