// async function loadCategoriesAndMenus() {
//     const data = await window.electronAPI.fetchCategoriesWithMenus();

//     // Group by categories
//     const categories = data.reduce((acc, row) => {
//         const category = acc[row.category_id] || {
//             name: row.category_name,
//             sub_categories: {},
//             menus: [],
//         };

//         if (row.sub_category_id) {
//             const subCategory = category.sub_categories[
//                 row.sub_category_id
//             ] || {
//                 name: row.sub_category_name,
//                 menus: [],
//             };
//             subCategory.menus.push({
//                 id: row.menu_id,
//                 name: row.menu_name,
//                 price: row.menu_price,
//             });
//             category.sub_categories[row.sub_category_id] = subCategory;
//         } else if (row.menu_name) {
//             category.menus.push({
//                 id: row.menu_id,
//                 name: row.menu_name,
//                 price: row.menu_price,
//             });
//         }

//         acc[row.category_id] = category;
//         return acc;
//     }, {});

//     // Populate the DOM
//     const categoryList = document.getElementById("categoryList");
//     categoryList.innerHTML = "";

//     Object.values(categories).forEach((category) => {
//         const categoryItem = document.createElement("li");
//         categoryItem.className = "list-group-item";
//         categoryItem.innerHTML = `<strong>${category.name}</strong>`;

//         const menuList = document.createElement("ul");
//         menuList.className = "list-group border-0";

//         category.menus.forEach((menu) => {
//             const menuItem = document.createElement("li");
//             menuItem.className =
//                 "list-group-item d-flex justify-content-between align-items-center";
//             menuItem.textContent = `${menu.name} - ₹${menu.price}`;

//             const addButton = document.createElement("button");
//             addButton.className = "btn btn-success btn-sm py-1";
//             addButton.innerHTML = "<i class='fa-solid fa-plus'></i>";
//             addButton.setAttribute("data-name", menu.name);
//             addButton.setAttribute("data-price", menu.price);

//             addButton.addEventListener("click", () => {
//                 addToBill(menu);
//             });

//             menuItem.appendChild(addButton);
//             menuList.appendChild(menuItem);
//         });

//         Object.values(category.sub_categories).forEach((subCategory) => {
//             const subCategoryItem = document.createElement("li");
//             subCategoryItem.className = "list-group-item";
//             subCategoryItem.innerHTML = `<em>${subCategory.name}</em>`;

//             const subMenuList = document.createElement("ul");
//             subMenuList.className = "list-group border-0";
//             subCategory.menus.forEach((menu) => {
//                 const subMenuItem = document.createElement("li");
//                 subMenuItem.className =
//                     "list-group-item d-flex justify-content-between align-items-center";
//                 subMenuItem.textContent = `${menu.name} - ₹${menu.price}`;

//                 const addButton = document.createElement("button");
//                 addButton.className = "btn btn-success btn-sm py-1";
//                 addButton.innerHTML = "<i class='fa-solid fa-plus'></i>";
//                 addButton.setAttribute("data-name", menu.name);
//                 addButton.setAttribute("data-price", menu.price);

//                 addButton.addEventListener("click", () => {
//                     addToBill(menu);
//                 });

//                 subMenuItem.appendChild(addButton);
//                 subMenuList.appendChild(subMenuItem);
//             });

//             subCategoryItem.appendChild(subMenuList);
//             menuList.appendChild(subCategoryItem);
//         });

//         categoryItem.appendChild(menuList);
//         categoryList.appendChild(categoryItem);
//     });
// }

function loadCategoriesDropdown(categories) {
    const categorySelectBox = document.getElementById("category-select-box");
    categorySelectBox.innerHTML = `
        <option value="">Select Category</option>
    `;

    Object.entries(categories).forEach(([categoryId, category]) => {
        const option = document.createElement("option");
        option.value = categoryId;
        option.textContent = category.name;
        categorySelectBox.appendChild(option);
    });
}

