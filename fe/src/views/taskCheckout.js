import React from 'react';

import GalleryWrapper from '../components/galleryWrapper';
import DataGridGen from '../components/dataGridGen';

const ApiTasks = require("../util/api").default.ApiTasks;
const ApiItems = require("../util/api").default.ApiItems;

export default class TaskCheckout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "TaskItems",
            modeSubTable: "ItemInvoices",
            taskItems: [],
            itemMovements: [],
            itemInvoices: [],
            images: [],
            selectedTaskItem: -1,
            selectedAtcorId: -1,
            selectedItemInvoice: -1,
            of: "",
            ofTask: "",
            isLoading: false,
            taskId: -1,
            areYouSure: false
        }
    }
    async componentDidMount() {
        console.log("TaskId", this.props.match.params.id);
        let x = parseInt(this.props.match.params.id);
        this.setState({ taskId: x }, async () => {
            await this._getTaskItems();

        })
    }
    async componentDidUpdate(prevProps, prevState) {
        console.log("Prev", prevState.selectedTaskItem);
        console.log("Curr", this.state.selectedTaskItem);
        if (this.state.selectedTaskItem !== prevState.selectedTaskItem) {
            console.log("Updating Table and SubTable");
            // await this._getTaskItems();
            // await this._getInvoicesItems();
            // this.setState({})
            await this._getItemInvoices();

        }
        if (this.state.selectedAtcorId !== prevState.selectedAtcorId) {
            console.log("Updating Gallery");
            await this._getImages();
            await this._getItemInvoices();
        }
    }

    setSelectedTaskItem = async (selectedTaskItem, selectedAtcorId, force) => {
        if (force) {
            await this._getTaskItems();
            // this._getTaskItemMovements();
        } else {
            this.setState({ selectedTaskItem: selectedTaskItem, selectedAtcorId: selectedAtcorId }, () =>
                console.log("Selected ", this.state.selectedAtcorId)
            )
        }
    }

    setSelectedItemInvoice = async (selectedItemInvoice) => {
        this.setState({ selectedItemInvoice: selectedItemInvoice }, () => console.log("Selected", this.state.selectedItemInvoice))
    }

    _getTaskItems = async () => {
        let results = await ApiTasks.getTaskItems(this.state.taskId);
        console.log("Get TaskItems in taskCheckout", results);
        if (results.err) {
            return;
        }
        let taskName = results.tasks[0].taskName;
        let sysName = results.tasks[0].sysName;
        let rows = results.tasks[0].items.map((r) => {
            let row = {};
            row.id = r.taskItems.id;
            row.atcorId = r.atcorId;
            row.atcorNo = r.atcorNo;
            row.name = r.name;
            row.PN = r.PN;
            row.atcorPN = r.atcorPN;
            row.nsn = r.nsn;
            row.totalStock = r.totalStock;
            row.totalMatOut = r.taskItems.totalMatOut;
            row.totalMatRet = r.taskItems.totalMatRet;
            row.matToCheckout = row.totalMatOut - row.totalMatRet;
            // row.matOut = 0;
            // row.matRet = 0;
            return row;
        })
        this.setState({
            taskItems: rows,
            ofTask: sysName.concat(taskName),
            // columns: columns
        });
    }
    _getItemInvoices = async () => {
        let results = await ApiItems.getItemInvoices(this.state.selectedAtcorId, 1);
        console.log("NANAN", results)
        if (results.err) {
            return;
        }
        let atcorId = results.items[0].atcorId;
        let atcorNo = results.items[0].atcorNo;
        let name = results.items[0].name;
        let rows = results.items[0].invoices.map((r) => {
            let row = {};
            row.id = r.invoiceItems.id;
            row.matInDate = r.matInDate;
            row.invoice = r.invoice;
            row.remark = r.remark;

            row.supplier = r.supplier;
            row.rfm_related = r.invoiceItems.rfm_related;
            row.task_related = r.invoiceItems.task_related;
            // row.atcorId = atcorId;
            // row.name = name;
            row.matInQnt = r.invoiceItems.matInQnt;
            row.availability = r.invoiceItems.availability;
            row.priceIn = r.invoiceItems.priceIn;
            return row;
        })
        this.setState({
            itemInvoices: rows,
            of: atcorNo
            // columns: columns
        });

    }
    _getImages = async () => {
        console.log(this.state.selectedAtcorId)
        let res = await ApiItems.getImages(this.state.selectedAtcorId);
        let sources = res.data.map((i) => {
            let img = '';
            img = 'http://localhost:8000/static/' + i;
            // img.width = 100;
            // img.height = 100;

            return img;
        });
        // console.log("Srcs", sources);
        this.setState({ images: sources })
    }

    //To calculate the cost of the items that were used for a task.
    // or of a specific Items( maybe better )
    _calculateCost = async () => {
        console.log("Start Calculating");
        let calculateResult = [];

        //Loop through all items
        await Promise.all(this.state.taskItems.map(async i => {
            console.log("For Item", i);
            let qntToCheckout = i.totalMatOut - i.totalMatRet;
            let results = await ApiItems.getItemInvoices(i.atcorId, 1);
            if (results.err) {
                return;
            }
            console.log(`Invoices For Item ${i.atcorId}`, results.items[0].invoices)
            let sortedInvoices = results.items[0].invoices.sort((a, b) =>
                new Date(...a.matInDate.split('-')) -
                new Date(...b.matInDate.split('-')));
            console.log("Sorted by Date", sortedInvoices);
            for ( i=0; i< sortedInvoices.length; i++ ) {
                console.log(`ToCheckout ${qntToCheckout} VS Availability ${sortedInvoices[i].invoiceItems.availability}`)
                let availability = sortedInvoices[i].invoiceItems.availability;

                // APPLY LOGIC OF AVAILABILTY HERE
                
            }
            // add x to calculateResult so we can log and save the data.
            let x = { item: "", totalCost: 0, usedInvoices: { invoice: "", qnt: 0 } }
        }))
        console.log("End of calculate cost");
    }

    render() {
        return (
            <div className="" style={{ height: "500px", paddingLeft: "50px", minWidth: "1300px", paddingTop: "60px" }}>
                <h1>Task Checkout</h1>
                <div className="row">
                    <div className="col-lg-9" >
                        <DataGridGen
                            mode={this.state.mode}
                            data={this.state.taskItems}
                            selectedRow={this.state.selectedTaskItem}
                            setSelectedRow={this.setSelectedTaskItem}
                            enableCellSelect={true}
                            taskId={this.state.taskId}
                            of={this.state.ofTask}
                        />
                        <button onClick={this._calculateCost}>Checkout {this.state.of}</button>
                        <div style={{ marginTop: '15px' }}>
                            <DataGridGen
                                mode={this.state.modeSubTable}
                                data={this.state.itemInvoices}
                                selectedRow={this.state.selectedItemInvoice}
                                setSelectedRow={this.setSelectedItemInvoice}
                                of={this.state.of}
                                enableCellSelect={false}
                            // editAvailability={true}
                            />
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <GalleryWrapper images={this.state.images} />
                    </div>
                </div>

            </div>
        );
    }
}

