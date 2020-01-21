

/**
 * Create Invoice
 * Create Invoice/items
 * Read Invoice
 * Read Invoice/items
 * Read Items/Invoice,
 * Update InvoiceItems
 * Update Invoice
 */
const Item = require("../models").Item;
const Invoice = require("../models").Invoice;
const InvoiceItems = require("../models").InvoiceItems;


let leftFillNum = (num, targetLength) => {
    return num.toString().padStart(6, 0);
}

// const sequelize = require("../models").sequelize;
/**
 * 
 * @param {JSON}  
 * data:
 *  invoice, (autogenerate)
 *  remark, 
 *  matInDate,
 *  supplier
 */


const create = async (req, res) => {
    console.log('Create Invoice');
    let result = {};
    let data = req.body.data;
    console.log("data", data);
    try {

        let invoice = await Invoice.create(data.row);
        result.invoice = invoice;
        result.msg = "Inserted Successfully";
        return res.status(201).send(result.invoice);
    } catch (err) {
        result.err = err.original.sqlMessage;
        // result.err = err.errors[0].message;
        return res.status(299).send(result);
    }
}

const createInvoiceItems = async (req, res) => {
    console.log("Assign Item(s) to Invoice");
    let response = {};
    let data = req.body.data;
    console.log("Data", data);
    let results = await _insertInvoiceItems(data);
    // console.log("Output after Insert", results);
    results.map(r => console.log(r));

    let newItems = results.filter(r => {
        if (r.item.created) {
            return r.item;
        }
    })
    console.log("New Items In Database.", newItems);

    let notAssigned = results.filter(r => {
        // console.log(r);
        if (r.item.assigned === false) {
            return r.item;
        }
    })
    console.log("Not Assigned", notAssigned);
    if (notAssigned.length === 0) {
        response.err1 = 0;
        response.msg1 = "Successfully Updated Stock of All Items in Invoice.";
    } else {
        response.err1 = 1;
        response.msg1 = "Already Updated/Assigned stock for these Items. The rest are Updated/Assigned Successfully.";
        response.notAssigned = notAssigned;
    }
    if (newItems.length === 0) {
        response.err2 = 0;
        response.msg2 = "No new Items created in Warehouse."
    } else {
        response.err2 = 1;
        response.msg2 = "New Items in Warehouse.";
        response.newItems = newItems;
    }

    // if (output.length === 0) {
    //     response.err = 0;
    //     response.msg = "Successfully Updated/Created all Items";
    // } else {
    //     response.err = 1;
    //     response.msg = "Invoice Items were not created. The rest are created successfully";
    //     response.data = results;
    // }
    return await res.status(201).send(response);
}

const _insertInvoiceItems = async (data) => {
    const invoiceId = data.invoiceId;

    let log = await Promise.all(data.items.map(async (r) => {
        // console.log("InvoiceItem", r);
        let results = { item: { name: r.name, assigned: false, created: false, atcorNo: "" } };
        try {
            let param = {};
            param.where = {
                name: r.name,
                unit: r.unit,
                // nsn: r.nsn,
                // atcorPN: r.atcorPN,
                PN: r.PN,
                characteristic_1: r.characteristic_1,
                characteristic_2: r.characteristic_2,
                nsn: null,
                atcorPN: null
            }
            if (r.nsn) {
                // param.where = {
                // name: r.name,
                param.where.nsn = r.nsn
                console.log("NSN GAMW TON 8eo MOU", r.nsn)
                // unit: r.unit,
                // atcorPN: r.atcorPN,
                // PN: r.PN,
                // characteristic_1: r.characteristic_1,
                // characteristic_2: r.characteristic_2
                // }
            }
            if (r.atcorPN) {
                param.where.atcorPN = r.atcorPN
                console.log("GAMW TON 8EO MOU", r.atcorPN)
            }

            /**
             * PROVLIMA ME TO ATCORPN
             */

            let [item, created] = await Item.findOrCreate(param);

            results.item.created = created;
            results.item.name = item.name; //log

            // console.log("Etsi", item);
            if (item) {
                if (created) {
                    item.totalStock = r.matInQnt;
                    let no = leftFillNum(item.atcorId);
                    item.atcorNo = leftFillNum(no);

                } else {
                    console.log("Prin TotalStock", item.totalStock)
                    item.totalStock = item.totalStock + r.matInQnt;
                    console.log("Meta TotalStock", item.totalStock)
                }
                results.item.atcorNo = item.atcorNo;
            }

            // else {
            //     results.item.duplicate = "Duplicate AtcorPN: "+ r.atcorPN +" for " + r.name;
            // }


            param = r;
            param.itemId = item.atcorId;
            param.invoiceId = invoiceId;
            param.availability = r.matInQnt;
            if (item) {
                await InvoiceItems.create(
                    param
                );
            }
            await item.save();
            results.item.assigned = true; //log
        } catch (err) {
            console.log("ERRORRR")
            // if (err.original.sqlMessage.includes("uniqueAtcorPN")){
            //     console.log("Duplicate Atcor PN SQL ERROR", err.original.sqlMessage)
            //     results.item.duplicateAtcorPN = err.original.sqlMessage;
            // }
            results.err = err.original.sqlMessage;
            console.log("sql Message")
        } finally {
            return results;
        }
    }))

    return log;
}


