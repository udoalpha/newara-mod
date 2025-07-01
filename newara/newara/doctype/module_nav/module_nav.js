// Copyright (c) 2025, contact@half-ware.com and contributors
// For license information, please see license.txt

frappe.ui.form.on("Module Nav", {
	is_child(frm) {
        if (frm.doc.is_child) {
            frm.set_df_property("label", "reqd", 0);
        }else{
            frm.set_df_property("label", "reqd", 1);
        }
	},
});
