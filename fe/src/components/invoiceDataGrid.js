import React from 'react';
import ReactDataGrid from 'react-data-grid';
import update from 'immutability-helper';
import { Toolbar, Data, Filters } from "react-data-grid-addons";

const Selectors = Data.Selectors;
const {
    NumericFilter,
    AutoCompleteFilter,
    SingleSelectFilter
} = Filters;

const notEditable = ["id", "totalStock"];
const isEditable = ["invoice", "name", "nsn", "category", "material", "measurement", "VAT", "location", "dexion"];
const filterNormal = ["nsn", "id"];
const filterNumeric = ["totalStock"];
const filterAutoComplete = ["invoice","name"];
const filterSingleSelect = ["measurement", "category"];
const isFormattable = ["nsn"];

export default class InvoiceDataGrid extends React.Component {
    constructor(props) {
        super(props);
        this._columns = [];
        this.state = {
            rows: [],
            filters: [],
            selectedId: 0,
            images: [],
            selectedKeys: [],
            tasks: [],
            selectedTask: 0,
            mode: "",
            cellUpdateCss: "red"
        };
    }

    async componentDidMount() {
        let mode = this.props.mode;
        this.setState({ mode: mode }, async () => {
            if (this.state.mode === "invoices") {
                // await this._getItems();
                // await this._getTasks();
                this._setColumns();
                // console.log("AAA", this._columns)
                this.setState({ rows: this.props.data })

            }
        });

    };

    componentDidUpdate(nextProps) {
        if (this.props.data !== nextProps.data) {
            this._setColumns()
            console.log("AAA", this._columns)
            this.setState({ rows: this.props.data })
        }
    }

    isRowEditable = (row) => {
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
        if (data.length > 1) {
            let tempColumns = Object.keys(data[0]);
            let columns = tempColumns.map((x) => {
                let y = {
                    key: x,
                    name: x,
                    resizable: true,
                    visible: true
                    // editable: true
                };
                if (y.name === 'id') {
                    y.visible = false;
                } 
                if (isEditable.find((i) => { return i === x })) {
                    y.editable = this.isRowEditable;

                }

                if (notEditable.find((i) => { return i === x })) {
                    y.sortable = false;
                    y.editable = false;

                    // y.width = 400;
                }

                if (filterAutoComplete.find((i) => { return i === x })) { //Logic to make columns not <something>
                    y.filterRenderer = AutoCompleteFilter;
                    y.filterable = true;
                    y.sortable = true;

                }
                if (filterSingleSelect.find((i) => { return i === x })) {
                    y.filterRenderer = SingleSelectFilter;
                    y.filterable = true;
                    y.sortable = true;

                }
                if (filterNumeric.find((i) => { return i === x })) { //Logic to make columns not <something>
                    y.filterRenderer = NumericFilter;
                    y.filterable = true;
                    y.sortable = true;
                }
                if (filterNormal.find((i) => { return i === x })) {
                    y.filterable = true;
                    y.sortable = true;

                }
                if (isFormattable.find((i) => { return i === x })) {
                    y.formatter = NameFormatter;
                }
                return y;
            });
            // this._columns = columns;
            //Hide cols
            const cols = columns.filter(column => column.visible === true)
            this._columns = cols;
        }
    }

