import React from 'react';
// import DataGrid from './dataGrid';
import ItemsDataGrid from '../components/itemDataGrid';
import DataGridGen from '../components/dataGridGen';
import GalleryWrapper from '../components/galleryWrapper';

const ApiItems = require("../util/api").ApiItems;


export default class Items extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
            await this._getImages();
            await this._getItemInvoices();
        }
    }

    setSelectedItem = async (selectedAtcorId) => {
        this.setState({ selectedAtcorId: selectedAtcorId }, () => console.log("Selected", this.state.selectedAtcorId))
    }
    setSelectedItemInvoice = async (selectedItemInvoice) => {
        this.setState({ selectedItemInvoice: selectedItemInvoice }, () => console.log("Selected", this.state.selectedItemInvoice))
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
        let results = await ApiItems.getItemInvoices(this.state.selectedAtcorId, 1);
        console.log("NANAN", results)
        if (results.err) {
            return;
        }
        let atcorId = results.items[0].atcorId;
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
            of: atcorId
            // columns: columns
        });

    }

    render() {
        return (

            <div className=""style={{height:"500px" ,paddingLeft:"280px",minWidth:"1300px",paddingTop:"30px"}}>
                <div className="row">
                    <div className="col-lg-9" >
                        <div>
                            <ItemsDataGrid
                                mode={this.state.mode}
                                data={this.state.items}
                                setSelectedRow={this.setSelectedItem}
                                selectedRow={this.state.selectedAtcorId}
                                of={""}
                            />
                        </div>
                        <div style={{ marginTop: '15px'}}>
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