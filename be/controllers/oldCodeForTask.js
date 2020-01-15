// const System = require("../models").System;
// const Task = require("../models").Task;
// const Product = require("../models").Product;
// const TaskProducts = require("../models").TaskProducts;

const _insertSystemsTasks = async (data) => {
    let log = await Promise.all(data.map(async (r) => {
        let sysName = r.sysName;
        let taskName = r.taskName;
        let endItem = r.endItem;

        console.log(sysName, taskName, endItem);
        let results = { system: { name: "", created: false }, task: { name: "", created: false } };
        try {
            let [sys, created] = await System.findOrCreate({ where: { name: sysName } });

            let out;
            let sysid = sys.id;
            if (created) {
                out = "Saved";
            } else {
                out = "Already Exists";
            }
            results.system.created = created;
            results.system.name = sysName;

            console.log('System with id' + sysid + ' ' + out);

            await Task.create({
                name: taskName,
                systemId: sysid,
                endItem: endItem
            });
            results.task.created = true;
            results.task.name = taskName;

        } catch (err) {
            console.log(" Task Duplicate Error");
            results.task.created = false;
            results.task.name = taskName;

            //res.status(400).send("One of the elements didnt do a shiat");
        } finally {
            return results;
        }
    })

    )
    return log;
}

//This is used for Inserting Data into our Database from an excel or csv file
// OR
//To create new System_Task in app and insert to db
const create = async (req, res) => {
    console.log("Create Systems_Tasks");
    let response = {};

    let data = req.body.data;
    let result = await _insertSystemsTasks(data);
    let output = result.filter(r => {
        if (r.task.created === false) {
            return r.task.name;
        }
    })
    if (output.length == 0) {
        response.err = 0;
    } else {
        response.err = 1;
        response.data = output;
    }
    return await res.status(201).send(response);
}

const find = async (req, res) => {
    console.log("FindAll Systems_Tasks");
    let response = {};
    let data = req.params.name;

    console.log("name: ", data);
    let param = {
        include: [{
            model: System,
            as: 'system'
        },
        {
            model: Product,
            as: 'products',
            required: false,
            attributes: ['id', 'name', 'stock', 'nsn'],
            through: {
                model: TaskProducts,
                as: 'taskProducts',
                attributes: ['requestedQTY']
            }
        }]
    }
    if (data) {
        param.where = { name: data }
    }
    let tasks = await Task.findAll(param);
    return res.status(201).send(tasks);
}
/**
 * For Updating System of a Task: 
 *          sysName and taskName
 * For Updating Task:
 *          taskName and endItem?
 */
const update = async (req, res) => {
    console.log("Update System_Task");
    console.log(req.body.data);
    let response = {};
    let data = req.body.data;
    try {
        if (data.updateTask.sysName) { //Update or Create System Name for a Task
            let [sys, created] = await System.findOrCreate({ where: { name: data.update.sysName } });
            response.created = created;
            if (created) {
                response.msg = "A new System is created";   
            }
            let task = await Task.findOne({ where: { name: data.name } });
            task.systemId = sys.id;
            task.save();
        } else { //Update Task
            let task = await Task.update(
                data.updateTask,
                { where: { name : data.name} }
            );
        }
    } catch (e) {
        console.log(e.original.sqlMessage);
        return res.status(400).send(e.original.sqlMessage);
    }
    return res.status(201).send(response);
}

// module.exports = {
//     create,
//     find,
//     update
// }