    onRowClick = (row) => {
        if (row === -1) {
            return;
        }
        if (this.props.mode === "invoices") {
            let rows = this.getRows();
            if (this.props.selectedRow !== rows[row].id) {
                this.props.setSelectedRow(rows[row].id);
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

        const newFilters = { ...this.state.filters };
        console.log("FF", newFilters)
        if (filter.filterTerm) {
            console.log("Filter Changee");
            newFilters[filter.column.key] = filter;
            console.log("newFilters", newFilters)
        } else {
            delete newFilters[filter.column.key];
        }
        this.setState({ filters: newFilters, selectedKeys: [] }, () => {
            console.log("AfterHandleFilter RowsSelect", this.state.selectedKeys)
        });
    };

    onClearFilters = () => {
        this.setState({ filters: {}, selectedKeys: [] }, () => {
            console.log("AfterClearFilter RowsSelect", this.state.selectedKeys)
        });
    };

    ////////////EDITABLE + ADD ROW//////////////////
    // handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    //     if (fromRow !== toRow) {
    //         return;
    //     }
    //     let tmpRows = [...this.getRows()];
    //     let rows = [...this.state.rows];

    //     ApiItems.updateItem(tmpRows[fromRow].id, updated)
    //         .then((response) => {
    //             console.log(response);
    //             if (response.err) {
    //                 alert(response.msg);
    //                 return;
    //             }
    //             let updatedRows = [];
    //             for (let i = fromRow; i <= toRow; i++) {
    //                 // await ApiItems.updateItem( tmpRows[i].id ,updated);
    //                 const rowToUpdate = tmpRows[i];
    //                 const updatedRow = update(rowToUpdate, { $merge: updated });
    //                 tmpRows[i] = updatedRow;
    //                 updatedRows.push(tmpRows[i]);
    //             }
    //             if (tmpRows !== this.state.rows) {
    //                 console.log("tmpRows", tmpRows);
    //                 console.log("rowsBefore", this.state.rows);
    //                 updatedRows.map((uRow) => {
    //                     let index = rows.findIndex((r) => r.id === uRow.id);
    //                     if (index !== -1) {
    //                         rows[index] = uRow;
    //                     }
    //                 })
    //                 console.log("UpdatedRows", updatedRows);
    //             }

    //             this.setState({ rows: rows });
    //         });
    // };

    handleAddRow = () => {
        let currentdate = new Date();
        let invoiceTempValue = ""  
            + currentdate.getFullYear() + "-"
            + (currentdate.getMonth() + 1) + "-"
            + currentdate.getDate() + "T"
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds() + "Z"; 
        const newRow = {
            // id: newDbItem.id,
            invoice: invoiceTempValue,
            PN: "",
            remark: "",
            atcorPN: "",
            matInDate: invoiceTempValue,
            supplier: ""
        };
        console.log("newRow", newRow);
        //** API createInvoice Here */
        // ApiItems.createItem(newRow)
        //     .then((newDbItem) => {
        //         if (newDbItem.err) {
        //             alert(newDbItem.err);
        //             alert("Solution: Filter Items and find an entry with NSN = '<space>' and Update NSN value");
        //             return;
        //         }
        //         // alert("Inserted Successfully new Item", newDbItem.id);
                newRow.id = 4;
                let rows = this.state.rows.slice();
                rows = update(rows, { $unshift: [newRow] });

                let selectedKeys = [...this.state.selectedKeys]
                selectedKeys.push(newRow.id);

                this.setState({ rows, selectedKeys }, () => console.log(this.state.selectedKeys));
        //     });
    };


    getValidFilterValues(rows, columnId) {
        console.log(rows);
        return rows
            .map(r => r[columnId])
            .filter((item, i, a) => {
                console.log(a.indexOf(item));
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
            console.log("DeSelect", this.state.selectedKeys)
        });
    };
    render() {
        return (
            <div className="container-fluid" style={{ backgroundColor: 'grey', maxHeight: '700px' }}>
                <div className='row'>
                    <div id="parentDivOfGrid" className='col-lg-9'>
                        <ReactDataGrid 
                            ref={node => this.grid = node}
                            onRowClick={this.onRowClick}
                            onGridSort={this.handleGridSort}
                            enableCellSelect
                            columns={this._columns}
                            rowGetter={this.rowGetter}
                            rowsCount={this.getSize()}
                            minHeight={200}
                            // minWidth={1000}
                            onGridRowsUpdated={this.handleGridRowsUpdated}
                            // toolbar={<Toolbar poutsa={<button>Poutsa</button>} enableFilter onAddRow={this.handleAddRow}></Toolbar>}
                            toolbar={<InvoiceToolbar
                                assignItemsToTask={this.assignItemsToTask}
                                tasks={this.state.tasks}
                                selectedTask={this.state.selectedTask}
                                selectTask={this.selectTask}
                                enableFilter

                                // onToggleFilter={this.onFilter}
                                onAddRow={this.handleAddRow}

                            />}
                            // onBeforeEdit
                            // onCheckCellIsEditable
                            onFilter={this.onFilter}
                            onAddFilter={this.handleFilterChange}
                            onClearFilters={this.onClearFilters}
                            getValidFilterValues={columnKey => this.getValidFilterValues(this.state.rows, columnKey)}
                            // getCelldefaultActions={this.getCellActions}
                            rowKey="id"

                            rowSelection={{
                                showCheckbox: true,
                                // enableShiftSelect: true,
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
                </div>
            </div >
        );
    }
}


class InvoiceToolbar extends Toolbar {
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
    renderSelectTask() {
        if (this.props.selectTask) {
            return (
                <select className="btn" style={{ color: "inherit" }}
                    onChange={(e) => this.props.selectTask(e)}
                >
                    <option defaultChecked value={0}>Select Task</option>
                    {this.props.tasks.map((task) => <option key={task.id} value={task.id}>{task.taskName}</option>)}
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
    render() {
        return (
            <div className="react-grid-Toolbar" style={{ backgroundColor: 'light-black' }}>
                <div className="tools" style={{ marginBottom: '15px' }}>
                    <span style={{ marginRight: '5px' }} >{this.renderSelectTask()}</span>
                    <span style={{ marginRight: '5px' }} >{this.renderAssignItemsToTask()}</span>
                    <span style={{ marginRight: '5px' }} >{this.renderToggleFilterButton()} </span>
                    {this.renderAddRowButton()}
                </div>
            </div>
        );
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
            style = { borderColor: "red", backgroundColor: "red", color: "white" };
            return { style: style, colour: true };
        }
        return { style: style, colour: false };
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