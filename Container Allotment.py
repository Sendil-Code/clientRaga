# -*- coding: utf-8 -*-
# Copyright (c) 2025, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
import json
from frappe.model.utils import get_fetch_values
from frappe.model.mapper import get_mapped_doc
from frappe.model.document import Document

form_grid_templates = {
	"items": "templates/form_grid/item_grid.html"
}

class ContainerAllotment(Document):
	pass

@frappe.whitelist()
def get_dcnumber_details(sOrder, dcNo):
	dc = frappe.db.sql(""" select st.dc_number, st.item_code, st.buyer_code_number, st.qty, pa.cbm_value, pa.net_weight, pa.gross_weight, si.nest_code, si.name, si.rate
		from `tabDistribution Store` st, `tabPacking Details` pa, `tabSales Order Item` si where st.parent = pa.parent and st.item_code = pa.item_code and 
		st.parent = si.parent and st.item_code = si.item_code and st.parent = %s and st.dc_number = %s """, (sOrder, dcNo), as_dict=1)
	return dc

@frappe.whitelist()
def make_delivery_note(source_name, target_doc=None):
	salOrder = frappe.db.sql(""" select sales_order from `tabContainer Allotment` where `name` = %s """, (source_name))
	dcNo = frappe.db.sql(""" select dc_number from `tabContainer Allotment Item` where `parent` = %s and tentative_check = 1 group by dc_number""", (source_name))
	doc = get_mapped_doc("Container Allotment", source_name, {
		"Container Allotment": {
			"doctype": "Delivery Note",
			"field_map": {
				"other_reference" : [salOrder]
			},
		},
		"Container Allotment Item": {
			"doctype": "Delivery Note Item",
			"field_map": {
				"parent": "delivery_note",
				"so_detail": "so_detail",
				"qty": "allocate_qty",
				"against_sales_order": salOrder,
				"stock_uom" : "uom"
			},
		},
	}, target_doc)
	dcName = [row[0] for row in dcNo]
	stringCon = ", ".join(dcName)
	doc.dc_no = stringCon

	return doc


@frappe.whitelist()
def make_tentative_document(source_name, target_doc=None):
	serialNo = frappe.db.sql(""" select tn.name from `tabTentative Document` tn, `tabContainer Allotment` ca where ca.serial_no = tn.name """)
	dcNo = frappe.db.sql(""" select dc_number from `tabContainer Allotment Item` where `parent` = %s and tentative_check = 1 group by dc_number """, (source_name))
	if serialNo:
		frappe.msgprint("This serial number already generated")
		return

	doclist = get_mapped_doc("Container Allotment", source_name, {
		"Container Allotment": {
			"doctype": "Tentative Document"
		},
		"Container Allotment Item": {
			"doctype": "Tentative Items",
			"field_map": {
				"parent": "tentative_document"
			},
			"condition": lambda doc: doc.tentative_check == 1
		},
	}, target_doc)
	dcName = [row[0] for row in dcNo]
	stringCon = ", ".join(dcName)
	doclist.dc_no = stringCon

	return doclist