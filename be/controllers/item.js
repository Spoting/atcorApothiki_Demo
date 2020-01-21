const Sequelize = require('sequelize');
const op = Sequelize.Op;

const fs = require('fs');
const Item = require("../models").Item;
const Invoice = require("../models").Invoice;
const InvoiceItems = require("../models").InvoiceItems;

let leftFillNum = (num, targetLength) => {
    return num.toString().padStart(6, 0);
}

const create = async (req, res) => {
    console.log('Create Item');
    let result = {};
    let data = req.body.data;
    console.log("data", data)
    try {
        let item = await Item.create(data);
        // let no = parseInt(item.atcordId);
        let no = leftFillNum(item.atcorId);
        item.atcorNo = leftFillNum(no);
        let i = await item.save();
        // console.log("meta to save",i)
        result.atcorId = item.atcorId;
        result.atcorNo = i.atcorNo;
        result.msg = "Inserted Successfully";
        return res.status(201).send(result);
    } catch (e) {
        console.log("ERROR ITEM CREEEEATE", e);
        result.err = e.original.sqlMessage;
        return res.status(299).send(result);
    }
}

const find = async (req, res) => {
    console.log('Find Item(s)');
    let result = {};
    let data = req.params;
    console.log("Find Items params", data);
    let param = {};
    // param.limit = 20;
    if (data.id) {
        // param.attributes = ['atcorId', 'name', 'nsn', 'measurement'], //edw
        param.where = { atcorId: data.id }
    }
    if (data.nsn) {
        param.where = { nsn: data.nsn }
        console.log("MESA STON nsn")
    }
    if (data.name) {
        console.log("MESA STON name")
        param.where = {
            name: data.name
            // name: { [op.like]:  data.name + '%' }
        }
    }
    if (data.name && data.PN) {
        console.log("MESA STO PN")
        param.where = {
            name: data.name,
            PN: data.PN
        }
    }
    if (data.atcorPN) {
        console.log("MESA STO atcorPN")
        param.where = {
            atcorPN: data.atcorPN
        }
    }


    try {
        let items = await Item.findAll(param);
        if (data.name && items.length > 1) {
            items.map(i => console.log("Otan ginei Find By name/ ", i.name, i.nsn, i.atcorPN));
            let x = items.filter(i => {
                if (i.nsn === null && i.atcorPN === null) {
                    return i;
                }
            })
            x.map(x => console.log("Mono ", x.name, x.atcorNo));
            result.items = x;
        } else {
            result.items = items;
        }
        console.log(result.items[0].name + result.items[0].PN);
        return res.status(201).send(result);
    } catch (e) {
        result.err = e;
        return res.status(299).send(result);
    }
}

const findItemInvoices = async (req, res) => {
    console.log('Find ItemInvoices');
    let result = {};
    let data = req.params;
    console.log(data);
    let param = {};

    if (data.id) {
        param.attributes = ['atcorId', 'atcorNo', 'name'];
        param.where = { atcorId: data.id };
        param.include = [{
            model: Invoice,
            as: 'invoices',
            attributes: ['invoice', 'remark', 'matInDate', 'supplier'],
            through: {
                model: InvoiceItems,
                as: 'invoiceItems',
                attributes: ['id', 'matInQnt', 'availability', 'priceIn', 'rfm_related', 'task_related']
            }
        }]
    }
    if (data.checkout){
        console.log("Kalo Pragma");
        param.attributes = ['atcorId', 'atcorNo', 'name'];
        param.where = { atcorId: data.id };
        param.include = [{
            model: Invoice,
            as: 'invoices',
            attributes: ['invoice', 'remark', 'matInDate', 'supplier'],
            through: {
                model: InvoiceItems,
                as: 'invoiceItems',
                attributes: ['id', 'matInQnt', 'availability', 'priceIn', 'rfm_related', 'task_related'],
                where: { availability: {[op.gt] : 0 } }
            }
        }]
    }

    try {
        let items = await Item.findAll(param);

        // await items.map((i) => {
        //     console.log(i.atcorId);
        //     x = leftFillNum(i.atcorId, 6);
        //     console.log(x);
        //     i.atcorId = x;
        //     console.log(i.atcorId);
        // }) 
        result.items = items;
        return res.status(201).send(result);
    } catch (e) {
        result.err = e;
        return res.status(299).send(result);
    }
}


