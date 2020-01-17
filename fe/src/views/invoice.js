import React from 'react';
// import DataGrid from './dataGrid';
import Excel from '../components/excelReader';
import Loader from 'react-loader';
import GalleryWrapper from '../components/galleryWrapper';
import DataGridGen from '../components/dataGridGen';

// const Api = require("./api").Api;
const ApiInvoices = require("../util/api").ApiInvoices;
const ApiItems = require("../util/api").ApiItems;

export default class Invoices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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

    createInvoiceItems = async (data) => {
        let invoiceId = this.state.selectedInvoice;
        if (invoiceId === -1) {
            alert("Please Select an Invoice to Add Items for")
            return;
        }
        let items = data;
        
        items.map(i => {
/** KENO NAME NA AGNOEI TIN GRAMMI */

            // console.log("AtcorNo ", i.atcorNo)
            delete i.id;
            if (i.nsn === "" || i.nsn === " "){
                delete i.nsn;
            }
            if (i.atcorPN === "" || i.atcorPN === " "){
                delete i.atcorPN;
            }
            // console.log("TYPOS", typeof(i.matInQnt))
            if (typeof(i.matInQnt) === "string"){
                // console.log("edw");
               i.matInQnt = parseInt(i.matInQnt);
            //    console.log(i.matInQnt);
            }
            
        })
       
        console.log("XRISTEMOU", invoiceId, items)
        let result = await ApiInvoices.createInvoiceItems(invoiceId, items);
        console.log(result);
        let output = result.msg + '\n';
        if (result.err) {
            result.data.map(e => { output = output + '\n' + e.item.name })
        }
        output = output + "\n\n"
        alert(output);
        await this.setSelectedInvoiceItem(-1, -1, true);
        // this.setState({ isLoading: false })
    }

    setSelectedInvoice = async (selectedInvoice) => {
        this.setState({ selectedInvoice: selectedInvoice }, () => console.log("Selected", this.state.selectedInvoice))
    }
    setSelectedInvoiceItem = async (selectedInvoiceItem, selectedAtcorId, force) => {
        if (force) {
            // this._getTaskItems();
            this._getInvoicesItems();
            // this._getImages();
        } else {
            this.setState({ selectedInvoiceItem: selectedInvoiceItem, selectedAtcorId: selectedAtcorId },
                () => console.log("Selected InvoiceItem", this.state.selectedAtcorId))
        }

    }
    _getInvoicesItems = async () => {
        let results = await ApiInvoices.getInvoiceItems(this.state.selectedInvoice);
        console.log("InvoiceItems",results)
        if (results.err) {
            return;
        }
        let invoice = results.invoices[0].invoice;
        let remark = results.invoices[0].remark;
        // let matInDate = results.invoices[0].matInDate;
        let rows = [];
        if (results.invoices[0].items.length === 0){
            let row = {};
            row.id = -2;
            // row.invoice = invoice;
            // row.remark = remark;
            row.atcorId = 0;
            row.atcorNo = "";
            row.task_related = "";
            row.name = " "; //des giati ston poutso to exw valei auto me keno, mou vrwmaei
            row.nsn = "";
            row.unit = "";
            row.PN = "";
            row.atcorPN = "";
            row.characteristic_1 = "";
            row.characteristic_2 = "";
            row.rfm_related = "";
            row.matInQnt = 0;
            row.availability = 0;
            row.priceIn = 0.00;

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
                row.nsn = r.nsn;
                row.unit = r.unit;
                row.characteristic_1 = r.characteristic_1;
                row.characteristic_2 = r.characteristic_2;
                row.PN = r.PN;
                row.atcorPN = r.atcorPN;
                row.rfm_related = r.invoiceItem.rfm_related;
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
        this.setState({
            invoices: results.invoices,
            // columns: columns
        });
    }

    _getItemNames = async () => {
        let results = await ApiItems.getItems();
        if (results.err) {
            return;
        }
        let names = results.items.map(i => { return { id: i.atcorId, title: i.name } });
        this.setState({
            itemNames: names,
            // columns: columns
        });
        return names;
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
                            data={this.state.invoices}
                            selectedRow={this.state.selectedInvoice}
                            setSelectedRow={this.setSelectedInvoice}
                            enableCellSelect={true}
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
                            />
                        </div>
                        {/* <button
                            className="btn btn-success"
                            style={{ marginLeft: '15px', marginRight: '15px' }}
                            onClick={this.createInvoiceItems}> Save Invoice Items
                         </button> */}
                        {this.state.isLoading ? <Loader className="spinner" /> : <Excel cb={this.createInvoiceItems} invoice={this.state.of} />}
                    </div>
                    <div className="col-lg-3">
                        <GalleryWrapper images={this.state.images} />
                    </div>
                </div>
            </div>
        );
    }
}

