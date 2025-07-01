const MAX_RETRIES = 10;
let attempts = 0;

// Retry loop to wait until DOM elements are available
const intervalId = setInterval(() => {
    const standardActions = document.querySelector('#page-Workspaces .standard-actions');
    const body = document.body;

    // If standardActions is not yet available, retry
    if (!standardActions) {
        attempts++;
        if (attempts >= MAX_RETRIES) {
            console.warn('Elements not found after multiple attempts.');
            clearInterval(intervalId);
        }
        return;
    }

    // Once elements are available, run setup functions
    addHamburger();
    enableDrawer()
    setupPageActions(); // Adjusts layout of page actions
    injectStandardModuleNav(standardActions); // Inserts initial dropdowns
    renderPage();
    clearInterval(intervalId); // Stop polling
}, 500);

// ------------------ Helper Functions ------------------

/**
 * Adjusts the layout and styling of the page-actions container.
 */
function setupPageActions() {
    const pageActions = document.querySelector('#page-Workspaces .page-actions');
    if (!pageActions) return;

    pageActions.classList.remove('justify-content-end');
    pageActions.classList.add('justify-content-between');
    pageActions.style.display = 'flex';

    // Dropdown
    $('body').on("click", ".dropdown-submenu a.test", function(e){
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
    });
}

/**
 * Injects dropdowns based on standard_module_nav into the UI.
 * @param {HTMLElement} container - The parent element to insert the dropdowns into.
 */
function injectStandardModuleNav(container) {
    const standardModuleNav = frappe.boot.standard_module_nav.sort((a, b) => a.label.localeCompare(b.label)) || [];

    // Create HTML for each dropdown using standard_module_nav
    const navHtml = standardModuleNav
        .map(item => createDropdown(item.label, item.name,'standard-module'))
        .join('');

    // Wrap in a container div and insert
    const wrapper = `<div id="module-nav-container" class="flex flex-wrap gap-1">${navHtml}</div>`;
    container.insertAdjacentHTML('afterbegin', wrapper);
}

/**
 * Creates a Bootstrap-style dropdown.
 * @param {string} label - The label for the dropdown button.
 * @param {string} extraClass - Additional class to apply to the dropdown for categorization.
 * @param {string} docName - The name of the document for which the dropdown is being created.
 * @returns {string} HTML string for the dropdown.
 */
function createDropdown(label, docName = '', extraClass = '') {
    const moduleNavItems = frappe.boot.module_nav_items.sort((a, b) => a.label.localeCompare(b.label))  || [];
    // console.log("moduleNavItems", moduleNavItems);

    // Filter moduleNavItems based on docName
    const docModuleNavItems = moduleNavItems.filter(item => item.parent === docName);

    console.log("docModuleNavItems", docModuleNavItems);

    if (docModuleNavItems && docModuleNavItems.length > 0) {
        let submenuHTML = ``;

        for (let i = 0; i < docModuleNavItems.length; i++) {
            const element = docModuleNavItems[i];
            const docModuleNavItemChildren = moduleNavItems.filter(item => item.parent === docModuleNavItems[i].nav_items);
            let childNavItemHTML = ``;

            // Process child elements
            if (docModuleNavItemChildren.length > 0) {
                for (let j = 0; j < docModuleNavItemChildren.length; j++) {
                    const element = docModuleNavItemChildren[j];
                    let link_to = createLink(element.link_type, element.link_to);

                    childNavItemHTML = childNavItemHTML + `<li><a tabindex="-1" href="${link_to}">${element.label}</a></li>`;
                }
            }
            console.log("Children", docModuleNavItemChildren);
            
            // Process 2nd level options
            if (!element.nav_items) {
                let link_to = createLink(element.link_type, element.link_to);
                submenuHTML = submenuHTML + `<li><a tabindex="-1" href="${link_to}">${element.label}</a></li>`
            } else {
                submenuHTML = submenuHTML + `
                    <li class="dropdown-submenu">
                        <a class="test dropdown-toggle" tabindex="-1" href="#">
                        ${element.label}<span class="caret"></span></a>
                        <ul class="dropdown-menu">
                            ${childNavItemHTML}
                        </ul>
                    </li>
                `
            }
            
            console.log("element", element)
        }


        

        const docModuleNavItemsHtml = docModuleNavItems.map(item => {
        return `
                <a class="dropdown-item" href="/app/${convertToHyphenCase(item.link_to)}">${item.label}</a>
            `
        }).join('');


        let markup = `
        <div class="dropdown ${extraClass}">
            <button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">
            ${label}<span class="caret"></span></button>
            <ul class="dropdown-menu">
            ${submenuHTML}
            </ul>
        </div>
        `

        return markup
    }
    
    
    
    const docModuleNavItemsHtml = docModuleNavItems.map(item => {
        return `
            <a class="dropdown-item" href="/app/${convertToHyphenCase(item.link_to)}">${item.label}</a>
        `
    }).join('');

    return `
        <div class="dropdown ${extraClass}">
            <button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                ${label}
            </button>
            <div class="dropdown-menu">
                ${docModuleNavItemsHtml? docModuleNavItemsHtml : '<a>No Items</a>'}
            </div>
        </div>
    `;
}

