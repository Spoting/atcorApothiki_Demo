import React from 'react';
import ReactDataGrid from 'react-data-grid';
import update from 'immutability-helper';
import { Toolbar, Data, Filters, Editors } from "react-data-grid-addons";
import { addRow } from './addRow';
import { updateRow } from './updateRow';
import { columnsActions } from './columns';

const ApiTasks = require("../util/api").default.ApiTasks;

const Selectors = Data.Selectors;
const {
    NumericFilter,
    AutoCompleteFilter,
    SingleSelectFilter,
} = Filters;
const {
    AutoComplete: AutoCompleteEditor,
    DropDownEditor
} = Editors;

const unitOptions = [
    { id: "KG", value: "KG" },
    { id: "EA", value: "EA" },
    { id: "LT", value: "LT" },
    { id: "M", value: "M" },
    { id: "M2", value: "M2" },
    { id: "M3", value: "M3" },
    { id: "SET", value: "SET" }
]

export default class dataGridGen extends React.Component {
    constructor(props) {
        super(props);
        this._columns = [];
        this._itemNames = [];
        this.state = {
            rows: [],
            filters: [],
            selectedId: 0,
            images: [],
            selectedKeys: [],
            tasks: [],
            selectedTask: "-1:default",
            // cellUpdateCss: "red"
        };
    }

    async componentDidMount() {

        if ((this.props.mode === "Items")) {
            await this._getTasks(false);
        }
        if ((this.props.mode === "InvoiceItems")) {
            await this._getTasks(false);
        }
        this._setColumns();
        this.setState({ rows: this.props.data })
    };

    async componentDidUpdate(nextProps) {
        if (this.props.data !== nextProps.data) {
            this._setColumns();
            // console.log("AAA", this.props.data)
            this.setState({ rows: this.props.data, selectedKeys: [] }); //Keeping before selected off
        }
        //Get tasks when mode ===items
        // if ((this.props.mode === "Items")) {
        //     // await this._getTasks(false);
        // }
        if ((this.props.mode === "InvoiceItems")) {
            if (this.props.itemNamesFilter !== nextProps.itemNamesFilter) {
                // await this._getTasks(false);
                this._itemNames = this.props.itemNamesFilter;
                console.log("NAAAMES", this._itemNames);
                this._setColumns();
            }
        }
        // if (this.props.mode === "TaskItems") {
        //     if (this.props.selectedRow !== nextProps.selectedRow) {
        //         console.log("PEOOOS");
        //     }
        // }
    }


