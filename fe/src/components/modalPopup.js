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
  onCloseModal = () => {
    this.setState({ open: false });
    this.props.close(); //cb function to change state of parent
  };
  render() {
    const { open } = this.state;
    let x = Object.keys(this.props.data);
    let y = Object.values(this.props.data);
    let z = []

    x.map((l, i)=> {
      if(x[i].match("id")) {
        return;
      } else {
        z.push(
          <tr>
            <td style={{borderRightWidth: "3px", borderRightStyle: "solid", borderRightColor: "black"}}>{x[i]}</td>
            <td style={{fontSize: "22px"}}>{y[i]}</td>
          </tr>
      
        )
      }
    })

    return (
      <div>
        {/* <button onClick={this.onOpenModal}>Open modal</button> */}
        <Modal open={open}  onClose={this.onCloseModal} center>
          <h2>Details</h2>
          <div class="table-responsive" style={{ width: "100%"}}>
            <table class="table">
              {z.map(o => {
                return o
              })}
            </table>
          </div>
        </Modal>
      </div>
    );
  }
}