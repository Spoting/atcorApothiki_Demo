import React from 'react';
import DataGrid from './dataGrid';

export default class Products extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode : "items"
        }
    }
   
    toHome = () => {
        this.props.history.push("/");
    }

    render() {
        return (
            <div>
                <h1>Items</h1>
                <button onClick={ ()=>this.setState( { mode: "tasks"})}> Test Update</button>
                <DataGrid mode={this.state.mode}/>
                <button onClick={this.toHome}>Back to Home </button>
                
            </div>
        );
    }
}