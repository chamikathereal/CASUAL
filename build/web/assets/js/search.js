async function loadData() {
    const response = await fetch("LoadData");
    const popup = Notification();
    popup.setProperty({
        duration: 5000,
        isHidePrev: true
    });

    if (response.ok) {
        const json = await response.json();
        console.log("Received data:", json);

        if (json.success) {
            // Load brand list
            loadRadioOption("brand", json.brandyList, "name");

            // Load size list
            loadRadioOption("size", json.sizeList, "name");

            // Load color list
            loadRadioOption("color", json.colorList, "name");

            // Update product view
            updateProductView(json);
        } else {
            popup.error({
                message: "Data load failed"
            });
        }
    } else {
        popup.error({
            message: "Try again later"
        });
    }
}

function loadRadioOption(prefix, dataList, property) {
    // Find the options container and radio template element
    let options = document.getElementById(prefix + "-options");
    let radioTemplate = document.getElementById(prefix + "-radio");

    if (!options || !radioTemplate) {
        console.error(`Element with ID ${prefix}-options or ${prefix}-radio not found.`);
        return;
    }

    // Clear existing options
    options.innerHTML = "";

    // Check if dataList is an array
    if (Array.isArray(dataList)) {
        // Iterate over the list and clone the radio button element for each item
        dataList.forEach((data, index) => {
            // Clone the radio button container
            let radioClone = radioTemplate.cloneNode(true);

            // Update the label text
            let label = radioClone.querySelector("label");
            label.textContent = data[property];

            // Update the input element
            let input = radioClone.querySelector("input");
            input.id = `${prefix}Radio${index}`; // Unique ID for each radio button
            input.name = `${prefix}Radio`; // Ensure all radios belong to the same group
            input.value = data[property]; // Set value to the name (or use a unique identifier if you have it)

            // Update the label's 'for' attribute to match the input's ID
            label.setAttribute("for", `${prefix}Radio${index}`);

            // Append the cloned radio button to the options container
            options.appendChild(radioClone);
        });
    } else {
        console.error(`Expected dataList to be an array but received ${typeof dataList}`);
    }
}

async function searchProducts(firstResult) {
    const popup = Notification();

    // Get the selected brand name
    let selectedBrand = document.querySelector('#brand-options input[type="radio"]:checked')
            ?.parentElement.querySelector('label')
            .innerHTML;
    console.log("Selected Brand:", selectedBrand);

    // Get the selected size name
    let selectedSize = document.querySelector('#size-options input[type="radio"]:checked')
            ?.parentElement.querySelector('label')
            .innerHTML;
    console.log("Selected Size:", selectedSize);

    // Get the selected color name
    let selectedColor = document.querySelector('#color-options input[type="radio"]:checked')
            ?.parentElement.querySelector('label')
            .innerHTML;
    console.log("Selected Color:", selectedColor);

    // Get price values
    let lowerValue = document.getElementById('slider-value-lower').innerHTML.replace('Rs.', '').trim();
    let upperValue = document.getElementById('slider-value-upper').innerHTML.replace('Rs.', '').trim();
    console.log("Lower Value:", lowerValue);
    console.log("Upper Value:", upperValue);

    let casual_sort = document.getElementById("casual-sort").value;
    console.log("Sort Option:", casual_sort);

    const data = {
        firstResult: firstResult,
        selectedBrand: selectedBrand,
        selectedSize: selectedSize,
        selectedColor: selectedColor,
        lowerValue: parseFloat(lowerValue),
        upperValue: parseFloat(upperValue),
        casual_sort: casual_sort
    };

    const response = await fetch("SearchProducts", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });

    popup.setProperty({
        duration: 5000,
        isHidePrev: true
    });

    if (response.ok) {
        const json = await response.json();
        console.log("Search Results:", json);

        if (json.success) {
            updateProductView(json);
            currentPage = 0;

            popup.success({
                message: "Search Complete"
            });
        } else {
            popup.error({
                message: "Search Incomplete"
            });
        }
    } else {
        popup.error({
            message: "Try again later"
        });
    }
}

var currentPage = 0;
var st_pagination_button = document.getElementById("casual-pagination-button");
function updateProductView(json) {
    let casual_product_row = document.getElementById("casual-product-row");
    let casual_product = document.getElementById("casual-product");

    //console.log("casual_product_row:", casual_product_row);
    //console.log("casual_product:", casual_product);

    if (!casual_product_row || !casual_product) {
        console.error(`Element with ID casual-product-row or casual-product not found.`);
        return;
    }

    casual_product_row.innerHTML = "";

    json.productList.forEach(product => {
        let casual_product_clone = casual_product.cloneNode(true);

        // Update Item Details
        casual_product_clone.querySelector("#casual-product-a-1").href = "single-product-view.html?id=" + product.id;
        casual_product_clone.querySelector("#casual-product-img-1").src = "product-images/" + product.id + "/image1.png";
        casual_product_clone.querySelector("#casual-product-a-2").href = "single-product-view.html?id=" + product.id;
        casual_product_clone.querySelector("#casual-product-title-1").innerHTML = product.title;
        casual_product_clone.querySelector("#casual-product-brand-1").innerHTML = product.brand.name;
        casual_product_clone.querySelector("#casual-product-color-1").innerHTML = product.color.name;
        casual_product_clone.querySelector("#casual-product-size-1").innerHTML = product.size.name;
        casual_product_clone.querySelector("#casual-product-price-1").innerHTML = "Rs." + new Intl.NumberFormat(
                "en-US",
                {
                    minimumFractionDigits: 2
                }
        ).format(product.price);

        casual_product_row.appendChild(casual_product_clone);
    });

    //load pagination
    let st_pagination_container = document.getElementById("casual-pagination-container");
    st_pagination_container.innerHTML = "";

    let product_count = json.allProductCount;
    const product_per_page = 3;

    let pages = Math.ceil(product_count / product_per_page);

    //add previous arrow
    if (currentPage != 0) {
        let st_pagination_button_clone_prev = st_pagination_button.cloneNode(true);
        st_pagination_button_clone_prev.innerHTML = "Prev";
        st_pagination_button_clone_prev.addEventListener("click", e => {
            currentPage--;
            searchProducts(currentPage * 3);
            e.preventDefault();
        });
        st_pagination_container.appendChild(st_pagination_button_clone_prev);
    }


    //add page buttons
    for (let i = 0; i < pages; i++) {
        let st_pagination_button_clone = st_pagination_button.cloneNode(true);
        st_pagination_button_clone.innerHTML = i + 1;

        st_pagination_button_clone.addEventListener("click", e => {
            currentPage = i;
            searchProducts(i * 3);
            e.preventDefault();
        });

        if (i == currentPage) {
            st_pagination_button_clone.className = "axil-btn btn-bg-secondary me-2";
        } else {
            st_pagination_button_clone.className = "axil-btn btn-bg-primary me-2";
        }

        st_pagination_container.appendChild(st_pagination_button_clone);
    }

    //add next arrow
    if (currentPage != (pages - 1)) {

        let st_pagination_button_clone_next = st_pagination_button.cloneNode(true);
        st_pagination_button_clone_next.innerHTML = "Next";
        st_pagination_button_clone_next.addEventListener("click", e => {
            currentPage++;
            searchProducts(currentPage * 3);
            e.preventDefault();
        });
        st_pagination_container.appendChild(st_pagination_button_clone_next);
    }
}

function reset() {
    window.location = "search.html";
}
