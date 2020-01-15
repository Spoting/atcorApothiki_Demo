import React from 'react';

export default class TaskProducts extends React.Component {

    componentDidMount() {
        console.log()
    }
    toTasks = () => {
        this.props.history.push("/tasks");
    }

    render() {
        return (
            <div>
                <h1>taskProducts</h1>
                <h2>Passed Value from Navigator: {this.props.match.params.id}</h2>
                <button onClick={this.toTasks}>Back to Tasks</button>
            </div>
        )
    }
}