/**
 * Attaches a click listener to the body to detect when a sidebar item is clicked.
 * Dynamically updates dropdowns based on the selected workspace label.
 */


function renderPage() {
    // This runs when route changes
    frappe.router.on('change', () => {
        handleRouteChange();
    });

    // This runs on initial page load
    handleRouteChange();
}

function handleRouteChange() {
    // Clear non-standard modules
    document.querySelectorAll('.non-standard-module').forEach(el => el.remove());
    console.log('Removed non-standard module dropdown');

    const [, label] = frappe.get_route();  // e.g. ['app', 'Home']
    console.log('Route changed to:', label);

    if (!label) return;

    if (label === 'Home') {
        renderMenuItems();
        return;
    }

    $(".layout-main-section").show();
    $('#menu-items').hide();

    const moduleNavContainer = document.querySelector('#module-nav-container');
    if (!moduleNavContainer) return;

    const moduleNav = frappe.boot.module_nav.sort((a, b) => a.label.localeCompare(b.label))  || [];
    const filteredDropdowns = moduleNav
        .filter(item => item.workspace === label)
        .map(item => createDropdown(item.label, item.name, 'non-standard-module'))
        .join('');

    moduleNavContainer.insertAdjacentHTML('beforeend', filteredDropdowns);
}

function renderMenuItems() {
    $('.layout-main-section-wrapper')

    $(".layout-main-section").hide();
    

    let body = ''
		
    let pageItems = frappe.boot.main_menu_items.sort((a, b) => a.label.localeCompare(b.label)) ;

    pageItems.forEach(item => {
        body += `<a href="/doctype/${this.convertToHyphenCase(item.link_to)}"><div class="d-flex flex-column justify-content-center align-items-center">
            <div><img src="${item.icon}" alt="${item.label}" style="width: 48px; height: 48px; object-fit: cover;"></div>
            <h2 class="mt-3">${item.label}</h2>
        </div></a>`;
    });

    let mainActionBtn = `<div class="d-flex flex-column justify-content-center align-items-center">
        <button class="btn p-2 mt-5" style="background-color: #714b67; border-radius: 32px; color: white; border: none;">Main Action Button</button>
    </div>`


    body = `<div class="d-flex flex-wrap flex-grow-1 rounded-lg"  style="gap: 5rem;">${body}</div>${mainActionBtn}`;

    $('<div id="menu-items"></div>')
        .css({"border-radius":"32px", "padding-inline":"6rem", "padding-block":"5rem", "margin-top":"1rem", "margin-bottom":"5rem", "min-height": "80vh", "overflow": "auto", "display": "flex", "flex-direction": "column", "display": "block", "background-color": "white"})
        .html(body)
        .appendTo('.layout-main-section-wrapper');

    // push DOM element to page
    // $('#menu-items').appendTo('.layout-main-section-wrapper');
}



function convertToHyphenCase(str) {
    return str.replace(' ', '-').toLowerCase(); 
}

function createLink(link_type, link_to) {
    if (link_type == "DocType") {
        link_to = convertToHyphenCase(`/app/${link_to}`)
    } else if (link_type == "Report") {
        link_to = `/app/query-report/${link_to}`
    } else {
        link_to = `/app/${link_to}`
    }

    return link_to;
}

function addHamburger() {
    $('.page-head-content').append('<button class="hamburger" style="margin-right: 1rem;">Menu</button>');
}

function enableDrawer() {
    $(".hamburger").click(function () {
        const drawer = $("#module-nav-container");
        const isOpen = drawer.css("left") === "0px";

        drawer.css("left", isOpen ? "-70%" : "0px");

        const currentText = $(this).text().trim();
        $(this).text(currentText === "Menu" ? "Close" : "Menu");
    });
}