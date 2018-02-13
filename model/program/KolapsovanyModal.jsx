class KolapsovanyModal extends React.Component {
  constructor(props) {
    super(props);

    this.zavriModal = this.zavriModal.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.vypisSdruzeneAktivity = this.vypisSdruzeneAktivity.bind(this);
  }

  handleClick(event) {
    //nechceme, aby event vybublal a dělal bordel
    event.stopPropagation();
  }

  vypisSdruzeneAktivity() {
    let radekSdruzeneAktivity = this.props.aktivita.sdruzene.map((aktivita, index) => {
      let aktivitaNesdruzena = Object.assign({}, aktivita, {sdruzit: false});
      console.log(aktivitaNesdruzena.organizatori);
      return (
        <tr>
          <td>{index}</td>
          <td>{aktivitaNesdruzena.tymovaData.nazevTymu}</td>
          <td>{aktivitaNesdruzena.organizatori}</td>
          <td><a href="/drd/prihlaseni/panove-jeskyne" target="_blank">PJ</a></td>
          <td><TlacitkoPrihlasit
            aktivita = {aktivitaNesdruzena}
            api = {this.props.api}
            trida = 'tlacitko-prihlasit_modal'
            uzivatelPohlavi = {this.props.uzivatelPohlavi}
           /></td>
        </tr>
      );
    });
    return <table>+{radekSdruzeneAktivity}+</table>;
  }

  zavriModal() {
    this.props.zavriModal();
  }

  render() {
    /* drd modal je "neviditelný" když není zobrazen. Protože nechceme, aby byl při
    zavření zničen, chceme, aby si držel data */
    if (!this.props.zobrazen) {
      return null;
    }
    console.log(this.props.aktivita)
    return (
      <div className = "tymovy-modal" onClick = {this.handleClick}>
        <div className = "tymovy-modal--vnitrek">
          <div className = "modal-tlacitko_zavrit" onClick = {this.zavriModal}>Zavřít</div>
          <h2>DrD aktivita</h2>
          {this.vypisSdruzeneAktivity()}
        </div>
      </div>
    );
  }
}