let allCategories = {}; // Store original categories for search

async function loadCategoriesAndMenus() {
    const data = await window.electronAPI.fetchCategoriesWithMenus();

    // Group by categories
    allCategories = data.reduce((acc, row) => {
        const category = acc[row.category_id] || {
            name: row.category_name,
            sub_categories: {},
            menus: [],
        };

        if (row.sub_category_id) {
            const subCategory = category.sub_categories[
                row.sub_category_id
            ] || {
                name: row.sub_category_name,
                menus: [],
            };
            subCategory.menus.push({
                id: row.menu_id,
                name: row.menu_name,
                price: row.menu_price,
            });
            category.sub_categories[row.sub_category_id] = subCategory;
        } else if (row.menu_name) {
            category.menus.push({
                id: row.menu_id,
                name: row.menu_name,
                price: row.menu_price,
            });
        }

        acc[row.category_id] = category;
        return acc;
    }, {});

    loadCategoriesDropdown(allCategories);
    renderCategories(allCategories);
}

function renderCategories(categories) {
    const categoryList = document.getElementById("categoryList");
    categoryList.innerHTML = "";

    Object.values(categories).forEach((category) => {
        const categoryItem = document.createElement("li");
        categoryItem.className = "list-group-item";
        categoryItem.innerHTML = `<strong>${category.name}</strong>`;

        const menuList = document.createElement("ul");
        menuList.className = "list-group border-0";

        category.menus.forEach((menu) => {
            const menuItem = document.createElement("li");
            menuItem.className =
                "list-group-item d-flex justify-content-between align-items-center";
            menuItem.textContent = `${menu.name} - ₹${menu.price}`;

            const addButton = document.createElement("button");
            addButton.className = "btn btn-success btn-sm py-1";
            addButton.innerHTML = "<i class='fa-solid fa-plus'></i>";
            addButton.setAttribute("data-name", menu.name);
            addButton.setAttribute("data-price", menu.price);

            addButton.addEventListener("click", () => {
                addToBill(menu);
            });

            menuItem.appendChild(addButton);
            menuList.appendChild(menuItem);
        });

        Object.values(category.sub_categories).forEach((subCategory) => {
            const subCategoryItem = document.createElement("li");
            subCategoryItem.className = "list-group-item";
            subCategoryItem.innerHTML = `<em>${subCategory.name}</em>`;

            const subMenuList = document.createElement("ul");
            subMenuList.className = "list-group border-0";
            subCategory.menus.forEach((menu) => {
                const subMenuItem = document.createElement("li");
                subMenuItem.className =
                    "list-group-item d-flex justify-content-between align-items-center";
                subMenuItem.textContent = `${menu.name} - ₹${menu.price}`;

                const addButton = document.createElement("button");
                addButton.className = "btn btn-success btn-sm py-1";
                addButton.innerHTML = "<i class='fa-solid fa-plus'></i>";
                addButton.setAttribute("data-name", menu.name);
                addButton.setAttribute("data-price", menu.price);

                addButton.addEventListener("click", () => {
                    addToBill(menu);
                });

                subMenuItem.appendChild(addButton);
                subMenuList.appendChild(subMenuItem);
            });

            subCategoryItem.appendChild(subMenuList);
            menuList.appendChild(subCategoryItem);
        });

        categoryItem.appendChild(menuList);
        categoryList.appendChild(categoryItem);
    });
}

function filterCategory(event) {
    {
        const selectedCategoryId = event.target.value;

        if (!selectedCategoryId) {
            renderCategories(allCategories);
            return;
        }

        const filteredCategory = {
            [selectedCategoryId]: allCategories[selectedCategoryId],
        };

        renderCategories(filteredCategory);
    }
}