    isRowEditable = (row) => {
        if (this.props.mode === "InvoiceItems") {
            if (row.id > 0) {
                return false;
            }
        }
        if (row) {
            let found = this.state.selectedKeys.find(i => { return i === row.id });
            let isEditable = false;
            if (found) {
                isEditable = true;
            }
            return isEditable;
        }
    }
    _setColumns = () => {
        let data = this.props.data;
        if (data.length > 0) {
            let ca = {};
            if (this.props.mode === "ItemInvoices") {
                ca = columnsActions.ItemInvoices
            }
            if (this.props.mode === "Invoices") {
                ca = columnsActions.Invoices
            }
            if (this.props.mode === "InvoiceItems") {
                ca = columnsActions.InvoiceItems
            }
            if (this.props.mode === "Tasks") {
                ca = columnsActions.Tasks
            }
            if (this.props.mode === "TaskItems") {
                ca = columnsActions.TaskItems
            }
            if (this.props.mode === "ItemMovements") {
                ca = columnsActions.TaskItemMovement
            }
            let titles = ca.titles;
            console.log("Titles", titles);
            let tempColumns = Object.keys(data[0]);
            // let keys = Object.keys(titles);
            let columns = tempColumns.map((x) => {
                let y = {
                    key: x,
                    name: x,
                    resizable: true,
                    visible: true
                    // editable: true
                };
                titles.find(t => {
                    let keys = Object.keys(t);
                    if (keys[0] === y.key) {
                        y.name = t.title;
                    }
                })
                if (y.key === 'name') {
                    y.width = 150;
                }
                if (y.key === 'id' || y.key === 'taskItemId' || y.key === 'atcorId') {
                    y.visible = false;
                }
                if (ca.isEditable.find((i) => { return i === x })) {
                    y.editable = this.isRowEditable;
                }

                if (ca.notEditable.find((i) => { return i === x })) {
                    y.sortable = false;
                    y.editable = false;
                }

                if (ca.filterAutoComplete.find((i) => { return i === x })) { //Logic to make columns not <something>
                    y.filterRenderer = AutoCompleteFilter;
                    y.filterable = true;
                }
                if (ca.filterSingleSelect.find((i) => { return i === x })) {
                    y.filterRenderer = SingleSelectFilter;
                    y.filterable = true;
                }
                if (ca.filterNumeric.find((i) => { return i === x })) { //Logic to make columns not <something>
                    y.filterRenderer = NumericFilter;
                    y.filterable = true;
                }
                if (ca.filterNormal.find((i) => { return i === x })) {
                    y.filterable = true;
                }
                if (ca.editorAutoComplete.find((i) => { return i === x })) {
                    // y.editor = EditorAutoComplete;
                    y.editor = <AutoCompleteEditor options={this._itemNames} />;
                }
                if (ca.editorDropDown.find((i) => { return i === x })) {
                    if (y.key === "unit") {
                        y.editor = <DropDownEditor options={unitOptions} />;
                    }
                    // y.editor = EditorDropDown;  
                }
                // if (ca.isFormattable.find((i) => { return i === x })) {
                //     y.formatter = NameFormatter;
                // }
                if (ca.isSortable.find((i) => { return i === x })) {
                    y.sortable = true;
                }

                return y;
            });
            // this._columns = columns;
            //Hide cols
            const cols = columns.filter(column => column.visible === true)
            this._columns = cols;
            console.log("COLUMNS", cols);
        }
    }

    // changeStyle = (e) => {
    //     let r = document.getElementsByClassName("react-grid-Cell");
    //     console.log(r);
    //     for (let i=0; i < r.length; i++) {
    //         r[i].style.backgroundColor = "black"
    //     }
    // }

    onRowDoubleClick = (row) => {
        console.log("Double Click");
        // this.changeStyle()
    }

    onRowClick = (row) => {
        if (row === -1) {
            return;
        }
        let rows = this.getRows();
        if ((this.props.mode === "Invoices") || /** (this.props.mode === "ItemInvoices") || */ (this.props.mode === "Tasks")) {
            if (this.props.selectedRow !== rows[row].id) {
                this.props.setSelectedRow(rows[row].id);
            }
        }
        if ((this.props.mode === "InvoiceItems") || (this.props.mode === "TaskItems")) {
            console.log("rowwwwww", rows[row].id, rows[row].atcorId);
            if (this.props.selectedRow !== rows[row].id) {
                this.props.setSelectedRow(rows[row].id, rows[row].atcorId);
            }
        }
    }

    /////////////////// Sorting and Filtering
    getRows = () => {
        // return Selectors.getRows(this.state);

        return Selectors.getRows(this.state)
    };

    getSize = () => {
        return this.getRows().length;
    };

    rowGetter = (rowIdx) => {
        const rows = this.getRows();
        // console.log("Row", rows[rowIdx]);
        return rows[rowIdx];
    };

    handleGridSort = (sortColumn, sortDirection) => {
        this.setState({ sortColumn, sortDirection });
    };

    handleFilterChange = (filter) => {
        setTimeout(() => {
            const newFilters = { ...this.state.filters };
            // console.log("FF", newFilters)
            if (filter.filterTerm) {
                newFilters[filter.column.key] = filter;
                // console.log("newFilters", newFilters)
            } else {
                delete newFilters[filter.column.key];
            }
            this.setState({ filters: newFilters, selectedKeys: [] }, () => {
                // console.log("AfterHandleFilter RowsSelect", this.state.selectedKeys)
            });
        }, 1000)
    };

