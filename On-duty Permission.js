frappe.ui.form.on('On-duty Permission', {
    refresh(frm) {
        frm.add_custom_button(__('Approve Authentication'), function() {
            frappe.call({
                "method": "frappe.client.get",
                args: {
                    doctype: "User",
                    name: frm.doc.approver
                },
                callback: function(r) {
                    var fName = r.message;
                    cur_frm.set_value("approver_name", fName.full_name);
                }
            });
            frappe.show_alert({ message: __('Approved'), indicator: 'blue' }, 5);
        });
    }
});

frappe.ui.form.on('On-duty Permission', {
    validate(frm) {
        if (frm.doc.vehicle_mode === "Company") {
            if (!frm.doc.vehicle) {
                frappe.throw(__("Select the vehicle plate number"));
            }
        }
        if (!frm.doc.approver_name) {
            frappe.throw(__("Click the approver authentication"));
        }

    }
});

frappe.ui.form.on('On-duty Permission', {
    current_odometer(frm) {
        if (frm.doc.last_odometer >= frm.doc.current_odometer) {
            frappe.throw(__("Check the Current odometer value"));
        } else {
            cur_frm.set_value("total_kilometer", frm.doc.current_odometer - frm.doc.last_odometer);
        }
    }
});