function searchMenu(event) {
    const searchTerm = event.target.value.toLowerCase();

    // Filter categories and menus
    const filteredCategories = Object.entries(allCategories).reduce(
        (acc, [categoryId, category]) => {
            const filteredMenus = category.menus.filter((menu) =>
                menu.name.toLowerCase().includes(searchTerm)
            );

            const filteredSubCategories = Object.entries(
                category.sub_categories
            ).reduce((subAcc, [subCategoryId, subCategory]) => {
                const filteredSubMenus = subCategory.menus.filter((menu) =>
                    menu.name.toLowerCase().includes(searchTerm)
                );
                if (filteredSubMenus.length > 0) {
                    subAcc[subCategoryId] = {
                        ...subCategory,
                        menus: filteredSubMenus,
                    };
                }
                return subAcc;
            }, {});

            if (
                filteredMenus.length > 0 ||
                Object.keys(filteredSubCategories).length > 0
            ) {
                acc[categoryId] = {
                    ...category,
                    menus: filteredMenus,
                    sub_categories: filteredSubCategories,
                };
            }
            return acc;
        },
        {}
    );

    renderCategories(filteredCategories);
}

let orderItems = {};

function loadSavedSummary() {
    const tbody = document.querySelector("#offcanvasRight tbody");
    tbody.innerHTML = "";

    const orders = Object.keys(localStorage)
        .filter((key) => key.startsWith("order-"))
        .map((key) => {
            const data = JSON.parse(localStorage.getItem(key));
            return { key, ...data };
        });

    if (orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="text-center">No saved orders</td></tr>`;
        return;
    }

    orders.forEach((order) => {
        const row = document.createElement("tr");
        const actionCell = document.createElement("td");

        // Print button
        const printButton = document.createElement("button");
        printButton.classList.add("btn", "btn-success", "btn-sm", "me-2");
        printButton.innerHTML =
            "<i class='fa-solid fa-print text-white fa-sm'></i>";
        printButton.addEventListener("click", () => {
            const discount = order.discount || 0;
            const taxRate = order.taxRate || 0;

            document.getElementById("discount").value = discount;
            document.getElementById("tax").value = taxRate;

            orderItems = order.items;

            printInvoice();
        });
        actionCell.appendChild(printButton);

        // edit button
        const editButton = document.createElement("button");
        editButton.classList.add("btn", "btn-primary", "btn-sm", "me-2");
        editButton.innerHTML =
            "<i class='fa-solid fa-edit text-white fa-sm'></i>";
        editButton.addEventListener("click", () => {
            const discount = order.discount || 0;
            const taxRate = order.taxRate || 0;

            document.getElementById("discount").value = discount;
            document.getElementById("tax").value = taxRate;

            orderItems = order.items;

            updateOrderTable();
        });
        actionCell.appendChild(editButton);

        // delete button
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("btn", "btn-danger", "btn-sm");
        deleteButton.innerHTML =
            "<i class='fa-solid fa-trash text-white fa-sm'></i>";
        deleteButton.addEventListener("click", () => {
            localStorage.removeItem(order.key);
            alert(`Order for table ${order.tableNumber} deleted.`);
            loadSavedSummary();
        });
        actionCell.appendChild(deleteButton);

        const tableNumberCell = document.createElement("td");
        tableNumberCell.innerText = order.tableNumber;

        const totalCell = document.createElement("td");
        totalCell.innerText = order.grandTotal.toFixed(2);

        // Append cells to the row
        row.appendChild(actionCell);
        row.appendChild(tableNumberCell);
        row.appendChild(totalCell);

        // Append the row to the table body
        tbody.appendChild(row);
    });
}

// Call the function on load
document.addEventListener("DOMContentLoaded", () => {
    loadCategoriesAndMenus();
    updateOrderTable();
    loadSavedSummary();
});
const orderTable = document.getElementById("orderTable");
const tfoot = document.querySelector("table tfoot");
const buttonGroup = document.getElementById("btn-group");

function addToBill(menu) {
    let { id, name, price } = menu;
    if (typeof price === "string" && price.includes("/")) {
        price = parseFloat(price.split("/")[0]);
    }
    if (orderItems[id]) {
        orderItems[id].quantity++;
    } else {
        orderItems[id] = { name, id, price, quantity: 1 };
    }
    updateOrderTable();
}

function addEmptyTable() {
    orderTable.innerHTML = `
        <tr>
            <td colspan="6" class="text-center">No Order Summary</td>
        </tr>
    `;

    // Reset subtotal and grand total
    document.getElementById("subtotal").textContent = "₹0";
    document.getElementById("grandTotal").textContent = "₹0";

    tfoot.classList.add("d-none");
    buttonGroup.classList.add("d-none");
}

function updateOrderTable() {
    orderTable.innerHTML = "";

    // Check if orderItems is empty
    if (Object.keys(orderItems).length === 0) {
        addEmptyTable();
        return;
    }

    // Show the tfoot and calculate button
    tfoot.classList.remove("d-none");
    buttonGroup.classList.remove("d-none");
    buttonGroup.classList.add("d-flex");

    let subtotal = 0;
    let serial = 0;

    for (const [name, item] of Object.entries(orderItems)) {
        const total = item.price * item.quantity;
        subtotal += total;
        serial++;
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${serial}</td>
            <td>${item.name}</td>
            <td style="width:12%"> <input
                    type="number"
                    value="${item.price}"
                    class="form-control form-control-sm"
                    ondblclick="enablePriceEditing(this)"
                     oninput="manualPriceChange('${item.id}', this.value)"
                    
                />
                </td>
            <td style="width: 5%">
                <div class="input-step">
                    <button type="button" onclick="changeQuantity('${
                        item.id
                    }', -1)">
                        <i class="fa-solid text-lead fa-minus fa-sm"></i>
                    </button>
                    <input
                        type="number"
                        value="${item.quantity}"
                        class="form-control form-control-sm text-center"
                        oninput="manualQuantityChange('${item.id}', this.value)"
                        
                    />
                    <button type="button" onclick="changeQuantity('${
                        item.id
                    }', 1)">
                        <i class="fa-solid text-lead fa-plus fa-sm"></i>
                    </button>
                </div>
            </td>
           <td style="width: 16%" id="row-total-${item.id}">₹${
            item.price * item.quantity
        }</td>
            <td style="width: 15%">
                <button class="btn btn-danger btn-sm" onclick="removeItem('${
                    item.id
                }')">
                    <i class="fa-solid fa-trash text-white"></i>
                </button>
            </td>
        `;

        orderTable.appendChild(row);
    }

    calculateSubtotal();
    calculateGrandTotal();
}