    onClearFilters = () => {
        this.setState({ filters: {}, selectedKeys: [] }, () => {
            // console.log("AfterClearFilter RowsSelect", this.state.selectedKeys)
        });
    };

    ////////////EDITABLE + ADD ROW//////////////////
    handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        // console.log('xrrr', toRow, updated)
        if (fromRow !== toRow) {
            return;
        }
        let tmpRows = [...this.getRows()];
        let rows = [...this.state.rows];

        updateRow(this.props.mode, tmpRows[fromRow], updated)
            .then((response) => {
                if (!response) { return }
                if (response.err) {
                    alert(response.msg);
                    return;
                }
                if (this.props.mode === "TaskItems") {
                    //  callback to call parent to refresh both tables
                    // so no need to update
                    console.log("GAMIMENO CALLBACK");
                    this.props.setSelectedRow(-1, -1, true)
                    return;
                }
                if (this.props.mode === "InvoiceItems" && response.found) {
                    console.log("Mesa sto UpdateRow tou invoiceItems")
                    console.log(response.foundItems);
                    console.log(tmpRows[fromRow]);
                    if (response.newAvailability) {
                        tmpRows[fromRow].availability = updated.matInQnt;
                    }
                    // updated.name = "lalala";
                    if (response.found && response.foundItems) {
                        // if (response.foundItems.items.length === 1) {
                        let foundItems = response.foundItems.items[0];
                        console.log("gamiete to name", updated);
                        if (response.foundBy === "atcorNo") {
                            console.log("vrike 8ewritika kati", foundItems);
                            tmpRows[fromRow].atcorId = foundItems.atcorId;
                            tmpRows[fromRow].atcorNo = foundItems.atcorNo;
                            updated.name = foundItems.name;
                            // tmpRows[fromRow].name = foundItems.name;
                            tmpRows[fromRow].nsn = foundItems.nsn;
                            tmpRows[fromRow].unit = foundItems.unit;
                            tmpRows[fromRow].atcorPN = foundItems.atcorPN;
                            tmpRows[fromRow].PN = foundItems.PN;
                            tmpRows[fromRow].characteristic_1 = foundItems.characteristic_1;
                            tmpRows[fromRow].characteristic_2 = foundItems.characteristic_2;
                        }
                        this.props.setSelectedRow(tmpRows[fromRow].id, tmpRows[fromRow].atcorId)
                        // }
                    }
                } else {
                    if (response.foundBy === "name") {
                        tmpRows[fromRow].atcorId = 0;
                        tmpRows[fromRow].atcorNo = "";
                        // tmpRows[fromRow].name = response.foundItems.items[0].name;
                        tmpRows[fromRow].nsn = "";
                        tmpRows[fromRow].unit = "";
                        tmpRows[fromRow].PN = "";
                        tmpRows[fromRow].atcorPN = "";
                        tmpRows[fromRow].characteristic_1 = "";
                        tmpRows[fromRow].characteristic_2 = "";
                    }
                    this.props.setSelectedRow(tmpRows[fromRow].id, tmpRows[fromRow].atcorId)
                }

                let updatedRows = [];
                for (let i = fromRow; i <= toRow; i++) {
                    // await ApiItems.updateItem( tmpRows[i].id ,updated);
                    const rowToUpdate = tmpRows[i];
                    const updatedRow = update(rowToUpdate, { $merge: updated });
                    tmpRows[i] = updatedRow;
                    updatedRows.push(tmpRows[i]);
                }

                if (tmpRows !== this.state.rows) {
                    // console.log("tmpRows", tmpRows);
                    // console.log("rowsBefore", this.state.rows);
                    updatedRows.map((uRow) => {
                        let index = rows.findIndex((r) => r.id === uRow.id);
                        if (index !== -1) {
                            rows[index] = uRow;
                        }
                    })
                    console.log("UpdatedRows", updatedRows);
                }
                this.setState({ rows: rows });
            });
    };

    handleAddRow = () => {
        let data = {};
        let tempId = this.state.rows.length + 2;
        if ((this.props.mode === "InvoiceItems") && (this.state.rows.length > 0)) {
            tempId = -tempId;
        } 
        data.tempId = tempId;
        console.log("HandleAddRowInvoiceItemId", data.tempId)
        console.log("LEEENGHT", this.state.rows.length)
        addRow(this.props.mode, data)
            .then((newDbItem) => {
                console.log(newDbItem);
                if (newDbItem.err) {
                    console.log(newDbItem.err)
                    alert(newDbItem.err);
                    return;
                }
                if (newDbItem) {
                    let newRow = newDbItem;
                    let rows = this.state.rows.slice();
                    rows = update(rows, { $unshift: [newRow] });

                    /** For keeping previous selected */
                    // let selectedKeys = [...this.state.selectedKeys];
                    // selectedKeys.push(newRow.id);
                    let selectedKeys = [];
                    selectedKeys.push(newRow.id);

                    this.setState({ rows, selectedKeys }, () => console.log(this.state.rows, this.state.selectedKeys));
                }
            });
    };


    getValidFilterValues(rows, columnId) {
        return rows.map(r => r[columnId])
            .filter((item, i, a) => {
                return i === a.indexOf(item);
            });
    }
    onRowsSelected = (rows) => {
        // console.log("Select:Rows", rows);
        this.setState({ selectedKeys: this.state.selectedKeys.concat(rows.map(r => r.row.id)) }, () => {
            console.log("Select", this.state.selectedKeys)
        });

    };

    onRowsDeselected = (rows) => {
        // console.log("DeSelect:Rows", rows);
        const rowKeys = rows.map(r => r.row.id);
        this.setState({ selectedKeys: this.state.selectedKeys.filter(i => rowKeys.indexOf(i) === -1) }, () => {
            // console.log("DeSelect", this.state.selectedKeys)
        });
    };



    selectTask = (e) => {
        this.setState({ selectedTask: e.target.value });
    }
    assignItemsToTask = () => {
        // console.log("TASKDEFAULT", this.state.selectedTask)
        let splitted = this.state.selectedTask.split(":");
        let taskId = parseInt(splitted[0]);
        let taskName = splitted[1];
        // console.log("TASKID", splitted);
        if (taskId === -1) {
            alert("Please Select a Task first");
            return;
        }
        if (this.state.selectedKeys.length === 0) {
            alert("Please Select Item(s) first");
            return;
        }
        console.log("Selected Keys", this.state.selectedKeys);
        let x = this.state.selectedKeys.map(k => {
            let row = this.state.rows.find((r) => { return r.id === k });
            return row.atcorId;
        })
        //TODO: KAI NA TSEKAREI TO id na min einai -  : I kai oxi
        if (x.includes(0)) {
            alert("Please Save InvoiceItems Before Assigning To Task\n\n\n")
            return;
        }
        let taskRelatedArray = this.state.rows.map(r => r.task_related);
        if (!taskRelatedArray.includes("")) {
            alert("All Items Are Already Assigned")
            return;
        }

        // ApiTasks.createTaskItems(taskId, x)//this.state.selectedKeys
        //     .then((result) => {
        let create;
        if (this.props.mode === "InvoiceItems") {
            // let filtered = this.state.rows.filter( r => {
            //     if (r.id < 0) {
            //         return true;
            //     }
            //     return false;
            // })
            let filtered = this.state.rows.map(r => {
                if (r.id < 0) {
                    return true;
                }
                return false;
            })
            if (filtered.includes(true)) {
                alert("Please Save InvoiceItems Before Assigning To Task 2")
                return;
            }
            create = ApiTasks.createTaskItems(taskId, x, this.props.selectedInvoiceId, taskName); //this.state.selectedKeys
        } else {
            create = ApiTasks.createTaskItems(taskId, x); //this.state.selectedKeys
        }
        create.then((result) => {
            // console.log(result);
            let output = result.msg + '\n';
            if (result.err) {
                result.data.map(e => { output = output + '\n' + e.item.name })
            }
            output = output + "\n\n\n"
            alert(output);
            this.state.selectedKeys.map(k => {
                let row = this.state.rows.find((r) => { return r.id === k });

                row.task_related = taskName;
                return row;
            })
            this.setState({ selectedKeys: [] })
        });
    }

    _getTasks = async () => {
        let results = await ApiTasks.getTasks(false);
        if (results.err) {
            return;
        }
        let tasks = results.tasks;
        // console.log("TASKS", tasks)
        this.setState({ tasks: tasks });
    }

    germanos = async () => {
        console.log();
    }

    render() {
        return (
            <div>
                {/* <div className="container-fluid" style={{ backgroundColor: 'grey', maxHeight: '700px' }}>
                <div className='row'>
                    <div id="parentDivOfGrid" className='col-lg-9'> */}
                <ReactDataGrid
                    ref={node => this.grid = node}

                    isCellValueChanging={this.isCellValueChanging}

                    onRowDoubleClick={this.onRowDoubleClick}

                    onRowClick={this.onRowClick}
                    onGridSort={this.handleGridSort}
                    enableCellSelect={this.props.enableCellSelect}
                    columns={this._columns}
                    rowGetter={this.rowGetter}
                    rowsCount={this.getSize()}
                    minHeight={300}
                    onGridRowsUpdated={this.handleGridRowsUpdated}
                    toolbar={
                        <MyToolbar
                            mode={this.props.mode}
                            of={this.props.of}
                            assignItemsToTask={this.assignItemsToTask}
                            tasks={this.state.tasks}
                            selectedTask={this.state.selectedTask}
                            selectTask={this.selectTask}
                            enableFilter
                            onAddRow={this.handleAddRow}
                            deleteInvoice={() => this.props.deleteInvoice(this.state.selectedKeys)}
                            createInvoiceItems={() => this.props.createInvoiceItems(this.state.rows)}
                            //deleteItem={() => this.props.deleteItem(this.state.selectedKeys)}
                            deleteInvoiceItem={() => this.props.deleteInvoiceItem(this.state.selectedKeys)}
                        />
                    }
                    // onCellSelected={this.onCellSelected}
                    // onBeforeEdit
                    // onCheckCellIsEditable
                    onFilter={this.onFilter}
                    onAddFilter={this.handleFilterChange}
                    onClearFilters={this.onClearFilters}
                    getValidFilterValues={columnKey => this.getValidFilterValues(this.state.rows, columnKey)}
                    // getCelldefaultActions={this.getCellActions}
                    rowKey="id"

                    rowSelection={{
                        showCheckbox: this.props.enableCellSelect,
                        // enableShiftSelect: true, //Will be fixed in the future
                        onRowsSelected: this.onRowsSelected,
                        onRowsDeselected: this.onRowsDeselected,
                        selectBy: {
                            keys: {
                                rowKey: "id",
                                values: this.state.selectedKeys
                            }
                        }
                    }}
                />
            </div>
        );
    }
}


