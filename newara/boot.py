import frappe


def boot_session(bootinfo):
    bootinfo.my_global_key = "my_global_value"
    bootinfo.standard_module_nav = frappe.get_all("Module Nav", fields=["*"], filters={"standard": 1})
    bootinfo.module_nav = frappe.get_all("Module Nav", fields=["*"], filters={"standard": 0})
    bootinfo.module_nav_items = frappe.get_all("Module Nav Item", fields=["*"])
    bootinfo.main_menu_items = frappe.get_all("Main Menu Item", fields=["*"])