function changeQuantity(id, delta) {
    if (orderItems[id]) {
        let newQuantity = orderItems[id].quantity + delta;

        if (newQuantity <= 0) {
            newQuantity = 1;
        }

        orderItems[id].quantity = newQuantity;
        updateOrderTable();
    }
}

function manualPriceChange(id, value) {
    let price = value;

    if (price < 0) {
        price = 0;
    }
    if (orderItems[id]) {
        orderItems[id].price = price;

        const rowTotal = document.querySelector(`#row-total-${id}`);
        const total = price * orderItems[id].quantity;
        rowTotal.textContent = `₹${total.toFixed(2)}`;

        calculateSubtotal();
        calculateGrandTotal();
    }
}

function manualQuantityChange(id, value) {
    if (value !== "") {
        console.log("Valid", value);

        let quantity = parseInt(value, 10) || 0;

        if (quantity <= 0) {
            quantity = 1;
        }

        if (orderItems[id]) {
            orderItems[id].quantity = quantity;

            const rowTotal = document.querySelector(`#row-total-${id}`);
            const total = quantity * orderItems[id].price;
            rowTotal.textContent = `₹${total.toFixed(2)}`;

            calculateSubtotal();
            calculateGrandTotal();
        }
    }
}

function removeItem(id) {
    delete orderItems[id];
    updateOrderTable();
}