class MyToolbar extends Toolbar {
    selectTask(e) {
        if (this.props.selectTask !== null && this.props.selectTask instanceof Function) {
            this.props.selectTask(e);
        }
    }
    assignItemsToTask(e) {
        if (this.props.assignItemsToTask !== null && this.props.assignItemsToTask instanceof Function) {
            this.props.assignItemsToTask(e);
        }
    }
    createInvoiceItems(e) {
        if (this.props.createInvoiceItems !== null && this.props.createInvoiceItems instanceof Function) {
            this.props.createInvoiceItems(e);
        }
    }
    deleteInvoice(e) {
        if (this.props.deleteInvoice !== null && this.props.deleteInvoice instanceof Function) {
            this.props.deleteInvoice(e);
        }
    }
    deleteInvoiceItem(e) {
        if (this.props.deleteInvoiceItem !== null && this.props.deleteInvoiceItem instanceof Function) {
            this.props.deleteInvoiceItem(e);
        }
    }
    renderSelectTask() {
        if (this.props.selectTask) {
            return (
                <select className="btn" style={{ color: "inherit" }}
                    onChange={(e) => this.props.selectTask(e)}
                >
                    <option defaultChecked value={"-1:default"}>Select Task</option>
                    {this.props.tasks.map((task) => <option value={task.id + ":" + task.taskName} >{task.taskName}</option>)}
                </select>
            );
        }
    }

