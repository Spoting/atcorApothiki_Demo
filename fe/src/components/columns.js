
export const columnsActions = {
    //PN , ATCOR_PN, Ergo_Related, RFM_Related
    InvoiceItems: {
        notEditable: ["id", "atcorId", "availability", "task_related"],
        isEditable: ["priceIn", "matInQnt", "nsn", "name", "measurement", "PN", "characteristic_1", "characteristic_2","atcorPN", "unit",  "rfm_related"], //"priceIn","matInQnt"
        filterNormal: ["atcorId"],
        filterNumeric: ["matInQnt"],
        filterAutoComplete: [],
        filterSingleSelect: ["name"],
        // isFormattable: ["nsn"],
        editorDropDown: ["unit"],
        editorAutoComplete: ["name"],
        isSortable: ["atcorNo", "nsn", "atcorPN", "PN", "matInQnt", "atcorId", "name", "availability", "priceIn", "characteristic_1", "characteristic_2", "rfm_related", "task_related", "unit"], 
        titles: [
            { atcorNo: "", title: "AtcorNo" },
            { task_related: "" , title: "Task_Rel" },
            { name: "", title: "Description" },
            { PN: "", title: "PN" },
            { atcorPN: "", title: "AtcorPN" },
            { nsn: "", title: "NSN"},
            { characteristic_1: "", title: "C1" },
            { characteristic_2: "", title: "C2" },
            { rfm_related: "", title: "RFM_Rel" },
            { unit: "", title: "Unit" },
            { matInQnt: "", title: "MatInQnt" },
            { availability: "", title: "Availability"},
            { priceIn: "", title: "PriceIn" },
        ]
    },
    //Inv Date
    Invoices: {
        notEditable: ["matInDate", "id"],
        isEditable: ["invoice", "remark", "supplier", "invoiceDate"],
        filterNormal: ["remark", "matInDate", "invoiceDate", "invoice"],
        filterNumeric: [],
        filterAutoComplete: ["supplier"],
        filterSingleSelect: [],
        editorDropDown: [],
        editorAutoComplete: [],
        isSortable: ["remark","matInDate","invoice","supplier", "invoiceDate"],
        titles: [
            { invoice: "", title: "InvoiceNo" },
            { invoiceDate: "" , title: "InvoiceDate" },
            { remark: "", title: "Remark" },
            { matInDate: "", title: "MatInDate" },
            { supplier: "", title: "Supplier" },
        ]
    },
    ItemInvoices: {
        notEditable: ["id", "invoice", "remark", "matInDate", "priceIn"],
        isEditable: ["availability"],
        filterNormal: [ "matInDate", "invoice", "remark", "rfm_related", "task_related"],
        filterNumeric: ["priceIn", "matInQnt", "availability"],
        filterAutoComplete: [],
        filterSingleSelect: ["supplier"],
        editorDropDown: [],
        editorAutoComplete: [],
        isSortable: ["invoice", "remark", "matInDate", "matInQnt", "availability", "priceIn", "supplier", "rfm_related", "task_related"],
        titles: [
            { invoice: "", title: "InvoiceNo" },
            { task_related: "" , title: "Task_Rel" },
            { remark: "", title: "Remark" },
            { matInDate: "", title: "MatInDate" },
            { supplier: "", title: "Supplier" },
            { rfm_related: "", title: "RFM_Rel" },
            { task_related: "" , title: "Task_Rel" },
            { unit: "", title: "Unit" },
            { matInQnt: "", title: "MatInQnt" },
            { availability: "", title: "Availability"},
            { priceIn: "", title: "PriceIn" },
        ]
    },
    Tasks: {
        notEditable: ["id", "dateCompleted", "completed"],
        isEditable: ["taskName", "endItem", "sysName", "contract", "PO"],
        filterNormal: ["dateCompleted", "endItem"],
        filterNumeric: [],
        filterAutoComplete: [],
        filterSingleSelect: ["sysName", "contract", "PO", "taskName", "completed"],
        editorDropDown: [],
        editorAutoComplete: [],
        isSortable: ["sysName", "taskName", "endItem", "completed", "dateCompleted", "PO", "contract"],
        titles: [
            { sysName: "", title: "SysName" },
            { taskName: "" , title: "TaskName" },
            { endItem: "", title: "EndItem" },
            { completed: "", title: "Completed" },
            { dateCompleted: "", title: "DateCompleted" },
            { contract: "", title: "Contract"},
            { PO: "", title: "PO"}
        ]
    },
    TaskItems: {
        notEditable: ["atcorNo", "atcorId", "nsn", "PN", "atcorPN","name", "totalStock", "totalMatOut", "totalMatRet", "id"],
        isEditable: ["matOut", "matRet"],
        filterNormal: ["atcorNo", "nsn", "PN", "atcorPN"],
        filterNumeric: ["totalMatOut", "totalMatRet"],
        filterAutoComplete: ["name"],
        filterSingleSelect: [],
        editorDropDown: [],
        editorAutoComplete: [],
        isSortable: ["atcorId", "name", "totalStock", "totalMatOut", "totalMatRet", "nsn", "PN", "atcorPN"],
        titles: [
            { atcorNo: "", title: "AtcorNo" },
            { name: "" , title: "Description" },
            { totalStock: "", title: "TotalStock" },
            { totalMatOut: "", title: "TotalMatOut" },
            { totalMatRet: "", title: "TotalMatRet" },
        ]
    },
    TaskItemMovement: {
        notEditable: ["id", "matOut", "matRet", "matActionDate"],
        isEditable: [],
        filterNormal: ["matActionDate"],
        filterNumeric: ["matOut", "matRet"],
        filterAutoComplete: [],
        filterSingleSelect: [],
        editorDropDown: [],
        editorAutoComplete: [],
        isSortable: ["matOut", "matRet", "matActionDate"],
        titles: [
            // { matOut: "", title: "SysName" },
            // { matRet: "" , title: "TaskName" },
            // { matActionDate: "", title: "EndItem" },
        ]   
    }
};