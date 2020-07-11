import React from 'react';
// import DataGrid from './dataGrid';
import ItemsDataGrid from '../components/itemDataGrid';
import DataGridGen from '../components/dataGridGen';
import GalleryWrapper from '../components/galleryWrapper';

const ApiItems = require("../util/api").default.ApiItems;

const kwdikos = "atcor%123";
export default class Items extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kwdikos: "",
            mode: "Items",
            modeSubTable: "ItemInvoices",
            items: [],
            itemInvoices: [],
            images: [],
            selectedAtcorId: -1,
            selectedItemInvoice: -1,
            of: ""
        }
    }
    async componentDidMount() {
        await this._getItems();
    }
    async componentDidUpdate(prevProps, prevState) {
        // console.log("Prev", prevState.selectedAtcorId);
        // console.log("Curr", this.state.selectedAtcorId);
        // if (this.state.selectedInvoice !== prevState.selectedInvoice) {
        //     console.log("Updating SubTable")
        //     await this._getInvoicesItems();
        // }

        if (this.state.selectedAtcorId !== prevState.selectedAtcorId) {
            console.log("Updating Gallery")
            // Promise.all( this._getImages(), this._getItemInvoices())
            await this._getImages();
            console.log("Pare mpourdes");
            await this._getItemInvoices();
        }
    }


    handleChange = (e) => {
        // console.log(e.target.value);
        this.setState({
            kwdikos: e.target.value
        })
    }
    activateDelete = (e) => {
        e.preventDefault();
        if (this.state.kwdikos === kwdikos) {
            this.setState({ activateDelete: true, kwdikos: "" });
            alert("Delete Activated");
            return;
        } else {
            this.setState({ activateDelete: false, kwdikos: "" });
            alert("Wrong Pass")
            return;
        }

    }
    deleteItem = async (selected) => {
        console.log("Arxi sto deleteItem Data", selected)
        // let invoiceId = this.state.selectedInvoice;
        if (selected.length === 0) {
            alert("Please Select 1 Item")
            return;
        }
        if (selected.length > 1) {
            alert("Please Select only 1 Item to Delete");
            return;
        }
        if (!this.state.activateDelete) {
            alert("Please Enter Delete Code")
            return;
        }

        /** KAPOU EDW ERWTISI GIA KWDIKO */
        let result = await ApiItems.deleteItem(selected[0]);
        console.log("mesa sto delete item", selected[0]);
        alert(result.msg);
        await this.setSelectedItem(-1, true);
    }

    setSelectedItem = async (selectedAtcorId, force) => {
        if (force) {
            this._getItems();
        }
        this.setState({ selectedAtcorId: selectedAtcorId /** put false on after deleting */ }, () => console.log("Selected atcorid", this.state.selectedAtcorId))
    }
    setSelectedItemInvoice = async (selectedItemInvoice) => {
        this.setState({ selectedItemInvoice: selectedItemInvoice }, () => console.log("Selected", this.state.selectedItemInvoice))
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
        console.log("Srcs", sources);
        this.setState({ images: sources })
    }


    _getItems = async () => {
        let results = await ApiItems.getItems();
        console.log("NANAN", results)
        if (results.err) {
            return;
        }
        this.setState({
            items: results.items,
            // columns: columns
        });

    }
    _getItemInvoices = async () => {
        console.log("TEEEST")
        let results = await ApiItems.getItemInvoices(this.state.selectedAtcorId, 0);
        console.log("NANANaa", results)
        if (results.err) {
            return;
        }
        if (results.items.length === 0) {
            return;
        }
        let atcorId = results.items[0].atcorId;
        let atcorNo = results.items[0].atcorNo;
        let name = results.items[0].name;
        let rows = results.items[0].invoices.map((r) => {
            let row = {};
            row.matInDate = r.matInDate;
            row.id = r.invoiceItems.id;
            row.invoice = r.invoice;
            row.supplier = r.supplier;
            row.remark = r.remark;
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

    render() {
        return (

            <div className="" style={{ height: "500px", paddingLeft: "50px", minWidth: "1300px", paddingTop: "60px" }}>
                <h1 id="pipes">Warehouse</h1>
                <form>
                    <label>Enter Code for Delete: </label>
                    <input type="password" value={this.state.kwdikos} onChange={e => this.handleChange(e)} />
                    <button onClick={(e) => this.activateDelete(e)}>Check</button>
                </form>
                <div className="row">
                    <div className="col-lg-9" >
                        <div>
                            <ItemsDataGrid
                                mode={this.state.mode}
                                data={this.state.items}
                                setSelectedRow={this.setSelectedItem}
                                selectedRow={this.state.selectedAtcorId}
                                of={""}
                                deleteItem={this.deleteItem}
                            />
                        </div>
                        <div style={{ marginTop: '15px' }}>
                            <DataGridGen
                                mode={this.state.modeSubTable}
                                data={this.state.itemInvoices}
                                //selectedRow={this.state.selectedItemInvoice}
                                //setSelectedRow={this.setSelectedItemInvoice}
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




// render() {
//     return (
//         <div>
//             <h1>Items</h1>
//             <button onClick={this._getItems}>NewItems</button>
//             <ItemsDataGrid
//                 mode={this.state.mode}
//                 data={this.state.items}
//                 setSelectedRow={this.setSelectedItem}
//                 selectedRow={this.state.selectedAtcorId} />
//             <GalleryWrapper images={this.state.images} />
//             <DataGridGen
//                 mode={this.state.modeSubTable}
//                 data={this.state.itemInvoices}
//                 selectedRow={this.state.selectedItemInvoice}
//                 setSelectedRow={this.setSelectedItemInvoice}
//             />
//             {/* <button onClick={this.toHome}>Back to Home </button> */}
//         </div>
//     );
// }