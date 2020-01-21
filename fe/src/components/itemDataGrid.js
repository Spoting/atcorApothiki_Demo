import React from 'react';
import ReactDataGrid from 'react-data-grid';
import update from 'immutability-helper';
import { Toolbar, Data, Filters, Editors } from "react-data-grid-addons";

const {
    DropDownEditor
} = Editors;

const Selectors = Data.Selectors;

const ApiItems = require("../util/api").default.ApiItems;
const ApiTasks = require("../util/api").default.ApiTasks;

const {
    NumericFilter,
    AutoCompleteFilter,
    SingleSelectFilter,
    MultiSelectFilter
} = Filters;


const notEditable = ["atcorId", "totalStock"];
const isEditable = ["oldAtcorNo", "name", "nsn", "category", "characteristic_1", "characteristic_2", "PN", "atcorPN", "unit", "location", "dexion", "dexion2"];
const filterNormal = ["nsn", "atcorNo", "name", "PN", "atcorPN", "category", "characteristic_1", "characteristic_2", "oldAtcorNo", "dexion", "dexion2" , "location"];
const filterNumeric = ["totalStock"];
const filterAutoComplete = [];
const filterSingleSelect = ["unit"];
const filterMultiSelect = [];
const editorDropDown = ["unit"];
const titles = [
    { atcorNo: "", title: "AtcorNo" },
    { totalStock: "" , title: "TotalStock" },
    { name: "", title: "Description" },
    { PN: "", title: "PN" },
    { atcorPN: "", title: "AtcorPN" },
    { nsn: "", title: "NSN"},
    { characteristic_1: "", title: "C1" },
    { characteristic_2: "", title: "C2" },
    { category: "", title: "Category" },
    { unit: "", title: "Unit" },
    { location: "", title: "Location" },
    { dexion: "", title: "DEX1" },
    { dexion2: "", title: "DEX2"},
    { oldAtcorNo: "", title: "OldAtcorNo" },
]
// const isFormattable = ["nsn"];

const unitOptions = [
    { id: "KG", value: "KG" },
    { id: "TEM", value: "TEM" },
    { id: "LT", value: "LT" }
]


/**
 * For BUG: crash when column have a cell with null value
 *    https://github.com/adazzle/react-data-grid/issues/1129
 * This only happens when using Filters from Addons. Normal Filter works fine
 */

// Usage
// https://github.com/adazzle/react-data-grid/tree/next/examples/scripts
export default class ItemsDataGrid extends React.Component {
    constructor(props) {
        super(props);
        this._columns = [];
        this.state = {
            rows: [],
            filters: [],
            // selectedAtcorId: 0,
            images: [],
            selectedKeys: [],
            tasks: [],
            selectedTask: 0,
            mode: "",
            // cellUpdateCss: "red"
        };
    }

    async componentDidMount() {
        if (this.props.mode === "Items") {
            // await this._getItems();
            // await this._getTasks();
            this._setColumns();
            await this._getTasks();
            // console.log("AAA", this._columns)
            this.setState({ rows: this.props.data })
        }
    };

