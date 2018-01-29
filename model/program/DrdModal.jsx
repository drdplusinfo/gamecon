class DrdModal extends React.Component {
  constructor(props) {
    super(props);

    this.zavriModal = this.zavriModal.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    //nechceme, aby event vybublal a dělal bordel
    event.stopPropagation();
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
    return (
      <div className = "tymovy-modal" onClick = {this.handleClick}>
        <div className = "tymovy-modal--vnitrek">
          <div className = "modal-tlacitko_zavrit" onClick = {this.zavriModal}>Zavřít</div>
          <h2>DrD aktivita</h2>
          <div>{this.props.aktivita.nazev}</div>
          <div>{this.props.aktivita.zacatek}</div>
        </div>
      </div>
    );
  }
}
