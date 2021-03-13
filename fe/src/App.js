import React, { Component } from 'react';
import './App.css';
import Navigation from './components/navigation';
class App extends Component {
  state = { text: "" }

  // async componentDidMount() {
  //     let response = await fetch("http://localhost:8001/api");
  //     let json = await response.json();
  //     this.setState({ text: json.message });
  //   }
  productScreen = () => {
    this.props.history.push('/items');
  }
  taskScreen = () => {
    this.props.history.push('/tasks');
  }
  render() {
    return (
      <div className="App">
        <Navigation></Navigation>
        <h1 className="ARXHGOS" >ARXHGOS BES</h1>
        <h2 className="ARXHGOS2" >ARXHGOS VGES</h2>

         <footer className="footer">
          <div className="container">
            <span className="text-muted">Place sticky footer content here.</span>
          </div>
        </footer> 
      </div>
    );
  }

}

export default App;
// render() {
//   return (
//     <div className="App">
//       <h1>Welcome Biatch</h1>
//       <h1>Atcor Apothiki</h1>
//       <button onClick={this.productScreen}>Go to Products</button>
//       <button onClick={this.taskScreen}>Go to Tasks</button>
//     </div>
//   );
// }