    async componentDidUpdate(nextProps) {

        if (this.props.data !== nextProps.data) {
            this._setColumns();
            console.log("AAA", this.props.data)
            this.setState({ rows: this.props.data })
        }
        //Get tasks when mode ===items
        if (this.props.mode !== nextProps.mode) {
            if (this.props.mode === "Items") {
                await this._getTasks();
            }
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
                titles.find(t => {
                    let keys = Object.keys(t);
                    if (keys[0] === y.key) {
                        console.log("Kati ginete")
                        console.log("title", t.title)
                        y.name = t.title;
                    }
                })
                if (y.key === 'atcorId') {
                    y.visible = false;
                }
                if (y.key === 'name') {
                    y.width = 150;
                }
                if (isEditable.find((i) => { return i === x })) {
                    y.editable = this.isRowEditable;
                }

                if (notEditable.find((i) => { return i === x })) {
                    y.sortable = false;
                    y.editable = false;
                    // y.width = 400;
                }
                if (filterMultiSelect.find((i) => { return i === x })) {
                    y.filterRenderer = MultiSelectFilter;
                    y.filterable = true;
                    y.sortable = true;
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
                if (editorDropDown.find((i) => { return i === x })) {
                    if (y.key === "unit") {
                        y.editor = <DropDownEditor options={unitOptions} />;
                    }
                    // y.editor = EditorDropDown;  
                }
                // if (isFormattable.find((i) => { return i === x })) {
                //     y.formatter = NsnFormatter;
                // }
                return y;
            });
            const cols = columns.filter(column => column.visible === true)
            this._columns = cols;
            // console.log(isEditable)
            // console.log("Columns", this._columns);
        }
    }

    isRowEditable = (row) => {
        if (row) {
            let found = this.state.selectedKeys.find(i => { return i === row.atcorId });
            let isEditable = false;
            if (found) {
                isEditable = true;
            }
            return isEditable;
        }
    }
    onRowClick = (row) => {
        if (row === -1) {
            return;
        }
        if (this.props.mode === "Items") {
            let rows = this.getRows();
            // console.log("PANAGIES", rows[row].atcorId)
            if (this.props.selectedRow !== rows[row].atcorId) {
                this.props.setSelectedRow(rows[row].atcorId);
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
        if (filter.length < 3) {
            return;
        }
        const newFilters = { ...this.state.filters };
        if (filter.filterTerm) {
            newFilters[filter.column.key] = filter;
        } else {
            delete newFilters[filter.column.key];
        }
        //TODO: Add This to invoiceDataGrid!!!!!
        this.setState({ filters: newFilters, selectedKeys: [] }, () => {
            // console.log("AfterHandleFilter RowsSelect", this.state.selectedKeys)
        });
    };

    onClearFilters = () => {
        this.setState({ filters: {}, selectedKeys: [] }, () => {
            // console.log("AfterClearFilter RowsSelect", this.state.selectedKeys)
        });
    };

    ////////////EDITABLE + ADD ROW//////////////////
    handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        if (fromRow !== toRow) {
            return;
        }
        let tmpRows = [...this.getRows()];
        let rows = [...this.state.rows];

        ApiItems.updateItem(tmpRows[fromRow].atcorId, updated)
            .then((response) => {
                // console.log(response);
                if (response.err) {
                    alert(response.msg);
                    return;
                }
                let updatedRows = [];
                for (let i = fromRow; i <= toRow; i++) {
                    // await ApiItems.updateItem( tmpRows[i].atcorId ,updated);
                    const rowToUpdate = tmpRows[i];
                    const updatedRow = update(rowToUpdate, { $merge: updated });
                    tmpRows[i] = updatedRow;
                    updatedRows.push(tmpRows[i]);
                }
                if (tmpRows !== this.state.rows) {
                    // console.log("tmpRows", tmpRows);
                    // console.log("rowsBefore", this.state.rows);
                    updatedRows.map((uRow) => {
                        let index = rows.findIndex((r) => r.atcorId === uRow.atcorId);
                        if (index !== -1) {
                            rows[index] = uRow;
                        }
                    })
                    // console.log("UpdatedRows", updatedRows);
                }

                this.setState({ rows: rows });
            });
    };

    handleAddRow = () => {

        // let currentdate = new Date();
        // let fullDate = "T" + "#"
        //     + currentdate.getFullYear() + "/"
        //     + (currentdate.getMonth() + 1) + "/"
        //     + currentdate.getDate() + "::"
        //     + currentdate.getHours() + "/"
        //     + currentdate.getMinutes() + "/"
        //     + currentdate.getSeconds();
        // let random = Math.floor(Math.random() * 10);
        // let nsnTempValue = "change/"
        // + currentdate.getSeconds();
        const newRow = {
            // atcorId: newDbItem.atcorId,
            totalStock: 0,
            name: "",
            category: "-",
            characteristic_1: "-",
            characteristic_2: "-",
            unit: "-",
            location: "",
            dexion: "",
            dexion2: "",
            // nsn: nsnTempValue, //+""+random.toString(),
            // atcorPn: ....
            atcorNo: "",
            PN: "",
        };
        ApiItems.createItem(newRow)
            .then((newDbItem) => {
                // console.log("New", newDbItem);
                if (newDbItem.err) {
                    alert(newDbItem.err);
                    // alert("Solution: Filter Items and find an entry with NSN = '<space>' and Update NSN value");
                    return;
                }
                console.log("AAAAAAAAAAAA", newDbItem.atcorNo)
                newRow.atcorId = newDbItem.atcorId;
                newRow.atcorNo = newDbItem.atcorNo;

                let rows = this.state.rows.slice();
                rows = update(rows, { $unshift: [newRow] });

                let selectedKeys = [...this.state.selectedKeys]
                selectedKeys.push(newRow.atcorId);

                this.setState({ rows, selectedKeys }, () => console.log(this.state.selectedKeys));
            });
    };

    //TODO: LOUSIMO STO FILTER TOU ATCORID
    getValidFilterValues(rows, columnId) {
        // console.log(columnId)
        if (columnId === 'atcorId') {
            return rows.map((i) => { return i[columnId].toString() })
        }
        return rows
            .map(r => r[columnId])
            .filter((item, i, a) => {
                return i === a.indexOf(item);
            });
    }
    onRowsSelected = (rows) => {
        // console.log("Select:Rows", rows);
        this.setState({ selectedKeys: this.state.selectedKeys.concat(rows.map(r => r.row.atcorId)) }, () => {
            console.log("Select", this.state.selectedKeys)
        });

    };

    onRowsDeselected = (rows) => {
        // console.log("DeSelect:Rows", rows);
        const rowKeys = rows.map(r => r.row.atcorId);
        this.setState({ selectedKeys: this.state.selectedKeys.filter(i => rowKeys.indexOf(i) === -1) }, () => {
            // console.log("DeSelect", this.state.selectedKeys)
        });
    };


    _getTasks = async () => {
        let results = await ApiTasks.getTasks();
        if (results.err) {
            return;
        }
        let tasks = results.tasks;
        tasks.map((t) => console.log(t));
        this.setState({ tasks: tasks });
    }

    selectTask = (e) => {
        this.setState({ selectedTask: e.target.value });
    }

    assignItemsToTask = () => {
        if (this.state.selectedTask === 0) {
            alert("Please Select a Task first");
            return
        }
        if (this.state.selectedKeys.length === 0) {
            alert("Please Select Item(s) first");
            return
        }
        // console.log("Selected Keys", this.state.selectedKeys);
        ApiTasks.createTaskItems(this.state.selectedTask, this.state.selectedKeys)
            .then((result) => {
                console.log(result);
                let output = result.msg + '\n';
                if (result.err) {
                    result.data.map(e => { output = output + '\n' + e.item.name })
                }
                output = output + "\n\n"
                alert(output);
            });
    }

    // onCellSelected = ({ rowIdx, idx }) => {
    //     console.log("MAM", rowIdx, idx);
    //     let x = this.rowGetter(rowIdx)
    //     console.log("MAM",x)
    //   };

    //   onCellDeSelected = ({ rowIdx, idx }) => {
    //     // if (idx === 2) {
    //     //   alert('the editor for cell (' + rowIdx + ',' + idx + ') should have just closed');
    //     // }
    //     // console.log("MAM",this.state.rows[rowIdx].idx);
    //     // if (this.state.rows[rowIdx].idx)
    //   };

    render() {
        return (

            <div>
                <ReactDataGrid
                    ref={node => this.grid = node}
                    onRowClick={this.onRowClick}
                    onGridSort={this.handleGridSort}
                    enableCellSelect
                    // onCellSelected={this.onCellSelected}
                    // onCellDeSelected={this.onCellDeSelected}
                    columns={this._columns}
                    rowGetter={this.rowGetter}
                    rowsCount={this.getSize()}
                    minHeight={300}
                    // minWidth={1000}
                    onGridRowsUpdated={this.handleGridRowsUpdated}
                    // toolbar={<Toolbar poutsa={<button>Poutsa</button>} enableFilter onAddRow={this.handleAddRow}></Toolbar>}
                    toolbar={<ItemToolbar
                        assignItemsToTask={this.assignItemsToTask}
                        tasks={this.state.tasks}
                        selectedTask={this.state.selectedTask}
                        selectTask={this.selectTask}
                        enableFilter
                        onAddRow={this.handleAddRow}
                        mode={this.props.mode}
                        of={this.props.of}
                        deleteItem={() => this.props.deleteItem(this.state.selectedKeys)}
                    />}
                    // onBeforeEdit
                    // onCheckCellIsEditable
                    onFilter={this.onFilter}
                    onAddFilter={this.handleFilterChange}
                    onClearFilters={this.onClearFilters}
                    getValidFilterValues={columnKey => this.getValidFilterValues(this.state.rows, columnKey)}
                    // getCelldefaultActions={this.getCellActions}
                    rowKey="atcorId"

                    rowSelection={{
                        showCheckbox: true,
                        // enableShiftSelect: true,
                        onRowsSelected: this.onRowsSelected,
                        onRowsDeselected: this.onRowsDeselected,
                        selectBy: {
                            keys: {
                                rowKey: "atcorId",
                                values: this.state.selectedKeys
                            }
                        }
                    }}
                />
            </div>

        );
    }
}


