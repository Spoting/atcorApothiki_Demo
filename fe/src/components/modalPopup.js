import React from 'react';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

export default class Popie extends React.Component {
  state = {
    open: false,
  };

  componentDidUpdate(nextProps) {
    if (nextProps.call !== this.props.call) {
      this.setState({ open: this.props.call })
    }
  }
  onOpenModal = () => {
    this.setState({ open: true });
  };
  onCloseModal = () => {
    this.setState({ open: false });
    this.props.close(); //cb function to change state of parent
  };
  render() {
    const { open } = this.state;
    return (
      <div>
        {/* <button onClick={this.onOpenModal}>Open modal</button> */}
        <Modal open={open} onClose={this.onCloseModal} center>
          <h2>Simple centered modal</h2>
        </Modal>
      </div>
    );
  }
}