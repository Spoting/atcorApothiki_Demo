import React from 'react';

export default class Tasks extends React.Component {
    state = {
        taskId: "8"
    }

    toHome = () => {
        this.props.history.push("/");
    }
    toTaskProducts = () => {
        this.props.history.push("/task_products/" + this.state.taskId);
    }
    render() {
        return (
            <div>
                <h1 onDoubleClick={this.toTaskProducts}>Tasks</h1>
                <h2>Id: {this.state.taskId}</h2>
                <button onClick={this.toHome}>Back to Home</button>
            </div>
        )
    }
}