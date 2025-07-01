frappe.pages['Main Menu Page'].on_page_load = function(wrapper) {
	new MyPage(wrapper);
}

// PAGE CONTENT
class MyPage {
	constructor(wrapper) {
		this.page = frappe.ui.make_app_page({
			parent: wrapper,
			title: 'Main Menu',
			single_column: false 
		})
		//make page
		this.make();
	}
	
	// make page
	make() {
		let me = $(this);
		
		$(".layout-main-section").css({"border-radius":"32px", "padding-inline":"10rem", "padding-block":"5rem", "margin-top":"5rem", "margin-bottom":"5rem"});
		//page main
		// this.page.main = $(this.page.wrapper).appendTo('<div class="page-main"></div>');

		//body content
		let body = ''
		
		let pageItems = frappe.boot.main_menu_items;

		pageItems.forEach(item => {
			body += `<a href="/doctype/${this.convertToHyphenCase(item.link_to)}"><div class="d-flex flex-column justify-content-center align-items-center">
				<div><img src="${item.icon}" alt="${item.label}" style="width: 48px; height: 48px; object-fit: cover;"></div>
				<h2 class="mt-3">${item.label}</h2>
			</div></a>`;
		});

		let mainActionBtn = `<div class="d-flex flex-column justify-content-center align-items-center">
			<button class="btn p-2 mt-5" style="background-color: #714b67; border-radius: 32px; color: white; border: none;">Main Action Button</button>
		</div>`


		body = `<div class="d-flex flex-wrap rounded-lg"  style="gap: 5rem;">${body}</div>${mainActionBtn}`;



		// push DOM element to page
		$(frappe.render_template(body, this)).appendTo(this.page.main);
	}


	convertToHyphenCase(str) {
		return str.replace(' ', '-').toLowerCase(); 
	}
}


// let page = frappe.ui.make_app_page({
// 	parent: wrapper,
// 	title: 'Home',
// 	single_column: true
// });