const find = async (req, res) => {
    console.log('Find Invoice(s)');
    let result = {};
    let data = req.params.name;

    let param = {};

    if (data) {
        param.attributes = ['invoice', 'remark'];
        param.where = { id: data }
        param.include = [{
            model: Item,
            as: 'items',
            attributes: ['atcorId', 'atcorNo', 'name', 'nsn', 'unit', 'PN', 'atcorPN', 'characteristic_1', 'characteristic_2'],
            through: {
                model: InvoiceItems,
                as: 'invoiceItem',
                attributes: ['id', 'matInQnt', 'availability', 'priceIn', 'task_related', 'rfm_related']
            }
        }]
        console.log('Find InvoiceItems');
    }
    try {
        let invoices = await Invoice.findAll(param);
        result.invoices = invoices;

        return res.status(201).send(result);
    } catch (e) {
        console.log(e)
        result.err = e;
        return res.status(299).send(result);
    }
}

const update = async (req, res) => {
    console.log("Update for Invoice");
    let response = {};
    let data = req.body.data;
    console.log(data)
    if (data.invoiceId) {
        try {
            console.log(data.updateColumn);
            await Invoice.update(
                data.updateColumn,
                { where: { id: data.invoiceId } }
            )
            response.msg = "Updated";
            return res.status(201).send(response);
        } catch (e) {
            response.msg = e.original.sqlMessage;
            response.err = true;
            console.log(response.msg);
            return res.status(299).send(response);
        }
    }
    response.msg = "Pws Sto Diaolo Egine Auto";
    return res.status(400).send(response);
}

const updateInvoiceItem = async (req, res) => {
    console.log("Update for InvoiceItem");
    let response = {};
    let data = req.body.data;
    console.log(data);
    if (data.id) {
        try {
            console.log(data.id);
            await InvoiceItems.update(
                data.updateColumn,
                { where: { id: data.id } }
            )
            response.msg = "Updated"
            return res.status(201).send(response);
        } catch (e) {
            response.msg = e.original.sqlMessage;
            response.err = true;
            console.log(response.msg);
            return res.status(299).send(response);
        }
    }
    response.msg = "Pws Sto Diaolo Egine Auto";
    return res.status(400).send(response);
}

const deleteInvoice = async (req, res) => {
    console.log("DELETE INVOICE")
    let response = {};
    let data = req.params;
    if (data.invoiceId) {
        console.log(data.invoiceId);
        try {
            console.log('Find InvoiceItems Before Deleting to Update Stock');
            let invoiceItems = await InvoiceItems.findAll({where: { invoiceId: data.invoiceId}});
            
            // console.log(invoiceItems);
            let item = {};
            for (let i = 0; i< invoiceItems.length; i++) {
                console.log("AtcorId", invoiceItems[i].itemId);
                console.log("MatInQnt", invoiceItems[i].matInQnt);
                item = await Item.findOne({where : { atcorId: invoiceItems[i].itemId }});
                console.log("Name", item.name);
                console.log("Before totalStock", item.totalStock);
                item.totalStock = item.totalStock - invoiceItems[i].matInQnt;
                await item.save();
                console.log("After totalStock", item.totalStock);
            }
            
            await Invoice.destroy(
                { where: { id: data.invoiceId } }
            )
            response.msg = "Deleted Invoice and it's Items. Stock is Updated. \n If you created a new Warehouse Item by a mistake, please delete it.\n\n"
            return res.status(201).send(response);
        } catch (e) {
            response.msg = e.original.sqlMessage;
            response.err = true;
            console.log(response.msg);
            return res.status(299).send(response);
        }
    }
    response.msg = "Pws Sto Diaolo Egine Auto";
    return res.status(400).send(response);
}

module.exports = {
    create,
    createInvoiceItems,
    find,
    update,
    updateInvoiceItem,
    deleteInvoice
}



// const _insertInvoiceItems = async (data) => {
//     const invoiceId = data.invoiceId;

//     let log = await Promise.all(data.items.map(async (r) => {
//         // console.log("InvoiceItem", r);
//         let results = { item: { name: r.name, assigned: false, created: false } };
//         try {
//             let trans = await sequelize.transaction();
//             let param = {};
//             param.where = {
//                 name: r.name,
//                 nsn: r.nsn,
//                 unit: r.unit
//             }

//             let [item, created] = await Item.findOrCreate(param, {trans});
//             results.item.created = created;
//             results.item.name = item.name; //log
//             if (created) {
//                 item.totalStock = r.matInQnt;
//             } else {
//                 console.log("Prin TotalStock", item.totalStock)
//                 item.totalStock = item.totalStock + r.matInQnt;
//                 console.log("Meta TotalStock", item.totalStock)
//             }

//             param = r;
//             param.itemId = item.atcorId;
//             param.invoiceId = invoiceId;
//             param.availability = r.matInQnt;
//             if (item) {
//                 await InvoiceItems.create(
//                     param, {trans}
//                 );
//             }
//             await item.save();
//             await trans.commit();
//             results.item.assigned = true; //log
//         } catch (err) {
//            await trans.rollback();
//             console.log(err.original.sqlMessage)
//             console.log("ERRORRR")
//         } finally {
//             return results;
//         }
//     }))

//     return log;
// }