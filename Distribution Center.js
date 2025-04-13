frappe.ui.form.on('Distribution Center', {
    refresh: function(frm) {
        if (frm.doc.items.length > 0) {
            let table_html = `
                <table border="1" width="100%" cellspacing="0" cellpadding="5">
                    <thead>
                        <tr>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Rate</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>`;

            frm.doc.items.forEach(item => {
                table_html += `
                    <tr>
                        <td>${item.item_code}</td>
                        <td>${item.buyer_code_number}</td>
                        <td>${item.qty}</td>
                        <td>${item.rate}</td>
                        <td>${item.amount}</td>
                    </tr>`;
            });

            table_html += `</tbody></table>`;

            // Set the HTML content into the field
            frm.fields_dict.dc_html_edit.$wrapper.html(table_html);
        }
    }
});

frappe.ui.form.on('Distribution Center', {
    btn_result: function(frm) {
        const results = [];
        const results1 = [];
        frm.doc.dc_details.forEach((secondRow) => {
            frm.doc.items.forEach((firstRow) => {
                results.push(`${secondRow}`);
                results1.push(`${firstRow}`);
                console.log(results.length);
                let d = frm.add_child("distribution_store");
                for (var i = 0; i <= results.length; i++) {
                    d.dc_number = secondRow.dc_number;
                    d.item_code = firstRow.item_code;
                    d.buyer_code_number = firstRow.buyer_code_number;
                }
            });
        });
        cur_frm.refresh_field("distribution_store");
    }
});