function calculateSubtotal() {
    let subtotal = 0;

    for (const item of Object.values(orderItems)) {
        subtotal += item.price * item.quantity;
    }

    document.getElementById("subtotal").textContent = `₹${subtotal}`;
}
function calculateGrandTotal() {
    const subtotal =
        parseFloat(
            document.getElementById("subtotal").textContent.replace("₹", "")
        ) || 0;
    const discountRate =
        parseFloat(document.getElementById("discount").value) || 0;
    const discount = (subtotal * discountRate) / 100;
    const taxRate = parseFloat(document.getElementById("tax").value) || 0;
    const tax = (subtotal * taxRate) / 100;
    const grandTotal = subtotal - discount + tax;
    document.getElementById("grandTotal").textContent = `₹${grandTotal.toFixed(
        2
    )}`;
}

function cancelOrder() {
    orderItems = {};
    document.getElementById("discount").value = null;
    document.getElementById("tax").value = null;
    updateOrderTable();
}

function getDateFormatter() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const formattedToday = dd + "/" + mm + "/" + yyyy;
    return formattedToday;
}

// Store the invoice counter in localStorage to persist between page reloads.
function getInvoiceNumber() {
    let lastInvoiceNumber = localStorage.getItem("lastInvoiceNumber");
    let nextInvoiceNumber = lastInvoiceNumber
        ? parseInt(lastInvoiceNumber) + 1
        : 1;

    localStorage.setItem("lastInvoiceNumber", nextInvoiceNumber);

    return `SRC72-${nextInvoiceNumber.toString().padStart(4, "0")}`;
}

function convertImageToBase64(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.status === 200) {
                const reader = new FileReader();
                reader.onloadend = function () {
                    resolve(reader.result);
                };
                reader.readAsDataURL(xhr.response);
            } else {
                reject(new Error("Failed to load image"));
            }
        };
        xhr.onerror = function () {
            reject(new Error("Error during image load"));
        };
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.send();
    });
}

async function printInvoice() {
    if (Object.keys(orderItems).length === 0) {
        alert("No items to print.");
        return;
    }

    try {
        // Load the invoice template
        const response = await fetch("invoice-template.html");
        let invoiceTemplate = await response.text();

        // Open a new window for the invoice
        let invoiceWindow = window.open("", "Invoice", "width=561,height=794");

        const logoBase64 = await convertImageToBase64("assets/logo.png");

        // Calculate totals
        let subtotal = 0;
        let serial = 0;
        let rows = "";

        for (const [name, item] of Object.entries(orderItems)) {
            serial++;
            const total = item.price * item.quantity;
            subtotal += total;

            rows += `
                <tr>
                    <td>${serial}</td>
                    <td>${item.name}</td>
                    <td>₹${item.price}</td>
                    <td>${item.quantity}</td>
                    <td>₹${total.toFixed(2)}</td>
                </tr>
            `;
        }

        const discountRate =
            parseFloat(document.getElementById("discount").value) || 0;
        const discount = (subtotal * discountRate) / 100;
        const taxRate = parseFloat(document.getElementById("tax").value) || 0;
        const tax = (subtotal * taxRate) / 100;
        const grandTotal = subtotal - discount + tax;

        const tfootContent = `
        <tr>
            <td colspan="4" class="text-right"><strong>Subtotal:</strong></td>
            <td id="subtotal" class="text-center">₹${subtotal.toFixed(2)}</td>
        </tr>
        <tr>
            <td colspan="4" class="text-right"><strong>Discount:</strong></td>
            <td id="discount" class="text-center">₹${discount.toFixed(2)}</td>
        </tr>
        <tr>
            <td colspan="4" class="text-right"><strong>Tax:</strong></td>
            <td id="tax" class="text-center">₹${tax.toFixed(2)}</td>
        </tr>
        <tr>
            <td colspan="4" class="text-right"><strong>Grand Total:</strong></td>
            <td id="grand-total" class="text-center">₹${grandTotal.toFixed(
                2
            )}</td>
        </tr>
    `;

        // Populate the template with data
        invoiceTemplate = invoiceTemplate
            .replace('<tbody id="invoice-items">', rows)
            .replace('<tfoot id="tfoot-item">', tfootContent)
            .replace("2022-01-01", getDateFormatter())
            .replace("SRC72-", getInvoiceNumber())
            .replace('src=""', `src="${logoBase64}"`);

        // Write the populated template into the new window
        invoiceWindow.document.write(invoiceTemplate);
        invoiceWindow.document.close();
        invoiceWindow.print();

        cancelOrder();
    } catch (error) {
        console.error("Error loading the invoice template:", error);
        alert("Failed to generate the invoice. Please try again.");
    }
}

