class Tlacitka extends React.Component {
  constructor() {
    super();

    this.state = {
      tymovyModal: false,
      kolapsovanyModal: false
    };
    this.zavriModal = this.zavriModal.bind(this);
  }

  zavriModal() {
    this.setState({tymovyModal: false, kolapsovanyModal: false});
  }
}
