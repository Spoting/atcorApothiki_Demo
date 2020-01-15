import React from "react";
import ReactDOM from "react-dom";

import ReactDataGrid from "react-data-grid";
import Gallery from "react-photo-gallery"
import { Toolbar, Data, Filters } from "react-data-grid-addons";

const selectors = Data.Selectors;
const {
    NumericFilter,
    AutoCompleteFilter,
    SingleSelectFilter
} = Filters;

const Api = require("./api").Api;

/**TODO List:
 * -Move Api Product Call here          TODO: tick
 * -Make DB Update Call onCellUpdate    TODO:   
 * -Make Search Bar                     TODO:
 * -Filter through SearchBar            TODO:
 * -Style the things                    TODO:
 * -Refactor for Reusability
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
            
            filters: {},
            setFilters: () => {}
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
        this.setState({ items: results.items });
        let items = [...this.state.items];
        if (items.length > 1) {
            let tempColumns = Object.keys(items[0]);
            let columns = tempColumns.map((x) => {
                let y = {
                    key: x,
                    name: x,
                    editable: true,
                    resizable: true,
                    // filterable: true,
                };
                const filterable = [ "name", "atcorId" ]
                if (filterable.find((i)=>{return i===x})) { //Logic to make columns not <something>
                    // y.filter = AutoCompleteFilter;
                    y.filterable = true;
                }
                return y;
            });
            console.log("y", columns);
            console.log("x", items);

            this.setState({
                columns: columns, rows: items, rowCount: items.length
            });
        }
    }


    onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        this.setState(state => {
            const rows = state.rows.slice();
            for (let i = fromRow; i <= toRow; i++) {
                rows[i] = { ...rows[i], ...updated };
            }
            return { rows };
        });
    };

    onRowClick = (row) => {
        if (row === -1) {
            return;
        }
        console.log("Niaou", this.state.rows[row].atcorId);
        if (this.state.selectedAtcorId !== this.state.rows[row].atcorId) {
            Api.getImages(this.state.rows[row].atcorId).then((res) => {
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
        this.setState({ selectedAtcorId: this.state.rows[row].atcorId });
    }


    //FOR FILTERING
    handleFilterChange = filter => {
        const newFilters = { ...this.state.filters };
        console.log(this.state.filters);
        if (filter.filterTerm) {
            newFilters[filter.column.key] = filter;
        } else {
            delete newFilters[filter.column.key];
        }
        this.setState({ filters: newFilters })
    };

    // getValidFilterValues(rows, columnId) {
    //     return rows
    //         .map(r => r[columnId])
    //         .filter((item, i, a) => {
    //             return i === a.indexOf(item);
    //         });
    // }

    getRows(rows, filters) {
        return selectors.getRows({ rows, filters });
    }

    render() {
        const filteredRows = this.getRows(this.state.rows, this.state.filters);
        console.log("IOU", filteredRows.length)
        return (
            <div>
                <ReactDataGrid
                    columns={this.state.columns}
                    
                    // rowGetter={i => this.state.rows[i]}
                    // rowsCount={this.state.rows.length}
                    rowGetter={i => filteredRows[i]}
                    rowsCount={filteredRows.length}

                    onGridRowsUpdated={this.onGridRowsUpdated}
                    enableCellSelect={true}
                    onRowClick={this.onRowClick}

                    toolbar={<Toolbar enableFilter={true} />}
                    
                    onAddFilter={filter => this.setState ({setFilters : this.handleFilterChange(filter)})}
                    onClearFilters={() => this.setState({setFilters: {}, filters: {}})}
                    // onAddFilter={filter => this.state.setFilters(this.handleFilterChange(filter))}
                    // onClearFilters={() => this.state.setFilters({})}
                    // getValidFilterValues={columnKey => this.getValidFilterValues(this.state.rows, columnKey)}
                    
                />
                <h1>Showing Images for Atcor_No {this.state.selectedAtcorId}</h1>
                <Gallery
                    photos={this.state.images}
                />
            </div >
        );
    }
}