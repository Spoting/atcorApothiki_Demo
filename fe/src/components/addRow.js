const ApiInvoice = require("../util/api").default.ApiInvoices;
const ApiItems = require("../util/api").default.ApiItems;
const ApiTasks = require("../util/api").default.ApiTasks;

export const addRow = async (mode, data) => {
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
        let x = Math.floor(Math.random() * 100);
        newRow = {
            sysName: "",
            taskName: "Change/" + x,
            endItem: "",
            completed: false,
            // dateCompleted: "",
            contract: "",
            PO: ""
        }
        response = await ApiTasks.createTask(newRow);
        console.log("TaskCreate", response);
    }
    console.log("newRow", response);
    return response;
};