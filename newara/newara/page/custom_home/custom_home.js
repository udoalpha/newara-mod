frappe.pages['custom-home'].on_page_load = function(wrapper) {
	new MyPage(wrapper);
}

// PAGE CONTENT
class MyPage {
	constructor(wrapper) {
		this.page = frappe.ui.make_app_page({
			parent: wrapper,
			title: 'Home',
			single_column: true
		})
		//make page
		this.make();
	}

	// make page
	make() {
		let me = $(this);

		//page main
		this.page.main = $(this.page.wrapper).appendTo('<div class="page-main"></div>');

		//body content
		let body = `<div class="d-flex flex-column justify-content-center align-items-center ">
			<div><img src="https://static.vecteezy.com/system/resources/previews/009/481/029/non_2x/geometric-icon-logo-geometric-abstract-element-free-vector.jpg" alt="Newara" style="width: 48px; height: 48px; object-fit: cover;"></div>
			<p>Label</p>
		</div>`;

		// push DOM element to page
		$(frappe.render_template(body, this)).appendTo(this.page.main);
	}


	getHomePageItems() {
		const pageItems = frappe.boot.home_page_items;
	}
}


// let page = frappe.ui.make_app_page({
// 	parent: wrapper,
// 	title: 'Home',
// 	single_column: true
// });