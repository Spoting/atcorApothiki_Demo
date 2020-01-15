import React from 'react';
import ReactDataGrid from 'react-data-grid';
import update from 'immutability-helper';

import Gallery from "react-photo-gallery";
import GalleryWrapper from './galleryWrapper';

import { Toolbar, Data, Filters } from "react-data-grid-addons";

const Selectors = Data.Selectors;
const {
    NumericFilter,
    AutoCompleteFilter,
    SingleSelectFilter
} = Filters;

const ApiItems = require("../util/api").ApiItems;
const ApiTasks = require("../util/api").ApiTasks;

const notEditable = ["atcorId", "totalStock"];
const isEditable = ["name", "nsn", "category", "material", "measurement", "VAT", "location", "dexion"];
const filterNormal = ["nsn", "atcorId"];
const filterNumeric = ["totalStock"];
const filterAutoComplete = ["name"];
const filterSingleSelect = ["measurement", "category"];

/**TODO List:
 * -Move Api Product Call here                      TODO: tick
 * -Make Search Bar                                 TODO: tick
 * -Filter through SearchBar                        TODO: tick
 * -BUG when trying to filter column with null cell TODO: {https://github.com/adazzle/react-data-grid/issues/1129}         
 * -Editable                                        TODO: tick
 * -Sorting                                         TODO: tick
 * -Make DB Update Call onCellUpdate                TODO: tick 
 * -rowActions                                      TODO: tick 
 * -Style the things                                TODO: KindaTick
 * -Refactor for Reusability                        TODO:
*/

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
        this._columns = []
        this.state = {
            rows: [],
            filters: [],
            selectedAtcorId: 0,
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
            if (this.state.mode === "items") {
                await this._getItems();
                await this._getTasks();
            }
        });

    };

    componentDidUpdate(nextProps) {
        // let mode = this.props.mode;
        // console.log("Prev Table mode", mode);
        // console.log("Next table mode", nextProps.mode);
        // if (mode !== nextProps.mode) {
        //     this.setState({});
        // }

    }

    _getTasks = async () => {
        let results = await ApiTasks.getTasks();
        if (results.err) {
            return;
        }
        let tasks = results.tasks;
        tasks.map((t) => console.log(t));
        this.setState({ tasks: tasks });
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

    _getItems = async () => {
        let results = await ApiItems.getItems();
        if (results.err) {
            return;
        }
        // this.setState({ items: results.items });
        // let items = [...this.state.items];
        let items = results.items;
        if (items.length > 1) {
            let tempColumns = Object.keys(items[0]);
            let columns = tempColumns.map((x) => {
                let y = {
                    key: x,
                    name: x,
                    resizable: true,

                    // editable: true
                };
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
                    y.formatter = NameFormatter;
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
                    y.formatter = NameFormatter;
                }
                return y;
            });
            this._columns = columns;
            // console.log(isEditable)
            // console.log("Columns", this._columns);
            this.setState({
                rows: items
            });
        }
    }

    onRowClick = (row) => {
        if (row === -1) {
            return;
        }
        if (this.props.mode === "items") {
            let rows = this.getRows();
            if (this.state.selectedAtcorId !== rows[row].atcorId) {
                ApiItems.getImages(rows[row].atcorId).then((res) => {
                    let sources = res.data.map((i) => {
                        let img = {};
                        img.src = 'http://localhost:8000/static/' + i;
                        img.width = 100;
                        img.height = 100;

                        return img;
                    });
                    // console.log("Srcs", sources);
                    this.setState({ images: sources, selectedAtcorId: rows[row].atcorId })
                }).catch((err) => console.log(err));
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

        // // let keys = [...this.state.selectedKeys];
        // let filterNameValues = [];
        // if (newFilters.name) {
        //     filterNameValues = newFilters.name.filterTerm;
        //     console.log(filterNameValues);
        // }
        // this.state.selectedKeys.map((k) => {
        //     let foundItem = this.state.rows.find((r) => k === r.atcorId);
        //     if (foundItem) {
        //         // filterNames = [...newFilters.name];
        //         let x = { value: foundItem.name, label: foundItem.name }
        //         filterNameValues.unshift(x);
        //     }
        //     // let atStart = this.state.rows[k];
        //     // console.log("aa", atStart)
        //     // newFilters.unshift(k);
        // });
        // console.log("filter", filterNameValues)
        // newFilters.name = filterNameValues;
        this.setState({ filters: newFilters });
    };

    onClearFilters = () => {
        this.setState({ filters: {}, selectedKeys: [] }, () => {
            console.log("AfterClearFilter RowsSelect", this.state.selectedKeys)
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
                console.log(response);
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
                    console.log("tmpRows", tmpRows);
                    console.log("rowsBefore", this.state.rows);
                    updatedRows.map((uRow) => {
                        let index = rows.findIndex((r) => r.atcorId === uRow.atcorId);
                        if (index !== -1) {
                            rows[index] = uRow;
                        }
                    })
                    console.log("UpdatedRows", updatedRows);
                }

                this.setState({ rows: rows }, () => {
                    console.log("Kala", this.state.rows[toRow].formatter)
                });
            });
    };

    handleAddRow = () => {
        // const isEditable = ["name", "nsn", "category", "material", "measurement", "VAT", "location", "dexion"];
        const newRow = {
            // atcorId: newDbItem.atcorId,
            totalStock: 0,
            name: "",
            category: "",
            material: "",
            measurement: 0,
            VAT: 0,
            location: "",
            dexion: "",
            nsn: ""
        };
        ApiItems.createItem(newRow)
            .then((newDbItem) => {
                // console.log("New", newDbItem);
                if (newDbItem.err) {
                    alert(newDbItem.err);
                    alert("Solution: Filter Items and find an entry with NSN = '<space>' and Update NSN value");
                    return;
                }
                // alert("Inserted Successfully new Item", newDbItem.atcorId);
                newRow.atcorId = newDbItem.atcorId;
                let rows = this.state.rows.slice();
                console.log("rows Before", rows);
                rows = update(rows, { $unshift: [newRow] });
                console.log("rows After", rows);
                let selectedKeys = [...this.state.selectedKeys]
                selectedKeys.push(newRow.atcorId);
                this.setState({ rows, selectedKeys }, () => console.log(this.state.selectedKeys));
            });
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
        this.setState({ selectedKeys: this.state.selectedKeys.concat(rows.map(r => r.row.atcorId)) }, () => {
            console.log("Select", this.state.selectedKeys)
        });

    };

    onRowsDeselected = (rows) => {
        // console.log("DeSelect:Rows", rows);
        const rowKeys = rows.map(r => r.row.atcorId);
        this.setState({ selectedKeys: this.state.selectedKeys.filter(i => rowKeys.indexOf(i) === -1) }, () => {
            console.log("DeSelect", this.state.selectedKeys)
        });
    };

    selectTask = (e) => {
        this.setState({ selectedTask: e.target.value });
    }

    assignItemsToTask = () => {
        if (this.state.selectedTask === 0) {
            console.log("exeis akoma default");
            alert("Please Select a Task first");
            return
        }
        if (this.state.selectedKeys.length === 0) {
            console.log("exeis akoma default");
            alert("Please Select Item(s) first");
            return
        }
        console.log("Selected Keys", this.state.selectedKeys);
        ApiTasks.assignToTask(this.state.selectedTask, this.state.selectedKeys)
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


    render() {
        return (
            <div className="container-fluid" style={{ backgroundColor: 'grey', maxHeight: '700px' }}>
                <div className='row'>
                    <div id="parentDivOfGrid" className='col-lg-9'>
                        <ReactDataGrid className="text-center"
                            ref={node => this.grid = node}
                            onRowClick={this.onRowClick}
                            onGridSort={this.handleGridSort}
                            enableCellSelect
                            columns={this._columns}
                            rowGetter={this.rowGetter}
                            rowsCount={this.getSize()}
                            minHeight={500}
                            // minWidth={1000}
                            onGridRowsUpdated={this.handleGridRowsUpdated}
                            // toolbar={<Toolbar poutsa={<button>Poutsa</button>} enableFilter onAddRow={this.handleAddRow}></Toolbar>}
                            toolbar={<CustomToolbar
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
                    <div className='col-lg-2' style={{ marginLeft: '50px', marginBottom: '15px' }}>
                        {/* <GalleryWrapper images={this.state.images} /> */}
                        {/* <Gallery
                        photos={this.state.images}
                        columns={3}
                        // direction={this.state.images.length > 0 ? 'column' : 'row'}
                        direction='row'
                    /> */}
                    </div>
                </div>
            </div >
        );
    }
}


class CustomToolbar extends Toolbar {
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
        let value = this.props.row.name;
        let style = {};
        style = { backgroundColor: "" }
        if (value.trim() === "ερωτας") {
            style = { borderColor: "red", backgroundColor: "red", color: "white" };

        } else {
            // style = { backgroundColor : "green"}
        }
        return style;
    }
    render() {
        // console.log("Formatter", this.props);
        const style = this.calculateStyle();
        return (

            // <span className={this.props.nsn === "" ? "red" : "green"}>
            <div style={style}>{this.props.value}</div>


        );
    }
}