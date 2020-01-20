const ApiInvoice = require("../util/api").ApiInvoices;
const ApiItems = require("../util/api").ApiItems;
const ApiTasks = require("../util/api").ApiTasks;

export const updateRow = async (mode, data, updated) => {
    let response = {};

    console.log("updateRow data", data);
    if (mode === "Invoices") {
        response = await ApiInvoice.updateInvoice(data.id, updated);
    }

    if (mode === "TaskItems") {//taskId, itemId,  isOut, value, matActionDate
        let dt = new Date().getTime();
        let x = Object.keys(updated);
        let isOut = false;
        let value;
        if (x[0] === "matOut") {
            let isnum = /^\d+$/.test(updated.matOut);
            if (!isnum) {
                alert("Please Insert Numbers");
                return;
            }
            value = parseInt(updated.matOut);
            if ((value < 0) || (data.totalStock < value)) {
                alert("Must be: ( matOut > 0 )AND ( matout < totalStock )");
                return;
            }
            isOut = true;
        }
        if (x[0] === "matRet") {
            let isnum = /^\d+$/.test(updated.matRet);
            if (!isnum) {
                alert("Please Insert Numbers");
                return;
            }
            value = parseInt(updated.matRet);
            if ((value < 0) || (data.totalMatOut - data.totalMatRet < value)) {
                alert("Must be: ( matRet > 0 ) AND ( matRet <= totalMatOut - totalMatRet )");
                return;
            }
            isOut = false;
        }

        console.log("Xriste mou", data.id, isOut, value, dt)
        if (value > 0) {
            response = await ApiTasks.createTaskItemMvt(data.id, isOut, value, dt);
        }

    }
    if (mode === "InvoiceItems") {
        console.log("InvoiceItem Update Method for", updated);;
        console.log(data);
        let x = Object.keys(updated);
        let items = [];
        if (x[0] === "matInQnt") {
            let isnum = /^\d+$/.test(updated.matInQnt);
            if (!isnum) {
                alert("Please Insert Numbers");
                return;
            }
        }
        if (x[0] === "priceIn") {
            console.log("PriceIn Prin", updated.priceIn);
            updated.priceIn = updated.priceIn.replace("\,", "\.");
            console.log("priceIn Meta", updated.priceIn);
            let isdec =  /^\d+\.\d{0,2}$/.test(updated.priceIn);
            if (!isdec) {
                alert("Please Insert Decimal");
                return;
            }
        }
        if (x[0] === "matInQnt") {
            console.log("WRAIA gia TO matInqnt", updated.matInQnt);
            response.newAvailability = true;
            response.found = true;
        }
        if (x[0] === "nsn") {
            console.log("WRAIA gia TO NSN", updated.nsn);
            items = await ApiItems.getItemByNsn(updated.nsn);
            console.log(items);
            if (items.items.length > 0 && items.items.length < 2) {
                response.foundItems = items;
                response.foundBy = "nsn";
                response.found = true;
            }
            if (updated.nsn === "") {
                response.found = false;
            }
        }
        if (x[0] === "atcorPN") {
            console.log("WRAIA gia TO atcorPN", updated.atcorPN);
            items = await ApiItems.getItemByAtcorPN(updated.atcorPN);
            console.log(items);
            if (items.items.length > 0 && items.items.length < 2) {
                response.foundItems = items;
                response.foundBy = "atcorPN";
                response.found = true;
            }
            if (updated.atcorPN === "") {
                response.found = false;
            }
        }
        
        if (x[0] === "name") {
            console.log("WRAIA gia TO NAME", updated.name);
            console.log(updated);
            items = await ApiItems.getItemByName(updated.name);
            if (items.items.length > 1) {
                alert("Found item with name <" + updated.name + "> more than 1 time.\nFill out PN or AtcorPN or NSN .\n\n")
                response.foundBy = "name"
                response.found = false;
            } else {
                if (items.items.length > 0 && items.items.length < 2) {
                    console.log("kati vrike", items);
                    response.foundItems = items;
                    response.foundBy = "name"
                    response.found = true;
                } else {
                    response.foundBy = "name"
                    response.found = false;
                }
            }
        }
        if (x[0] === "PN") {
            console.log("WRAIA gia TO PN", updated.PN);
            console.log(data);
            items = await ApiItems.getItemByName(data.name, updated.PN);
            // if (items.items.length > 1) {
            //     alert("Found item with name <" + updated.name + "> more than 1 time.\nFill out NSN or AtcorPN.\n Otherwise update this item name (FIXTHISSETENCE).")
            //     response.foundBy = "name"
            //     response.found = false;
            // } else {
                if (items.items.length > 0 && items.items.length < 2) {
                    console.log("kati vrike", items);
                    response.foundItems = items;
                    response.foundBy = "PN"
                    response.found = true;
                }
                // else {
                //     response.foundBy = "PN"
                //     response.found = false;
                // }
            // }
        }
    }
    if (mode === "Tasks") {
        response = await ApiTasks.updateTask(data.id, updated);
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
    // console.log("newRow", newRow);
    return response;
};