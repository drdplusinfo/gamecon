function MujProgram (props) {
  function vyfiltrujMojeAktivity (aktivity) {
    return aktivity.filter(aktivita => aktivita.prihlasen)
  }

  function vyfiltrujAktivityDne (cisloDne, aktivity) {
    return aktivity.filter(aktivita => new Date(aktivita.zacatek).getDay() === cisloDne)
  }

  const mojeAktivity = vyfiltrujMojeAktivity(props.data.aktivity)

  return (
    <table className = "tabulka">
      <thead>
        <HlavickaRozvrhu/>
      </thead>
      <ProgramovaLinie 
        nazev={'středa'} 
        aktivity={vyfiltrujAktivityDne(KONSTANTY.DNY_V_TYDNU.STREDA, mojeAktivity)}
        data = {props.data}
        zvolTutoAktivitu={props.zvolTutoAktivitu}
        mujProgram={true}
      />
      <ProgramovaLinie 
        nazev={'čtvrtek'} 
        aktivity={vyfiltrujAktivityDne(KONSTANTY.DNY_V_TYDNU.CTVRTEK, mojeAktivity)}
        data = {props.data}
        zvolTutoAktivitu={props.zvolTutoAktivitu}        
        mujProgram={true}
      />
      <ProgramovaLinie 
        nazev={'pátek'} 
        aktivity={vyfiltrujAktivityDne(KONSTANTY.DNY_V_TYDNU.PATEK, mojeAktivity)}
        data = {props.data}
        zvolTutoAktivitu={props.zvolTutoAktivitu}
        mujProgram={true}
      />
      <ProgramovaLinie 
        nazev={'sobota'} 
        aktivity={vyfiltrujAktivityDne(KONSTANTY.DNY_V_TYDNU.SOBOTA, mojeAktivity)}
        data = {props.data}
        zvolTutoAktivitu={props.zvolTutoAktivitu}
        mujProgram={true}
      />
      <ProgramovaLinie 
        nazev={'neděle'} 
        aktivity={vyfiltrujAktivityDne(KONSTANTY.DNY_V_TYDNU.NEDELE, mojeAktivity)}
        data = {props.data}
        zvolTutoAktivitu={props.zvolTutoAktivitu}
        mujProgram={true}
      />
    </table>
  )
}