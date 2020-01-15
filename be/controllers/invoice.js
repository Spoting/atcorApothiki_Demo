

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
    // console.log("Data", data);
    let results = await _insertInvoiceItems(data);
    // console.log("Output after Insert", results);
    let output = results.filter(r => {
        console.log(r);
        if (r.item.assigned === false) {
            if (r.item.name === "") {
                console.log("gamw");
                r.item.name = "Υπάρχει Κενό Όνομα";
            }
            return r.item.name;
        }
    })
    console.log(output);
    if (output.length === 0) {
        response.err = 0;
        response.msg = "Successfully Updated/Created all Items";
    } else {
        response.err = 1;
        response.msg = "Invoice Items were not created. The rest are created successfully";
        response.data = output;
    }
    return await res.status(201).send(response);
}

const _insertInvoiceItems = async (data) => {
    const invoiceId = data.invoiceId;

    let log = await Promise.all(data.items.map(async (r) => {
        // console.log("InvoiceItem", r);
        let results = { item: { name: r.name, assigned: false, created: false } };
        try {
            let param = {};
            if (r.nsn) {
                param.where = {
                    name: r.name,
                    nsn: r.nsn,
                    unit: r.unit
                }
            }
            param.where = {
                name: r.name,
                unit: r.unit
            }

            let [item, created] = await Item.findOrCreate(param);
            results.item.created = created;
            results.item.name = item.name; //log
            if (created) {
                item.totalStock = r.matInQnt;
            } else {
                console.log("Prin TotalStock", item.totalStock)
                item.totalStock = item.totalStock + r.matInQnt;
                console.log("Meta TotalStock", item.totalStock)
            }

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
            console.log(err.original.sqlMessage)
            console.log("ERRORRR")
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
            attributes: ['atcorId', 'atcorNo', 'name', 'nsn', 'unit'],
            through: {
                model: InvoiceItems,
                as: 'invoiceItem',
                attributes: ['id', 'matInQnt', 'availability', 'priceIn', 'task_related', 'rfm_related', "PN", "atcorPN"]
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
    if (data.invoice) {
        try {
            console.log(data.updateColumn);
            await InvoiceItems.update(
                data.updateColumn,
                { where: { invoice: data.invoice } }
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

module.exports = {
    create,
    createInvoiceItems,
    find,
    update,
    updateInvoiceItem
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