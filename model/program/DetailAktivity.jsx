class DetailAktivity extends React.Component {
  componentDidMount() {
    this.nactiDetail();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.zvolenaAktivita !== this.props.zvolenaAktivita) {
      this.nactiDetail();
    }
  }

  nactiDetail() {
    this.props.api.nactiDetail(this.props.zvolenaAktivita);
  }

  //udělěj element pro štítky každé kategorie(kde nějaké štítky jsou)
  //a element pro ostatní štítky
  vykresliStitky(aktivita) {
    let kategorizovaneStitky = this.priradStitkyAktivityDoKategorii(aktivita);
    
    let naplneneKategorie = kategorizovaneStitky.kategorie.filter(kat => kat.stitky.length > 0);
    let serazeneKategorie = naplneneKategorie.sort((katA, katB) => katA.poradi - katB.poradi);

    let kategorieJakoElementy = serazeneKategorie.map((kat, index) => {
      return (
        <p key = {index}>{kat.nazev + ": " + kat.stitky.join(", ")}</p>
      );
    });

    return (
      <div>
        {kategorieJakoElementy}
        <p>{kategorizovaneStitky.ostatni.join(", ")}</p>
      </div>
    );
  }

  priradStitkyAktivityDoKategorii(aktivita) {
    let testStitky = [
      "Systém: Kdo z koho", "Systém: Oko za oko", "Herní styl: komedie", "Herní styl: na Buchtíka", "Herní styl: absurdní drama",
      "Žánr: epika", "Žánr: whatever", "Prostředí: Maníkův barák", "Prostředí: My little pony", "Prostředí: julo: pomstitel",
      "další štítek", "pro pokročilé", "pro zkušené", "nechceme nikoho"
    ];

    //TODO: v ostré verzi změnit na stitky = aktivita.stitky
    let stitky = testStitky;

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
          let castZaDvouteckou = match[1];
          kat.stitky.push(castZaDvouteckou);
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

  vytvorZaviraciTlacitko() {
    return <button onClick = {() => this.props.zvolTutoAktivitu({})}>x</button>
  }

  zobrazDlouhyPopisNeboLoader(aktivita) {
    if (aktivita.popisDlouhy) {
      return <p dangerouslySetInnerHTML = {{__html: aktivita.popisDlouhy}}></p> 
    } else {
      return <Loader />;
    }
  }

  render() {
    let aktivita = this.props.data.aktivity.find(akt => akt.id === this.props.zvolenaAktivita);
    let linie = this.props.data.linie.find(lajna => lajna.id == aktivita.linie);

    return (
      <div className = "detail-aktivity">
        {this.vytvorZaviraciTlacitko()}
        
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
          {this.zobrazDlouhyPopisNeboLoader(aktivita)}
        </div>        
      </div>
    );
  }
}
