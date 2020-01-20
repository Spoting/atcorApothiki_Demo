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

    // //Move it to addRow?
    // createTask = async (data) => {
    //     let invoiceId = this.state.selectedInvoice;
    //     let items = data;
    //     this.setState({ isLoading: true })
    //     let results = await ApiTasks.createTask();
    //     console.log("results", results);
    //     this.setState({ isLoading: false })
    // }

    setSelectedTask = async (selectedTask) => {
        this.setState({ selectedTask: selectedTask })
    }

    // selectTask = (e) => {
    //     this.setState({ selectedTask: e.target.value });
    // }

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

    render() {
        return (
            <div className=""style={{height:"500px" ,paddingLeft:"280px",minWidth:"1300px",paddingTop:"30px"}}>
                <div className="row">
                    <div className="col-lg-9">
                <DataGridGen
                    mode={this.state.mode}
                    data={this.state.tasks}
                    selectedRow={this.state.selectedTask}
                    setSelectedRow={this.setSelectedTask}
                    enableCellSelect={true}
                />
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
                 </div>
            </div>
            </div>
        );
    }
}

