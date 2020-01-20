const itemController = require("../controllers").item;
const taskController = require("../controllers").task;
const invoiceController = require("../controllers").invoice;

module.exports = (app) => {
    app.get("/api", (req, res) => {
        res.status(200).send({
            message: "Welcome QQ"
        });
    }),
        /**
         * Routes for: 
         * System_Task
         */

        // //Create Task
        app.post("/api/task/create", (req, res) => {
            taskController.create(req, res);
        }),
        // //Find Tasks or TaskItems
        app.get("/api/task/find/:name?", (req, res) => {
            taskController.find(req, res);
        }),
        //Update Task
        app.post("/api/task/update", (req, res) => {
            taskController.update(req, res);
        }),
        //Create  TaskItems to Task
        app.post("/api/task/createTaskItems", (req, res) => {
            taskController.createTaskItems(req, res);
        }),
        //Create TaskItemMovement (also update taskItems)
        app.post("/api/task/createItemMvt", (req, res) => {
            taskController.createTaskItemMovement(req, res);
        }),
        //Find TaskItemMovenet 
        app.get("/api/task/findItemMvt/:taskId?/:taskItemId?", (req, res) => {
            taskController.findTaskItemMovement(req, res);
        }),
        /**
         * Routes for:
         * Item
         */
        app.post("/api/item/create", (req, res) => {
            itemController.create(req, res);
        }),
        app.get("/api/item/find/:id?", (req, res) => {
            itemController.find(req, res);
        }),
        app.get("/api/item/findByName/:name?/:PN?", (req, res) => {
            itemController.find(req, res);
        }),
        app.get("/api/item/findByNSN/:nsn?", (req, res) => {
            itemController.find(req, res);
        }),
        app.get("/api/item/findInvoices/:id?", (req, res) => {
            itemController.findItemInvoices(req, res);
        }),
        app.post("/api/item/update", (req, res) => {
            itemController.update(req, res);
        }),
        app.get("/api/item/images/:id?", (req, res) => {
            itemController.getItemImages(req, res);
        }),

        /**
        * Routes for:
        * Invoices
        */
        app.get("/api/invoice/find/:name?", (req, res) => {
            invoiceController.find(req, res);
        }),
        app.post("/api/invoice/create", (req, res) => {
            invoiceController.create(req, res);
        }),
        app.post("/api/invoice/items/create", (req, res) => {
            invoiceController.createInvoiceItems(req, res);
        }),
        app.post("/api/invoice/update", (req, res) => {
            invoiceController.update(req, res);
        }),
        app.post("/api/invoice/item/update", (req, res) => {
            invoiceController.updateInvoiceItem(req, res);
        })
}