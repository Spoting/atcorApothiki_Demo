import React from 'react';
// import DataGrid from './dataGrid';
import Excel from '../components/excelReader';
import Loader from 'react-loader';
import GalleryWrapper from '../components/galleryWrapper';
import DataGridGen from '../components/dataGridGen';
// import { confirmAlert } from 'react-confirm-alert'; // Import

// const Api = require("./api").Api;
const ApiInvoices = require("../util/api").default.ApiInvoices;
const ApiItems = require("../util/api").default.ApiItems;

const kwdikos = "atcor%123";
export default class Invoices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kwdikos: "",
            activateDelete: false,
            mode: "Invoices",
            modeSubTable: "InvoiceItems",
            invoices: [],
            invoiceItems: [],
            images: [],
            selectedInvoice: -1,
            selectedInvoiceItem: -1,
            selectedAtcorId: -1,
            of: "",
            isLoading: false,
            itemNames: []
        }
    }

    async componentDidMount() {
        //Remember to Promise.All
        await this._getInvoices();
        await this._getItemNames();
    }
    async componentDidUpdate(prevProps, prevState) {
        // console.log("Prev", prevState.selectedInvoice);
        // console.log("Curr", this.state.selectedInvoice);
        if (this.state.selectedInvoice !== prevState.selectedInvoice) {
            console.log("Updating SubTable")
            await this._getInvoicesItems();
        }
        if (this.state.selectedAtcorId !== prevState.selectedAtcorId) {
            console.log("Updating Gallery")
            await this._getImages();
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
    deleteInvoice = async (selected) => {
        console.log("Arxi sto deleteInvoice Data", selected)
        // let invoiceId = this.state.selectedInvoice;
        if (selected.length === 0) {
            alert("Please Select 1 Invoice")
            return;
        }
        if (selected.length > 1) {
            alert("Please Select only 1 Invoice to Delete");
            return;
        }
        if (!this.state.activateDelete) {
            alert("Please Enter Delete Code")
            return;
        }

        /** KAPOU EDW ERWTISI GIA KWDIKO */
        let result = await ApiInvoices.deleteInvoice(selected[0]);
        console.log("mesa sto delete invoice", selected[0]);
        alert(result.msg);
        await this.setSelectedInvoice(-1, true);
    }
    deleteInvoiceItem = async (selected) => {
        console.log("Arxi sto deleteInvoiceItem Data", selected)
        // let invoiceId = this.state.selectedInvoice;
        if (selected < 0) {
            alert("Please Save Invoice Before Deleting. \n")
            return;
        }
        if (selected.length === 0) {
            alert("Please Select 1 InvoiceItem")
            return;
        }
        if (selected.length > 1) {
            alert("Please Select only 1 InvoiceItem to Delete");
            return;
        }
        if (!this.state.activateDelete) {
            alert("Please Enter Delete Code")
            return;
        }

        /** KAPOU EDW ERWTISI GIA KWDIKO */
        let result = await ApiInvoices.deleteInvoiceItem(selected[0]);
        console.log("mesa sto delete invoiceitem", selected[0]);
        alert(result.msg);
        await this.setSelectedInvoiceItem(-1, -1, true);
    }
    createInvoiceItems = async (data) => {
        let invoiceId = this.state.selectedInvoice;
        console.log("INVOICEITEMS DATA: ", this.state.invoiceItems);
        if (invoiceId === -1) {
            alert("Please Select an Invoice to Add Items for")
            return;
        }
        let items = data;
        console.log("Prin to filter", items)
        let x = items.filter(i => {
            return !(i.name === "" || i.name === " ");
        })
        console.log("Meta to filter", x)

        x.map(i => {
            delete i.id;
            if (i.nsn === "" || i.nsn === " ") {
                delete i.nsn;
            }
            if (i.atcorPN === "" || i.atcorPN === " ") {
                delete i.atcorPN;
            }
            if (typeof (i.matInQnt) === "string") {
                i.matInQnt = parseInt(i.matInQnt);
            }

        })

        if (x.length === 0) {
            alert("Please Add Items to Invoice");
            return;
        }
        console.log("XRISTEMOU", invoiceId, x)
        let result = await ApiInvoices.createInvoiceItems(invoiceId, x);
        console.log("META TON STRAVO MOU", result);
        let output2 = result.msg2 + '\n';
        if (result.err2) {
            result.newItems.map(ni => { output2 = output2 + '\n' + ni.item.name + " " + ni.item.atcorNo })
        }
        output2 = output2 + "\n\n";
        alert(output2);

        let output1 = result.msg1 + '\n';
        if (result.err1) {
            result.notAssigned.map(ni => { output1 = output1 + '\n' + ni.item.name + " " + ni.item.atcorNo })
        }
        output1 = output1 + "\n\n";
        alert(output1);
        // let output = result.msg + '\n';
        // if (result.err) {
        //     result.data.map(e => { output = output + '\n' + e.item.name })
        // }
        // output = output + "\n\n"
        // alert(output);
        await this.setSelectedInvoiceItem(-1, -1, true);
        // this.setState({ isLoading: false })
    }

    setSelectedInvoice = async (selectedInvoice, force) => {
        if (force) {
            console.log("FOrcare")
            this._getInvoices();
        }
        this.setState({ selectedInvoice: selectedInvoice }, () => console.log("Selected", this.state.selectedInvoice))
    }
    setSelectedInvoiceItem = async (selectedInvoiceItem, selectedAtcorId, force) => {
        if (force) {
            // this._getTaskItems();
            this._getInvoicesItems();
            // this._getImages();
        } else {
            this.setState({ selectedInvoiceItem: selectedInvoiceItem, selectedAtcorId: selectedAtcorId },
                () => console.log("Selected InvoiceItem, AtcorId", this.state.selectedInvoiceItem, this.state.selectedAtcorId))
        }

    }
    _getInvoicesItems = async () => {
        let results = await ApiInvoices.getInvoiceItems(this.state.selectedInvoice);
        console.log("InvoiceItems", results)
        if (results.err) {
            return;
        }
        if (results.invoices.length === 0) {
            return;
        }
        let invoice = results.invoices[0].invoice;
        let remark = results.invoices[0].remark;
        // let matInDate = results.invoices[0].matInDate;
        let rows = [];
        if (results.invoices[0].items.length === 0) {
            let row = {};
            row.id = -2;
            // // row.invoice = invoice;
            // // row.remark = remark;
            row.atcorId = null;
            row.atcorNo = null;
            row.task_related = "";
            row.name = "";
            row.PN = null;
            row.nsn = null;
            row.atcorPN = null;
            row.characteristic_1 = null;
            row.characteristic_2 = null;
            row.rfm_related = null;
            row.unit = null;
            row.matInQnt = null;
            row.availability = null;
            row.priceIn = null;

            rows.push(row)
        } else {
            rows = results.invoices[0].items.map((r) => {
                let row = {};
                row.id = r.invoiceItem.id;
                // row.invoice = invoice;
                // row.remark = remark;
                row.atcorId = r.atcorId;
                row.atcorNo = r.atcorNo;
                row.task_related = r.invoiceItem.task_related;
                row.name = r.name;
                row.PN = r.PN;
                row.nsn = r.nsn;
                row.atcorPN = r.atcorPN;
                row.characteristic_1 = r.characteristic_1;
                row.characteristic_2 = r.characteristic_2;
                row.rfm_related = r.invoiceItem.rfm_related;
                row.unit = r.unit;
                row.matInQnt = r.invoiceItem.matInQnt;
                row.availability = r.invoiceItem.availability;
                row.priceIn = r.invoiceItem.priceIn;

                return row;
            })
        }

        this.setState({
            invoiceItems: rows,
            of: invoice,
            // columns: columns
        }, console.log("Invoice Item", this.state.invoiceItems));
    }
    _getInvoices = async () => {
        let results = await ApiInvoices.getInvoices();
        if (results.err) {
            return;
        }
        if (results.invoices.length === 0) {
            return;
        }
        this.setState({
            invoices: results.invoices,
            // columns: columns
        });
    }

    //Edw tsimpa kai to c1 + c2
    _getItemNames = async () => {
        let results = await ApiItems.getItems();
        if (results.err) {
            return;
        }
        // let names = results.items.map(i => { return { id: i.atcorId, title: i.name, c1: i.characteristic_1, c2: i.characteristic_2 } });
        let names = results.items.map(i => {
            return {
                id: i.atcorId,
                title: i.name +
                    " || c1: " +
                    i.characteristic_1 +
                    ", c2: " +
                    i.characteristic_2 +
                    " || " +
                    i.atcorNo
            }
        });
        this.setState({
            itemNames: names,
            // columns: columns
        });
        console.log("Peoutsos", this.state.itemNames)
        return names;
    }
    _getImages = async () => {
        console.log(this.state.selectedAtcorId)
        let res = await ApiItems.getImages(this.state.selectedAtcorId);
        let sources = res.data.map((i) => {
            let img = '';
            img = 'http://localhost:8000/static/' + i;
            // img = 'http://localhost:8000/static/' + i;
            // img.width = 100;
            // img.height = 100;

            return img;
        });
        // console.log("Srcs", sources);
        this.setState({ images: sources })
    }


    render() {
        return (

            <div className="" style={{ height: "500px", paddingLeft: "50px", minWidth: "1300px", paddingTop: "60px" }}>
                <h1>Invoices</h1>
                <form>
                    <label>Enter Code for Delete: </label>
                    <input type="password" value={this.state.kwdikos} onChange={e => this.handleChange(e)} />
                    <button onClick={(e) => this.activateDelete(e)}>Check</button>
                </form>
                <div className="row">
                    <div className="col-lg-9" >
                        <DataGridGen
                            mode={this.state.mode}
                            data={this.state.invoices}
                            selectedRow={this.state.selectedInvoice}
                            setSelectedRow={this.setSelectedInvoice}
                            enableCellSelect={true}
                            deleteInvoice={this.deleteInvoice}
                        />
                        <div style={{ marginTop: '15px' }}>
                            <DataGridGen
                                mode={this.state.modeSubTable}
                                data={this.state.invoiceItems}
                                selectedRow={this.state.selectedInvoiceItem}
                                setSelectedRow={this.setSelectedInvoiceItem}
                                of={this.state.of}
                                enableCellSelect={true}
                                itemNamesFilter={this.state.itemNames}
                                // getItemNames={this.getItemNames}
                                selectedInvoiceId={this.state.selectedInvoice}
                                createInvoiceItems={this.createInvoiceItems}

                                deleteInvoiceItem={this.deleteInvoiceItem}
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


// createInvoiceItems = async (data) => {
//     let invoiceId = this.state.selectedInvoice;
//     console.log("INVOICEITEMS DATA: ", this.state.invoiceItems);
//     if (invoiceId === -1) {
//         alert("Please Select an Invoice to Add Items for")
//         return;
//     }
//     let items = data;
//     let foundEmptyName = items.find(i => {
//         return (i.name === "" || i.name === " ")
//     })
//     if (foundEmptyName) {
//         alert("You got a row with empty Name")
//         return;
//     }
//     items.map(i => {
//         delete i.id;
//         if (i.nsn === "" || i.nsn === " ") {
//             delete i.nsn;
//         }
//         if (i.atcorPN === "" || i.atcorPN === " ") {
//             delete i.atcorPN;
//         }
//         if (typeof (i.matInQnt) === "string") {
//             i.matInQnt = parseInt(i.matInQnt);
//         }

//     })

//     console.log("XRISTEMOU", invoiceId, items)
//     let result = await ApiInvoices.createInvoiceItems(invoiceId, items);
//     console.log("META TON STRAVO MOU", result);
//     let output2 = result.msg2 + '\n';
//     if (result.err2) {
//         result.newItems.map(ni => { output2 = output2 + '\n' + ni.item.name + " " + ni.item.atcorNo })
//     }
//     output2 = output2 + "\n\n";
//     alert(output2);

//     let output1 = result.msg1 + '\n';
//     if (result.err1) {
//         result.notAssigned.map(ni => { output1 = output1 + '\n' + ni.item.name + " " + ni.item.atcorNo })
//     }
//     output1 = output1 + "\n\n";
//     alert(output1);
//     // let output = result.msg + '\n';
//     // if (result.err) {
//     //     result.data.map(e => { output = output + '\n' + e.item.name })
//     // }
//     // output = output + "\n\n"
//     // alert(output);
//     await this.setSelectedInvoiceItem(-1, -1, true);
//     // this.setState({ isLoading: false })
// }