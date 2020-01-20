const url = "http://localhost:8000/api/"

const ApiItems = {

    createItem: async function (newRow) {
        try {
            let response = await fetch(url + "item/create",
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        data: newRow
                    })
                });
            if (response.ok) {
                let jsonResp = await response.json();

                // console.log(jsonResp);
                return jsonResp;
            }
        } catch (e) {
            console.log(e);
        }
    },
    getItems: async function (i) {
        let call = url + "item/find";
        if (i) {
            call = url + "item/find/" + i;
        }
        try {
            let response = await fetch(call)
            if (response.ok) {
                let jsonResp = await response.json();
                // console.log(jsonResp);
                return jsonResp;
            }
        } catch (e) {
            console.log(e);
        }
    },
    getItemByAtcorPN: async function (i) {
        let call = url + "item/findByAtcorPN/";
        if (i) {
            call = url + "item/findByAtcorPN/" + i;
        }
        try {
            let response = await fetch(call)
            if (response.ok) {
                let jsonResp = await response.json();
                // console.log(jsonResp);
                return jsonResp;
            }
        } catch (e) {
            console.log(e);
        }
    },
    getItemByNsn: async function (i) {
        let call = url + "item/findByNSN";
        if (i) {
            call = url + "item/findByNSN/" + i;
        }
        try {
            let response = await fetch(call)
            if (response.ok) {
                let jsonResp = await response.json();
                // console.log(jsonResp);
                return jsonResp;
            }
        } catch (e) {
            console.log(e);
        }
    },
    getItemByName: async function (i, PN) {
        console.log("API ")
        let call = url + "item/findByName";
        if (i) {
            call = url + "item/findByName/" + i;
            if (PN) {
                call = url + "item/findByName/" + i + "/" + PN;
            }
        }
        
        try {
            let response = await fetch(call)
            if (response.ok) {
                let jsonResp = await response.json();
                // console.log(jsonResp);
                console.log("Find By Name", jsonResp);
                return jsonResp;
            }
        } catch (e) {
            console.log(e);
        }
    },
    getImages: async function (i) {
        try {
            console.log(url + "item/images/" + i);
            let response = await fetch(url + "item/images/" + i);
            if (response.ok) {
                let jsonResp = await response.json();

                // console.log(jsonResp);
                return jsonResp;
            }
        } catch (e) {
            console.log(e);
        }
    },
    updateItem: async function (atcorId, columnToUpdate) {
        try {
            // let atcordIdInt = parseInt(atcorId);
            // console.log(url + "item/images/" + i);
            let response = await fetch(url + "item/update",
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        data: {
                            atcorId: atcorId,
                            updateColumn: columnToUpdate,
                        }
                    })
                });
            if (response.ok) {
                let jsonResp = await response.json();

                // console.log(jsonResp);
                return jsonResp;
            }
        } catch (e) {
            console.log(e);
        }
    },
    getItemInvoices: async function (id) {
        let call;
        // if (id) {
        //     call = url + "item/find/" + id;
        // }
        if (id) {
            call = url + "item/findInvoices/" + id;
        }
        
        try {
            let response = await fetch(call);
            if (response.ok) {
                let jsonResp = await response.json();

                // console.log(jsonResp);
                return jsonResp;
            }
        } catch (e) {
            console.log(e);
        }
    }
}

