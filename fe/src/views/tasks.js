import React from 'react';
import DataGridGen from '../components/dataGridGen';

const ApiTasks = require("../util/api").default.ApiTasks;

export default class Tasks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "Tasks",
            // modeSubTable: "InvoiceItems",
            tasks: [],
            selectedTask: -1,
            taskName: ""
            // selectedInvoiceItem: -1,
            // invoiceItems: [],
            // images: [],
            // isLoading: false
        }
    }
    async componentDidMount() {
        await this._getTasks();
    }
    async componentDidUpdate(prevProps, prevState) {
        console.log("Prev", prevState.selectedTask);
        console.log("Curr", this.state.selectedTask);
        if (this.state.selectedTask !== prevState.selectedTask) {
            console.log("Updating Table")
            // await this._getTasks();
        }
    }

    setSelectedTask = async (selectedTask, force) => {
        if (force) {
            await this._getTasks();
        }
        let selectedTaskName = this.state.tasks.find(t => {
            if (t.id === selectedTask) {
                return t;
            }
        })
        if (selectedTaskName) {
            console.log("Name of Task", selectedTaskName.taskName)
            this.setState({ selectedTask: selectedTask, taskName: selectedTaskName.taskName })
        } else {
            this.setState({ selectedTask: selectedTask})
        }

    }

    _getTasks = async () => {
        let results = await ApiTasks.getTasks(true);
        if (results.err) {
            return;
        }
        let tasks = results.tasks;
        tasks.map((t) => console.log(t));
        this.setState({ tasks: tasks });
    }

    toTaskMvt = () => {
        if (this.state.selectedTask !== -1) {
            this.props.history.push("/taskMvt/" + this.state.selectedTask);
        } else {
            alert("Please Select a Task!")
        }
    }
    toTaskCheckout = () => {
        if (this.state.selectedTask !== -1) {
            this.props.history.push("/taskCheckout/" + this.state.selectedTask);
        } else {
            alert("Please Select a Task!")
        }
    }

    closeTask = async () => {
        if (this.state.selectedTask === -1) {
            alert("Please Select a Task!")
            return;
        }
        let selectedTaskCompleted = this.state.tasks.find(t => {
            if (t.id === this.state.selectedTask) {
                return t;
            }
        })
        if (selectedTaskCompleted) {
            if (selectedTaskCompleted.dateCompleted) {
                alert("Task Already Closed")
                return;
            }
        }
        console.log("Selected Task", this.state.selectedTask);
        console.log("Tasks", this.state.tasks);
        if (!this.state.areYouSure) {
            alert("Are you sure?")
            this.setState({ areYouSure: true });
            return;
        }
        let dateobj = new Date();
        let month = dateobj.getMonth() + 1;
        let day = dateobj.getDate();
        let year = dateobj.getFullYear();
        let taskId = this.state.selectedTask;
        let updateCompleted = { completed: true };
        let updateCompletedDate = { dateCompleted: year + "/" + month + "/" + day };
        let results1 = await ApiTasks.updateTask(taskId, updateCompleted);
        console.log("Ekleisa me boolean to ergo kyrie doiikita", results1);
        let results2 = await ApiTasks.updateTask(taskId, updateCompletedDate);
        console.log("Ekleisa me date to ergo kyrie doiikita", results2);
        this.setSelectedTask(-1, true);
    }

    render() {
        return (
            <div className="" style={{ height: "500px", paddingLeft: "50px", minWidth: "1300px", paddingTop: "60px" }}>
                <h1>Tasks </h1>
                <div className="row">
                    <div className="col-lg-9">
                        <DataGridGen
                            mode={this.state.mode}
                            data={this.state.tasks}
                            selectedRow={this.state.selectedTask}
                            setSelectedRow={this.setSelectedTask}
                            enableCellSelect={true}
                        />
                        <h2>Selected Task {this.state.taskName}</h2>
                        <button
                            className="btn btn-success"
                            style={{ marginRight: '15px' }}
                            onClick={this.toTaskMvt}> Task Movements
                 </button>
                        <button
                            className="btn btn-warning"
                            style={{ marginLeft: '15px', marginRight: '15px' }}
                            onClick={this.toTaskCheckout}> Task Checkout
                 </button>
                        <button
                            className="btn btn-danger"
                            style={{ marginLeft: '200px', marginRight: '15px' }}
                            onClick={this.closeTask}> Close Task
                 </button>
                    </div>
                </div>
            </div>
        );
    }
}

