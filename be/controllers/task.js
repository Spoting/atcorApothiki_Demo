// const db = require ('../models').db;
//TODO: Put transaction in createItemMovement
const Task = require("../models").Task;
const TaskItems = require("../models").TaskItems;
const Item = require("../models").Item;
const ItemMvt = require("../models").TaskItemMovements;
const InvoiceItems = require("../models").InvoiceItems;

const create = async (req, res) => {
    console.log("Create Task");
    let result = {};
    let data = req.body;
    console.log(req.body);
    console.log(data.data.taskName);
    try {
        let task = await Task.create(data.data);
        result = task;
        result.msg = "Inserted Successfully";

        return res.status(201).send(result);
    } catch (e) {
        console.log(e);
        result.err = e.original.sqlMessage;
        return res.status(400).send(result);
    }
}

const createTaskItems = async (req, res) => {
    console.log("Assign Item(s) to Task");
    let response = {};
    let data = req.body.data;
    console.log("Data", data);
    let results = await _insertTaskItems(data);
    console.log(results);
    let output = results.filter(r => {
        if (r.item.assigned === false) {
            return r.item.name;
        }
    })
    if (output.length == 0) {
        response.err = 0;
        response.msg = "Successfully Assigned all Items to Task";
    } else {
        response.err = 1;
        response.msg = "Already Assigned. The rest are assigned successfully";
        response.data = output;
    }
    return await res.status(201).send(response);
}

const _insertTaskItems = async (data) => {
    const taskId = data.taskId;
    
    let log = await Promise.all(data.items.map(async (r) => {
        console.log("Item", r);
        let results = { item: { name: r, assigned: false } };
        try {
            let param = {
                atcorId: r
            }
            let item = await Item.findOne({
                where: param
            });
            results.item.name = item.name;
            if (item) {
                let taskItem = await TaskItems.create({
                    taskId: taskId,
                    itemId: r,
                    totalMatOut: 0,
                    totalMatRet: 0
                });
                if (data.invoiceId > 0) {
                    console.log("Update TaskRelated of InvoiceItem", data.invoiceId, data.taskName);
                    await InvoiceItems.update(
                        {task_related: data.taskName},
                        { where: { invoiceId: data.invoiceId, itemId: r } }
                    )
                }

            }
            
            results.item.assigned = true;
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
    console.log("Find Task");
    let result = {};
    let data = req.params.name;

    let param = {};
    param.where = { completed: 0 };
    if (data) {
        if (data === "-1") {
            param.where = {};
        } else {
            param.attributes = {};
            // param.where = { taskName: data }
            param.where = { id: data };
            param.include = [{
                model: Item,
                as: 'items',
                attributes: ['atcorId', 'atcorNo', 'name', 'totalStock'],
                through: {
                    model: TaskItems,
                    as: 'taskItems',
                    attributes: ['id', 'totalMatOut', 'totalMatRet']
                }
            }]
        }
    }
    try {
        let tasks = await Task.findAll(param);
        result.tasks = tasks;
        result.tasks.map((t) => {
            if (!t.completed) {
                t.completed = "no"
            } else {
                t.completed = "yes"
            }
        })
        // console.log("Niaou vre gatouli",tasks[0].items[0])
        // console.log("AAA",tasks);
        return res.status(201).send(result);
    } catch (e) {
        result.err = e;
        console.log(e);
        return res.status(400).send(result);
    }
}

const createTaskItemMovement = async (req, res) => {
    console.log("Create TaskItem Mvt");
    let result = {};
    let data = req.body.data;
    console.log("Data", data);
    let paramTaskItem = {};
    let paramItemMvt = {};
    let transaction;
    try {
        //taskItemId <- table.TaskItems <= taskId, itemId , isOut: true/false (false=matRet, true=matOut), date 
       
        paramTaskItem.where = { id: data.id }
        let foundTaskItem = await TaskItems.findOne(paramTaskItem);
        // console.log("FOUNDTASKITEM", foundTaskItem.totalMatOut);
        if (data.isOut) {
            paramItemMvt.matOut = data.value;
            paramItemMvt.matRet = 0;
        } else {
            paramItemMvt.matRet = data.value;
            paramItemMvt.matOut = 0;
        }
        paramItemMvt.taskItemId = foundTaskItem.id;
        paramItemMvt.matActionDate = data.matActionDate;
        let results = await ItemMvt.create(paramItemMvt);
        let itemId = foundTaskItem.itemId;
        let item = await Item.findOne({where: { atcorId: itemId}})
        //update totalOut:
        if (results.id) {
            if (data.isOut) {
                foundTaskItem.totalMatOut = foundTaskItem.totalMatOut + results.matOut;
                item.totalStock = item.totalStock - results.matOut;
            } else {
                foundTaskItem.totalMatRet = foundTaskItem.totalMatRet + results.matRet;
                // foundTaskItem.totalMatOut = foundTaskItem.totalMatOut - results.matReturn;
                item.totalStock = item.totalStock + results.matRet;
            }
            await foundTaskItem.save();
            await item.save();
        }
        result.msg = "Inserted Successfully"
        // console.log(results);
    } catch (e) {
        console.log(e);
        result.err = true;
        result.msg = e.original.sqlMessage;
        return res.status(400).send(result);
    }
    return await res.status(201).send(result);
}

const findTaskItemMovement = async (req, res) => {
    console.log("Find TaskItemMovement");
    let result = {};
    let data = req.params;
    let param = {};
    // param.where = { completed: 0 };
    // if (data) {
    //     // param.attributes = [];
    //     param.where = { taskId: data.taskId }
    // }
    param.where = { taskItemId: data.taskItemId};
    param.order = [['matActionDate', 'DESC']];
    try {
        // let task = await Task.findOne(param);
        // let taskItem = await TaskItems.findOne({ where: { taskId: task.id, itemId: data.itemId } });
        let taskItemMvts = await ItemMvt.findAll(param);
        
        return res.status(201).send(taskItemMvts);
    } catch (e) {
        result.err = e;
        console.log(e);
        return res.status(400).send(result);
    }
}


const update = async (req, res) => {
    console.log("Update for Task");
    let response = {};
    let data = req.body.data;
    console.log(data)
    if (data.id) {
        try {
            console.log(data.updateColumn);
            await Task.update(
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

module.exports = {
    create,
    find,
    createTaskItems,
    createTaskItemMovement,
    findTaskItemMovement,
    update
}