const ApiTasks = {
    getTasks: async function (findCompleted) {
        try {
            let api = url + "task/find"
            if (findCompleted) {
                api = api + "/" + -1
            } 
            let response = await fetch(api);
            if (response.ok) {
                let jsonResp = await response.json();

                console.log(jsonResp);
                return jsonResp;
            }
        } catch (e) {
            console.log(e);
        }
    },
    getTaskItems: async function (taskName) {
        try {
            let response = await fetch(url + "task/find/" + taskName);
            if (response.ok) {
                let jsonResp = await response.json();
                // console.log(jsonResp);
                return jsonResp;
            }
        } catch (e) {
            console.log(e);
        }
    },
    getTaskItemMvts: async function (taskId ,taskItemId) {
        try {
            let response = await fetch(url + "task/findItemMvt/" + taskId +"/" + taskItemId);
            if (response.ok) {
                let jsonResp = await response.json();
                // console.log(jsonResp);
                return jsonResp;
            }
        } catch (e) {
            console.log(e);
        }
    },
    createTask: async function (newRow) {
        console.log("createTask", newRow)
        try {
            let response = await fetch(url + "task/create",
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        data: newRow
                    })
                });
            if (response.ok) {
                let jsonResp = await response.json();

                // console.log(jsonResp);
                return jsonResp;
            }
        } catch (e) {
            console.log(e);
        }
    },
    createTaskItems: async function (taskId, atcorIds, invoiceId=0, taskName) {
        try {
            let response = await fetch(url + "task/createTaskItems",
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        data: {
                            taskId: taskId,
                            invoiceId: invoiceId,
                            items: atcorIds,
                            taskName: taskName
                        }
                    })
                });
            if (response.ok) {
                let jsonResp = await response.json();

                // console.log(jsonResp);
                return jsonResp;
            }
        } catch (e) {
            console.log(e);
        }
    },
    createTaskItemMvt: async function (id, isOut, value, matActionDate) {
        try {
            let response = await fetch(url + "task/createItemMvt",
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        data: {
                            id: id,
                            isOut: isOut,
                            value: value,
                            matActionDate: matActionDate
                        }
                    })
                });
            if (response.ok) {
                let jsonResp = await response.json();

                // console.log(jsonResp);
                return jsonResp;
            }
        } catch (e) {
            console.log(e);
        }
    },
    updateTask: async function (taskId, columnToUpdate) {
        console.log("updateTask", taskId, columnToUpdate)
        try {
            // let atcordIdInt = parseInt(atcorId);
            // console.log(url + "item/images/" + i);
            let response = await fetch(url + "task/update",
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        data: {
                            id: taskId,
                            updateColumn: columnToUpdate,
                        }
                    })
                });
            if (response.ok) {
                let jsonResp = await response.json();

                // console.log(jsonResp);
                return jsonResp;
            }
        } catch (e) {
            console.log(e);
        }
    },
    // /api/task/findItemMvt/:taskName?/:itemId?
    
    // getTaskItemMvnts: async function (taskName, itemId) {
    //     try {
    //         let response = await fetch(url + "task/findItemMvt/" + taskName + "/"+ itemId)
    //         if (response.ok) {
    //             let jsonResp = await response.json();
    //             console.log("json", jsonResp);
    //             return jsonResp;
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     }
    // },
}
const ApiInvoices = {
    getInvoices: async function () {
        try {
            let response = await fetch(url + "invoice/find")
            if (response.ok) {
                let jsonResp = await response.json();
                console.log("json", jsonResp);
                return jsonResp;
            }
        } catch (e) {
            console.log(e);
        }
    },
    getInvoiceItems: async function (invoice) {
        console.log(url + "invoice/find/" + invoice)
        try {
            let response = await fetch(url + "invoice/find/" + invoice)
            if (response.ok) {
                let jsonResp = await response.json();
                console.log("Des",jsonResp);
                return jsonResp;
            }
        } catch (e) {
            console.log(e);
        }
    },
    createInvoice: async function (row) {
        try {                                    
            let response = await fetch(url + "invoice/create",
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        data: {
                            row
                        }
                    })
                });
            if (response.ok) {
                let jsonResp = await response.json();

                // console.log(jsonResp);
                return jsonResp;
            }
        } catch (e) {
            console.log(e);
        }
    },
    /**
 * 
 * @param {JSON} data 
 * json = { data: {
 *      invoiceId: int,
 *      items: [
 *          {   atcorId,
 *              matInQnt,
 *              priceIn,
 *              availability
 *          }, ...
 *      ]
 * }
 * }
 */
    createInvoiceItems: async function (invoiceId, items) {
        console.log("OUT", invoiceId, items)
        try {
            let response = await fetch(url + "invoice/items/create",
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        data: {
                            invoiceId: invoiceId,
                            items: items
                        }
                    })
                });
            if (response.ok) {
                let jsonResp = await response.json();

                return jsonResp;
            }
        } catch (e) {
            console.log(e);
        }
    },
    updateInvoice: async function (invoiceId, columnToUpdate) {
        try {
            // let atcordIdInt = parseInt(atcorId);
            // console.log(url + "item/images/" + i);
            let response = await fetch(url + "invoice/update",
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        data: {
                            invoiceId: invoiceId,
                            updateColumn: columnToUpdate,
                        }
                    })
                });
            if (response.ok) {
                let jsonResp = await response.json();

                // console.log(jsonResp);
                return jsonResp;
            }
        } catch (e) {
            console.log(e);
        }
    },
}

module.exports = {
    ApiItems,
    ApiTasks,
    ApiInvoices
}