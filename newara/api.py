import frappe
from frappe.installer import update_site_config

def after_install():
    logo_url = "/assets/newara/images/file.jpeg"
    navbar_settings_doc = frappe.get_doc("Navbar Settings","Navbar Settings")
    website_doc = frappe.get_doc("Website Settings","Website Settings")
    navbar_settings_doc.app_logo = logo_url
    website_doc.app_logo = logo_url
    website_doc.splash_image = logo_url
    website_doc.favicon = logo_url
    website_doc.save(ignore_permissions = True)
    navbar_settings_doc.save(ignore_permissions = True)
    update_site_config("app_logo_url", logo_url)
    frappe.clear_cache()