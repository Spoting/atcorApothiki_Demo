// const fs = require('fs');
// //Models
// const Product = require("../models").Product;
// const Task = require("../models").Task;
// const TaskProducts = require("../models").TaskProducts;

const _insertProducts = async (data) => {
    let log = await Promise.all(data.map(async (r) => {
        console.log("Skata", r);
        let results = { product: { name: "", created: false } };
        try {
            let param = {
                name: r.name,
                NSN: r.nsn,
                stock: r.stock
            }
            if (r.atcor_apou_no) {
                param.id = r.atcor_apou_no
            }
            let [product, created] = await Product.findOrCreate({
                where: param
            });
            results.product.created = created;
            results.product.name = product.name;

            if (r.taskName && r.requestQnt) {
                let task = await Task.findOne({ where: { name: r.taskName } });
                console.log(task);
                let taskproduct = await TaskProducts.create({
                    taskId: task.id,
                    productId: product.id,
                    requestedQTY: r.requestQnt
                });
            }
        } catch (err) {
            console.log(err)
            console.log("ERRORRR")
        } finally {
            return results;
        }
    }))
    return log;
}


//This is used for Inserting Data into our Database from an excel or csv file
// OR
//To create new Product in app and insert to db
const create = async (req, res) => {
    console.log("Create Products");
    let response = {};

    let data = req.body.data;
    let result = await _insertProducts(data);
    let output = result.filter(r => {
        if (r.product.created === false) {
            return r.product.name;
        }
    })
    if (output.length == 0) {
        response.err = 0;
        response.msg = "Everything Good";
    } else {
        response.err = 1;
        response.msg = "Lefted out cause of Duplication";
        response.data = output;
    }
    return await res.status(201).send(response);
}

//Remember to fix this 
const find = async (req, res) => {
    console.log("FindAll Products + Plus Joins");
    let response = {};
    let data = req.params.id;

    console.log("id: ", data);
    let param = {
        // include: [{
        //     model: Task,
        //     as: 'tasks',
        //     required: false,
        //     // Pass in the Product attributes that you want to retrieve
        //     attributes: ['id', 'name'],
        //     through: {
        //         // This block of code allows you to retrieve the properties of the join table
        //         model: TaskProducts,
        //         as: 'taskProducts',
        //         attributes: ['requestedQTY'],
        //     }
        // }]
    }
    if (data) {
        param.where = { id: data }
        //_getProductImages(data);
    }
    let products = await Product.findAll(param);
    response.products = products;
    return res.status(201).send(response);
}

const update = async (req, res) => {
    console.log("Update for Product");
    let response = {};
    let data = req.body.data;
    if (data.id) {
        try {
            console.log(data.updateProduct);
            await Product.update(
                data.updateProduct,
                { where: { id: data.id } }
            )
            response.msg = "Updated"
        } catch (e) {
            response.msg = e.original.sqlMessage;
            response.err = true;
            console.log(response.msg);
            return res.status(400).send(response);
        }
    }
    return res.status(201).send(response);
}

const assign = async (req, res) => {
    console.log("Assign for Product");
    let response = {};
    let data = req.body.data;

    try {
        let task = await Task.findOne({ where: { name: data.taskName } });
        await TaskProducts.create({
            taskId: task.id,
            productId: data.productId
        })
        response.msg = "Assigned Successfully";
    } catch (e) {
        response.msg = e.original.sqlMessage;
        response.err = true;
        console.log(response.msg);
        return res.status(400).send(response);
    }
    return res.status(201).send(response);
}

const unassign = async (req, res) => {
    console.log("Unassign for Product");
    let response = {};
    let data = req.body.data;

    try {
        let task = await Task.findOne({ where: { name: data.taskName } });
        await TaskProducts.destroy({
            where: {
                taskId: task.id,
                productId: data.productId
            }
        });
    } catch (e) {
        response.msg = e.original.sqlMessage;
        response.err = true;
        console.log(response.msg);
        return res.status(400).send(response);
    }
    return res.status(201).send(response);
}

// Task.create({ sysName: 'sys1', taskName: 'task1', endItem: 'endItem1' })
//             .then((task) => {
//                 RFM.create({ code: 'xxx1' })
//                     .then(rfm => {
//                         task.setRFMs(rfm)
//                         Item.create({ name: 'antikeimeno1' })
//                         Item.create({ name: 'antikeimeno2' })
//                             .then((t) => {
//                                 // RFMItems.create({ rfmId: rfm.id, itemId: t.id, reqQnt: 40 })
//                                 //     .then((rfmItem) => console.log(rfmItem.reqQnt))
//                                 // RFMItems.create({ reqQnt: 40 })
//                                 //     .then((rfmItem) => {
//                                 //         t.set
//                                 //     })
//                                 t.RFMItems = { reqQnt: 40 };
//                                 rfm.setItems([t]);
//                             })
//                     })
//             });
//         // RFM.create({ code: 'xxx1', taskId: 1 })


// module.exports = {
//     create,
//     find,
//     update,
//     assign,
//     unassign,
//     getProductImages
// }