function saveOrder() {
    const tableNumberInput = document.getElementById("tableNumberInput");
    const tableNumber = tableNumberInput.value.trim(); // Trim input to avoid leading/trailing spaces
    tableNumberInput.focus(); // Ensure focus on the input field

    // Validate table number
    if (!tableNumber || tableNumber <= 0) {
        alert("Please enter a valid table number.");
        tableNumberInput.focus(); // Refocus the input field
        return;
    }

    // Check for duplicate table number
    if (localStorage.getItem(`order-${tableNumber}`)) {
        const updateOrder = confirm(
            `Table number ${tableNumber} already has an order saved. Do you want to update the existing order?`
        );

        if (updateOrder) {
            localStorage.removeItem(`order-${tableNumber}`);
        } else {
            return;
        }
    }

    // Check for maximum orders in localStorage
    const ordersCount = Object.keys(localStorage).filter((key) =>
        key.startsWith("order-")
    ).length;
    if (ordersCount >= 10) {
        alert(
            "Cannot save more than 10 orders. Please clear some orders first."
        );
        return; // Keep the modal open
    }

    // Save order to localStorage
    let subtotal = 0;

    for (const item of Object.values(orderItems)) {
        subtotal += item.price * item.quantity;
    }
    const discountRate =
        parseFloat(document.getElementById("discount").value) || 0;
    const taxRate = parseFloat(document.getElementById("tax").value) || 0;
    const discount = (subtotal * discountRate) / 100;
    const tax = (subtotal * taxRate) / 100;
    const grandTotal = subtotal - discount + tax;
    const orderData = {
        tableNumber: tableNumber,
        items: orderItems,
        discountRate,
        taxRate,
        subtotal,
        grandTotal,
    };
    localStorage.setItem(`order-${tableNumber}`, JSON.stringify(orderData));

    // Hide modal after successful save
    const modal = bootstrap.Modal.getInstance(
        document.getElementById("tableNumberModal")
    );
    modal.hide();

    // Reset input field
    tableNumberInput.value = "";

    alert(`Order for table ${tableNumber} has been saved successfully!`);
    cancelOrder();
    loadSavedSummary();
}

function clearSavedOrderSummary() {
    if (!confirm("Are you sure you want to clear all saved orders?")) {
        return;
    }

    Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("order-")) {
            localStorage.removeItem(key);
        }
    });

    loadSavedSummary();

    alert("All saved orders have been cleared.");
}

document.getElementById("tax").addEventListener("input", calculateGrandTotal);
document
    .getElementById("discount")
    .addEventListener("input", calculateGrandTotal);

document.getElementById("CancelTotal").addEventListener("click", cancelOrder);
document.getElementById("printInvoice").addEventListener("click", printInvoice);
document.getElementById("confirmSave").addEventListener("click", saveOrder);
document
    .getElementById("clearOrder")
    .addEventListener("click", clearSavedOrderSummary);

document.getElementById("searchBox").addEventListener("input", searchMenu);
document
    .getElementById("category-select-box")
    .addEventListener("change", filterCategory);
