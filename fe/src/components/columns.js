
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
        isSortable: ["matInQnt", "atcorId", "name", "availability", "priceIn"]
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
        isSortable: ["remark","matInDate","invoice","supplier"]

    },
    ItemInvoices: {
        notEditable: ["id", "invoice", "remark", "matInDate", "availability", "priceIn"],
        isEditable: [],
        filterNormal: [],
        filterNumeric: ["priceIn"],
        filterAutoComplete: ["invoice", "remark"],
        filterSingleSelect: ["measurement", "category"],
        editorDropDown: [],
        editorAutoComplete: [],
        isSortable: ["invoice", "remark", "matInDate", "matInQnt", "availability", "priceIn"]
    },
    Tasks: {
        notEditable: ["id", "dateCompleted", "completed"],
        isEditable: ["taskName", "endItem", "sysName", "contract", "PO"],
        filterNormal: ["dateCompleted"],
        filterNumeric: [],
        filterAutoComplete: [ "taskName"],
        filterSingleSelect: ["sysName"],
        editorDropDown: [],
        editorAutoComplete: [],
        isSortable: ["sysName", "taskName", "endItem", "completed", "dateCompleted"]
    },
    TaskItems: {
        notEditable: ["atcorNo", "atcorId", "name", "totalStock", "totalMatOut", "totalMatRet", "id"],
        isEditable: ["matOut", "matRet"],
        filterNormal: ["atcorNo"],
        filterNumeric: ["totalMatOut", "totalMatRet"],
        filterAutoComplete: ["name"],
        filterSingleSelect: [],
        editorDropDown: [],
        editorAutoComplete: [],
        isSortable: ["atcorId", "name", "totalStock", "totalMatOut", "totalMatRet"]
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
        isSortable: ["matOut", "matRet", "matActionDate"]   
    }
};