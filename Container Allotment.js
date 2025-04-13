// Copyright (c) 2025, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on("Container Allotment", {
    refresh: function(frm) {
        cur_frm.add_custom_button(__('Tentative Document'), tentative, __("Make"));
        cur_frm.add_custom_button(__('Delivery Note'), make_delivery_note, __("Make"));
    }
});

function tentative() {
    check_dc_validate()
    frappe.model.open_mapped_doc({
        method: "erpnext.stock.doctype.container_allotment.container_allotment.make_tentative_document",
        frm: me.frm
    })
};


function make_delivery_note() {
    frappe.model.open_mapped_doc({
        method: "erpnext.stock.doctype.container_allotment.container_allotment.make_delivery_note",
        frm: me.frm
    })
};