const ApiInvoice = require("../util/api").ApiInvoices;
const ApiItems = require("../util/api").ApiItems;
const ApiTasks = require("../util/api").ApiTasks;

export const addRow = async (mode, data) => {
    // let currentdate = new Date();
    // // let dt = ""
    // //     + currentdate.getFullYear() + "-"
    // //     + (currentdate.getMonth() + 1) + "-"
    // //     + currentdate.getDate() + "T"
    // //     + currentdate.getHours() + ":"
    // //     + currentdate.getMinutes() + ":"
    // //     + currentdate.getSeconds() + "Z";
    // let dt = new Date().getTime();
    // let random = Math.floor(Math.random() * 10);

    // let tmpDate = new Date(0, 0, 0, 0, 0, 0, 0);
    // console.log(random);
    let newRow = {};
    let response;
    if (mode === "Invoices") {
        newRow = {
            // id: 0,
            // invoice:  random + "_" + dt,
            invoice: "",
            // invoiceDate: 1999-12-12,
            remark: "",
            characteristic_1: "-",
            characteristic_2: "-",
            // matInDate: dt,
            supplier: "",
        };
        response = await ApiInvoice.createInvoice(newRow);
        console.log("CREATEDROW INVOICE", response);
    }
    // if (mode === "items") {
    //     newRow = {
    //         totalStock: 0,
    //         name: "",
    //         category: "",
    //         material: "",
    //         measurement: 0,
    //         VAT: 0,
    //         location: "",
    //         dexion: "",
    //         nsn: dt
    //     }
    // }
    if (mode === "InvoiceItems") {
        console.log("Mesa Sto Invoice Items AddRow", data);
        newRow = {
            id: data.tempId,
            atcorId: 0,
            name: "",
            nsn: "",
            unit: "",
            task_related: "",
            PN: "",
            atcorPN: "",
            rfm_related: "",
            matInQnt: 0,
            availability: 0,
            priceIn: "0.00"
        }
        return newRow;
    }
    if (mode === "Tasks") {
        newRow = {
            sysName: "",
            taskName: "",
            endItem: "",
            completed: false,
            // dateCompleted: "",
            contract: "",
            PO: ""
        }
        response = await ApiTasks.createTask(newRow);
    }
    // if (mode === "ItemInvoices") {
    //     newRow = {
    //         invoice: "",
    //         remark: "",
    //         // atcorId: 0,
    //         // name: "",
    //         matInQnt: 0,
    //         availability: 0,
    //         priceIn: 0.00
    //     }
    // }
    console.log("newRow", response);
    return response;
};