//Probably will be called alone through a route.
//< When click column, call /api/getImgs/:atcor_apou_no, then serve Imgs to FE >
const getItemImages = (req, res) => {
    let atcor_apou_no = req.params.id;
    console.log(atcor_apou_no);
    let no = leftFillNum(atcor_apou_no);
    atcor_apou_no = leftFillNum(no);
    console.log("After fill", atcor_apou_no)
    let response = {}
    fs.readdir('./imgs', (err, items) => {
        if (err) {
            console.log("ERROR:", err)
            return;
        }
        let counter = 0;
        let productImgs = [];
        for (let i=0; i<items.length; i++) {
            if (counter===3) {
                break;
            }
            let x = items[i].substring(14, 20);
            if ( x === atcor_apou_no ) {
                console.log("Found Image", i);
                counter++;
                // return i;
                productImgs.push(items[i]);
            }
        }
        // let productImgs = items.filter(i => {
        //     if (counter===3) {
        //         return;
        //     }
        //     // i = i.slice(0, -6);
        //     // i = i.slice(0, 13);
        //     let x = i.substring(14, 20);
        //     // console.log("Telika to x", x);
        //     // let found = i.contains((x) => atcor_apou_no == x);
        //     if ( x === atcor_apou_no ) {
        //         console.log("Found Image", i);
        //         counter++;
        //         return i;
        //     }
        // })
        // return
        // let productImgs = items.filter(i => {
        //     i = i.slice(0, -4);
        //     let splarr = i.split('\_');
        //     let found = splarr.find((x) => atcor_apou_no == x);
        //     if (found) {
        //         console.log("Found Image", found);
        //         return i;
        //     }
        // })
        console.log(productImgs);
        response.data = productImgs;

        console.log("resp", response)
        return res.status(201).send(response);
    })
}


const update = async (req, res) => {
    console.log("Update for Product");
    let response = {};
    let data = req.body.data;
    console.log(data)
    if (data.atcorId) {
        try {
            let x = Object.keys(data.updateColumn);
            console.log(x);
            if (x[0] === "atcorPN") {
                if (data.updateColumn.atcorPN === '' || data.updateColumn.atcorPN === ' ') {
                    // response.msg = "AtcorPN cannot be empty"
                    // response.err = true;
                    // throw new Error;
                    data.updateColumn.atcorPN = null;
                }
            }
            if (x[0] === "nsn") {
                if (data.updateColumn.nsn === '' || data.updateColumn.nsn === ' ') {
                    // response.msg = "NSN cannot be empty"
                    // response.err = true;
                    // throw new Error;
                    data.updateColumn.nsn = null;
                }
            }
            console.log(data.updateColumn);
            await Item.update(
                data.updateColumn,
                { where: { atcorId: data.atcorId } }
            )
            response.msg = "Updated"
            return res.status(201).send(response);
        } catch (e) {
            if (e.original) {
                response.msg = e.original.sqlMessage;
                response.err = true;
            }
            console.log(response.msg);
            return res.status(299).send(response);
        }
    }
    response.msg = "Kati egine poli la8os";
    return res.status(400).send(response);
}

const deleteItem = async (req, res) => {
    console.log('Delete Item');
    let result = {};
    let data = req.params;
    console.log("data", data)
    if (data.id) {
        try {
            await Item.destroy({ where: { atcorId: data.id } });
            result.msg = "Deleted Successfully";
            return res.status(201).send(result);
        } catch (e) {
            console.log("ERROR ITEM Delete", e);
            result.err = e.original.sqlMessage;
            return res.status(299).send(result);
        }
    }
    console.log("giganteo la8os")
}

module.exports = {
    create,
    find,
    getItemImages,
    update,
    findItemInvoices,
    deleteItem
}


/**
 *         // let productImgs = items.filter(i => {
        //     if (counter===3) {
        //         return;
        //     }
        //     // i = i.slice(0, -6);
        //     // i = i.slice(0, 13);
        //     let x = i.substring(14, 20);
        //     // console.log("Telika to x", x);
        //     // let found = i.contains((x) => atcor_apou_no == x);
        //     if ( x === atcor_apou_no ) {
        //         console.log("Found Image", i);
        //         counter++;
        //         return i;
        //     }
        // })
 */