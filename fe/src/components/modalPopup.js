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
  // onOpenModal = () => {
  //   this.setState({ open: true });
  // };
  onCloseModal = () => {
    this.setState({ open: false });
    this.props.close(); //cb function to change state of parent
  };
  render() {
    const { open } = this.state;
    let x = Object.keys(this.props.data);
    let y = Object.values(this.props.data);
    let z = []

    for (let i = 0; i < x.length; i++) {
      if (x[i].includes("id")) {
        i++
      } else {
        z.push(
          <div>
            <span>{x[i] + ':  ' + y[i] + " "}</span>
            <span></span>
          </div>
        )
      }
    }
    return (
      <div>
        {/* <button onClick={this.onOpenModal}>Open modal</button> */}
        <Modal open={open} onClose={this.onCloseModal} center>
          <h2>Details</h2>
          {z.map(o => {
            return o
          })}
        </Modal>
      </div>
    );
  }
}