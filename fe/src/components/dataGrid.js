import React from "react";
import ReactDOM from "react-dom";

import ReactDataGrid from "react-data-grid";
import Gallery from "react-photo-gallery"
import { Toolbar, Data, Filters } from "react-data-grid-addons";

const selectors = Data.Selectors;
const {
    // NumericFilter,
    AutoCompleteFilter,
    SingleSelectFilter
} = Filters;

const Api = require("./api").Api;
const filterNormal = ["atcorId"];
const filterAutoComplete = ["name"];
const filterSingleSelect = ["measurement", "category"];

/**TODO List:
 * -Move Api Product Call here                      TODO: tick
 * -Make Search Bar                                 TODO: tick
 * -Filter through SearchBar                        TODO: tick
 * -BUG when trying to filter column with null cell TODO: {https://github.com/adazzle/react-data-grid/issues/1129}         
 * -Editable                                        TODO: tick
 * -Sorting                                         TODO: 
 * -Make DB Update Call onCellUpdate                TODO:   
 * -Style the things                                TODO:
 * -Refactor for Reusability                        TODO:
*/

/**
 * For BUG: crash when column have a cell with null value
 *    https://github.com/adazzle/react-data-grid/issues/1129
 * This only happens when using Filters from Addons. Normal Filter works fine
 */
export default class DataGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            columns: [],
            rows: [],
            images: [],
            selectedAtcorId: 0,

            filteredRows: [],
            filters: {},
            setFilters: {}
        }
    }

    async componentDidMount() {
        let mode = this.props.mode;
        console.log("Table mode", mode);
        this._getItems();
    };
    // componentDidUpdate() {
    //     let mode = this.props.mode;
    //     console.log("Table mode", mode);
    // }

    _getItems = async () => {
        let results = await Api.getItems();
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
                    editable: true,
                    resizable: true,
                    // sortable: true
                    // filterable: true,
                };

                if (filterAutoComplete.find((i) => { return i === x })) { //Logic to make columns not <something>
                    y.filterRenderer = AutoCompleteFilter;
                    y.filterable = true;
                }
                if (filterSingleSelect.find((i) => { return i === x })) {
                    y.filterRenderer = SingleSelectFilter;
                    y.filterable = true;
                }
                if (filterNormal.find((i) => { return i === x })) {
                    y.filterable = true;
                }
                return y;
            });
            console.log("y", columns);
            console.log("x", items);

            this.setState({
                columns: columns, items: items, rowCount: items.length, filteredRows: items
            });
        }
    }

    onRowClick = (row) => {
        if (row === -1) {
            return;
        }
        console.log("Niaou", this.state.filteredRows[row].atcorId);
        if (this.state.selectedAtcorId !== this.state.filteredRows[row].atcorId) {
            Api.getImages(this.state.filteredRows[row].atcorId).then((res) => {
                let sources = res.data.map((i) => {
                    let img = {};
                    img.src = 'http://localhost:8000/static/' + i;
                    img.width = 400;
                    img.height = 400;
                    return img;
                });
                console.log("Srcs", sources);
                this.setState({ images: sources })
            }).catch((err) => console.log(err));
        }
        this.setState({ selectedAtcorId: this.state.filteredRows[row].atcorId });
    }


    //FOR FILTERING
    handleFilterChange = filter => {
        const newFilters = { ...this.state.filters };
        // console.log("VX", this.state.filters);
        if (filter.filterTerm) {
            newFilters[filter.column.key] = filter;
        } else {
            delete newFilters[filter.column.key];
        }
        this.setState({ filters: newFilters }, () => {
            this.setState({ filteredRows: this.getRows(this.state.items, this.state.filters) });
        });
    };

    getValidFilterValues(rows, columnId) {
        // return [ "xa", "xa2"]
        return rows
            .map(r => r[columnId])
            .filter((item, i, a) => {
                return i === a.indexOf(item);
            });
    }

    // sortRows = (initialRows, sortColumn, sortDirection) => {
    //     let rows = [...this.state.filteredRows];
    //     const comparer = (a, b) => {
    //       if (sortDirection === "ASC") {
    //         return a[sortColumn] > b[sortColumn] ? 1 : -1;
    //       } else if (sortDirection === "DESC") {
    //         return a[sortColumn] < b[sortColumn] ? 1 : -1;
    //       }
    //     };
    //     if (sortDirection === "NONE") {
    //         return
    //     } else {
    //         this.setState({ filteredRows: rows.sort(comparer)})
    //     }
    //     // return sortDirection === "NONE" ? initialRows : rows.sort(comparer);
    //     return;
    //   };

    onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        const filteredRows = [...this.state.filteredRows];
        let tempRows = filteredRows.slice();
        for (let i = fromRow; i <= toRow; i++) {
            filteredRows[i] = { ...tempRows[i], ...updated };
        }
        console.log(filteredRows);
        this.setState({ filteredRows : filteredRows })
    }

    getRows(rows, filters) {
        return selectors.getRows({ rows, filters });
    }

    render() {
        return (
            <div>
                <ReactDataGrid
                    columns={this.state.columns}
                    rowGetter={i => this.state.filteredRows[i]}
                    rowsCount={this.state.filteredRows.length}

                    // onGridSort={(sortColumn, sortDirection) =>
                    //     this.sortRows(this.state.filteredRows, sortColumn, sortDirection)
                    // }s
                    onGridRowsUpdated={this.onGridRowsUpdated}
                    enableCellSelect={true}
                    onRowClick={this.onRowClick}

                    toolbar={<Toolbar enableFilter={true} />}

                    onAddFilter={filter => this.setState({ setFilters: this.handleFilterChange(filter) })}
                    onClearFilters={() => this.setState({ setFilters: {}, filters: {}, filteredRows: this.state.items })}
                    // onAddFilter={filter => this.state.setFilters(this.handleFilterChange(filter))}
                    // onClearFilters={() => this.state.setFilters({})}
                    getValidFilterValues={columnKey => this.getValidFilterValues(this.state.filteredRows, columnKey)}

                />
                <h1>Showing Images for Atcor_No {this.state.selectedAtcorId}</h1>
                <Gallery
                    photos={this.state.images}
                />
            </div >
        );
    }
}