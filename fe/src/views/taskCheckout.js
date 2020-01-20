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
            // selectedMovement: -1,
            of: "",
            ofTask: "",
            isLoading: false,
            taskId: -1
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
            row.totalStock = r.totalStock;
            row.totalMatOut = r.taskItems.totalMatOut;
            row.totalMatRet = r.taskItems.totalMatRet;
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
            row.invoice = r.invoice;
            row.remark = r.remark;
            row.matInDate = r.matInDate;
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
            let img = {};
            img.src = 'http://localhost:8000/static/' + i;
            img.width = 100;
            img.height = 100;

            return img;
        });
        // console.log("Srcs", sources);
        this.setState({ images: sources })
    }
    render() {
        return (
            <div className="" style={{ height: "500px", paddingLeft: "280px", minWidth: "1300px", paddingTop: "30px" }}>
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
                        <div style={{ marginTop: '15px' }}>
                            <DataGridGen
                                mode={this.state.modeSubTable}
                                data={this.state.itemInvoices}
                                selectedRow={this.state.selectedItemInvoice}
                                setSelectedRow={this.setSelectedItemInvoice}
                                of={this.state.of}
                                enableCellSelect={false}
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