    renderAssignItemsToTask() {

        if (this.props.assignItemsToTask) {
            return (
                <button onClick={this.props.assignItemsToTask} className="btn" style={{ color: "inherit" }}>Assign To Task</button>
            );
        }
    }

    renderCreateInvoiceItems() {
        if (this.props.createInvoiceItems) {
            return (
                <button
                    className="btn btn-success"
                    style={{ marginLeft: '5px', marginRight: '5px', backgroundColor: "green", color: "white" }}
                    onClick={this.props.createInvoiceItems}> Save Invoice Items </button>
            );
        }
    }
    renderDeleteInvoice() {
        if (this.props.deleteInvoice) {
            return (
                <button
                    className="btn btn-danger"
                    style={{ marginLeft: '5px', marginRight: '5px', backgroundColor: "red", color: "white" }}
                    onClick={this.props.deleteInvoice}> Delete Invoice </button>
            );
        }
    }
    renderDeleteInvoiceItem() {
        if (this.props.deleteInvoiceItem) {
            return (
                <button
                className="btn btn-danger"
                style={{ marginLeft: '5px', marginRight: '5px', backgroundColor: "red", color: "white" }}
                onClick={this.props.deleteInvoiceItem}> Delete InvoiceItem </button>
            );
        }
    }
    //     <button
    //     className="btn btn-success"
    //     style={{ marginLeft: '15px', marginRight: '15px' }}
    //     onClick={this.createInvoiceItems}> Save Invoice Items
    //  </button>
    render() {
        if (this.props.mode === "Invoices") {
            return (
                <div className="react-grid-Toolbar" style={{ backgroundColor: '#37474F' }}>
                    <div className="tools" style={{ marginBottom: '5px', float: "left" }}>
                        <span style={{ marginRight: '5px', color: '#e6e6e6' }}>{this.props.mode}</span>
                        <span style={{ marginRight: '5px' }} >{this.renderToggleFilterButton()} </span>
                        {this.renderAddRowButton()}
                        <span >{this.renderDeleteInvoice()} </span>
                    </div>
                </div>
            );
        }
        if (this.props.mode === "InvoiceItems") {
            return (
                <div className="react-grid-Toolbar" style={{ backgroundColor: '#37474F' }}>
                    <div className="tools" style={{ marginBottom: '5px', float: "left" }}>
                        <span style={{ marginRight: '5px', color: '#e6e6e6' }}>{this.props.mode}</span>
                        {(this.props.of !== "") ?
                            <span style={{ marginRight: '5px', color: '#ff6666' }}>For Invoice: {this.props.of}</span>
                            : ""}
                        <span style={{ marginRight: '5px' }} >{this.renderSelectTask()}</span>
                        <span style={{ marginRight: '5px' }} >{this.renderAssignItemsToTask()}</span>
                        {/* <span style={{ marginRight: '5px' }} >{this.renderToggleFilterButton()} </span> */}
                        {this.renderAddRowButton()}
                        {this.renderCreateInvoiceItems()}
                        {this.renderDeleteInvoiceItem()}
                    </div>
                </div>
            );
        }
        if (this.props.mode === "ItemInvoices") {
            return (
                
                <div className="react-grid-Toolbar" style={{ backgroundColor: '#37474F' }}>
                    <div className="tools" style={{ marginBottom: '5px', float: "left" }}>
                        <span style={{ marginRight: '5px', color: '#e6e6e6' }}>{this.props.mode}</span>
                        {(this.props.of !== "") ?
                            <span style={{ marginRight: '5px', color: '#ff6666' }}>For AtcorId: {this.props.of}</span>
                            : ""}
                        <span style={{ marginRight: '5px' }} >{this.renderToggleFilterButton()} </span>
                        {/* {this.renderAddRowButton()} */}
                    </div>
                </div>
            );
        }
        if (this.props.mode === "Tasks") {
            return (
                <div className="react-grid-Toolbar" style={{ backgroundColor: '#37474F' }}>
                    <div className="tools" style={{ marginBottom: '5px', float: "left" }}>
                        <span style={{ marginRight: '5px', color: '#e6e6e6' }}>{this.props.mode}</span>
                        {/* {(this.props.of !== "") ?
                            <span style={{ marginRight: '5px', color: '#ff6666' }}>For AtcorId: {this.props.of}</span>
                            : ""} */}
                        <span style={{ marginRight: '5px' }} >{this.renderToggleFilterButton()} </span>
                        {this.renderAddRowButton()}
                    </div>
                </div>
            );
        }
        if (this.props.mode === "TaskItems") {
            return (
                <div className="react-grid-Toolbar" style={{ backgroundColor: '#37474F' }}>
                    <div className="tools" style={{ marginBottom: '5px', float: "left" }}>
                        <span style={{ marginRight: '5px', color: '#e6e6e6' }}>{this.props.mode}</span>
                        {(this.props.of !== "") ?
                            <span style={{ marginRight: '5px', color: '#ff6666' }}> For Task: {this.props.of}</span>
                            : ""}
                        <span style={{ marginRight: '5px' }} >{this.renderToggleFilterButton()} </span>
                        {/* {this.renderAddRowButton()} */}
                    </div>
                </div>
            );
        }
        if (this.props.mode === "ItemMovements") {
            return (
                <div className="react-grid-Toolbar" style={{ backgroundColor: '#37474F' }}>
                    <div className="tools" style={{ marginBottom: '5px', float: "left" }}>
                        <span style={{ marginRight: '5px', color: '#e6e6e6' }}>{this.props.mode}</span>
                        {(this.props.of !== "") ?
                            <span style={{ marginRight: '5px', color: '#ff6666' }}>For AtcorId: {this.props.of}</span>
                            : ""}
                        <span style={{ marginRight: '5px' }} >{this.renderToggleFilterButton()} </span>
                        {/* {this.renderAddRowButton()} */}
                    </div>
                </div>
            );
        }
    }
}


class NameFormatter extends React.Component {

    //Here for styling logic. 
    calculateStyle = () => {
        let value = this.props.row.nsn;
        let style = {};
        // style = { backgroundColor: "" }
        if (value === '') { //Vres to keno
            console.log("value", value);
            style = { backgroundColor: "red", color: "white" };
            return { style: style, colour: true };
        } else {
            console.log("value", value);
            style = { backgroundColor: "green", color: "white" };
            return { style: style, colour: true };
        }
        // return { style: style, colour: false };
    }
    render() {
        // console.log("Formatter", this.props);
        if (this.props.row.nsn === "") {
            const style = this.calculateStyle();
            return (
                <div style={style.style}>{style.colour ? "EDIT PLEASE" : this.props.value}</div>
            );
        } else {
            return (
                <div> {this.props.value} </div>
            );
        }

    }
}