class ItemToolbar extends Toolbar {
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
    deleteItem(e) {
        if (this.props.deleteItem !== null && this.props.deleteItem instanceof Function) {
            this.props.deleteItem(e);
        }
    }
    renderDeleteItem() {
        if (this.props.deleteItem) {
            return (
                <button
                    className="btn btn-danger"
                    style={{ marginLeft: '5px', marginRight: '5px', backgroundColor: "red", color: "white" }}
                    onClick={this.props.deleteItem}> Delete Item </button>
            );
        }
    }
    renderSelectTask() {
        if (this.props.selectTask) {
            return (
                <select className="btn" style={{ color: "inherit" }}
                    onChange={(e) => this.props.selectTask(e)}
                >
                    <option defaultChecked value={0}>Select Task</option>
                    {this.props.tasks.map((task) => <option value={task.id}>{task.taskName}</option>)}
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
            <div className="react-grid-Toolbar" style={{ backgroundColor: '#37474F' }}>
                <div className="tools" style={{ marginBottom: '5px', float: "left" }}>
                    <span style={{ marginRight: '5px', color: '#e6e6e6' }}>{this.props.mode}</span>
                    {(this.props.of !== "") ?
                        <span style={{ marginRight: '5px', color: '#ff6666' }}>For Item: {this.props.of}</span>
                        : ""}
                    <span style={{ marginRight: '5px' }} >{this.renderSelectTask()}</span>
                    <span style={{ marginRight: '5px' }} >{this.renderAssignItemsToTask()}</span>
                    <span style={{ marginRight: '5px' }} >{this.renderToggleFilterButton()} </span>
                    {this.renderAddRowButton()} 
                    <span style={{ marginRight: '5px' }} >{this.renderDeleteItem()} </span>
                </div>
            </div>
        );
    }
}



// class IntegerEditor extends React.Component {
//     constructor(props) {
//       super(props);
//       this.state = { value: props.value };
//     }

//     getValue() {
//       return { value: this.state.value };
//     }

//     getInputNode() {
//       return ReactDOM.findDOMNode(this).getElementsByTagName("input")[0];
//     }

//     handleChangeComplete = color => {
//       this.setState({ color: color.hex }, () => this.props.onCommit());
//     };
//     render() {
//       return (
//         <Interger
//           color={this.state.color}
//           onChange={this.handleChangeComplete}
//         />
//       );
//     }
//   }

class NsnFormatter extends React.Component {

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

    // onRowClick = (row) => {
    //     if (row === -1) {
    //         return;
    //     }
    //     if (this.props.mode === "invoices") {
    //         let rows = this.getRows();
    //         if (this.state.selectedId !== rows[row].id) {
    //             ApiItems.getImages(rows[row].id).then((res) => {
    //                 let sources = res.data.map((i) => {
    //                     let img = {};
    //                     img.src = 'http://localhost:8000/static/' + i;
    //                     img.width = 100;
    //                     img.height = 100;

    //                     return img;
    //                 });
    //                 // console.log("Srcs", sources);
    //                 this.setState({ images: sources, selectedAtcorId: rows[row].id })
    //             }).catch((err) => console.log(err));
    //         }
    //     }
    // }