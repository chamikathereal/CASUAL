async function loadProdcutForIndex() {
    const response = await fetch("LoadData");
    const popup = Notification();
    popup.setProperty({
        duration: 5000,
        isHidePrev: true
    });
    
    if (response.ok) {
        const json = await response.json();

        if (json.success) {
            // Define `productHtml` by selecting the template element to clone
            const productHtml = document.querySelector("#similar-product");

            // Loop through each product in the response
            json.productList.forEach(item => {
                // Clone the template element
                let productCloneHtml = productHtml.cloneNode(true);
                productCloneHtml.style.display = ""; // Make sure it's visible

                // Set image source and product links
                productCloneHtml.querySelector("#similar-product-image").src = "product-images/" + item.id + "/image1.png";
                productCloneHtml.querySelector("#similar-product-a1").href = "single-product-view.html?id=" + item.id;
                productCloneHtml.querySelector("#similar-product-a2").href = "single-product-view.html?id=" + item.id;

                // Set product title and price
                productCloneHtml.querySelector("#similar-product-title").innerHTML = item.title;
                productCloneHtml.querySelector("#similar-product-price").innerHTML = "Rs. " + new Intl.NumberFormat(
                    "en-US",
                    {
                        minimumFractionDigits: 2
                    }
                ).format(item.price);

                // Safely set product size and color (assuming they are objects with `name` properties)
                productCloneHtml.querySelector("#similar-product-size").innerHTML = item.size ? item.size.name : "N/A";
                productCloneHtml.querySelector("#similar-product-color").innerHTML = item.color ? item.color.name : "N/A";

                // Add to cart event listener
                productCloneHtml.querySelector("#add-to-cart-similar").addEventListener("click", (e) => {
                    addToCart(item.id, 1); // Assuming `addToCart` is defined elsewhere
                    e.preventDefault();
                });

                // Append the clone to the Swiper wrapper
                document.getElementById("similar-product-main").appendChild(productCloneHtml);
            });

            // Initialize Swiper after adding all slides
            var swiper = new Swiper(".mySwiper", {
                spaceBetween: 30,
                loop: true, // Enable infinite loop
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                },
                breakpoints: {
                    // When window width is less than 576px (mobile devices)
                    576: {
                        slidesPerView: 1,
                    },
                    // When window width is between 768px and 1024px (tablets, small screens)
                    768: {
                        slidesPerView: 2, // Show 2 slides on tablets
                    },
                    // Default for laptops and desktops
                    993: {
                        slidesPerView: 3, // Show 3 slides on laptops and desktops
                    },
                },
            });
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

async function loadBrandProducts() {
    const response = await fetch("LoadBrandProducts");
    
    if (response.ok) {
        const json = await response.json();
        
        if (json.success) {
            // Loop through each brand
            json.brandsWithProducts.forEach(brand => {
                // Create a section for the brand
                let brandSection = document.createElement("div");
                brandSection.classList.add("brand-section");

                // Add brand title
                let brandTitle = document.createElement("h3");
                brandTitle.innerText = `Hot Deals for ${brand.brandName}`;
                brandSection.appendChild(brandTitle);

                // Create a swiper container for products
                let swiperContainer = document.createElement("div");
                swiperContainer.classList.add("swiper", "mySwiper");
                let swiperWrapper = document.createElement("div");
                swiperWrapper.classList.add("swiper-wrapper");

                // Loop through each product for this brand
                brand.products.forEach(item => {
                    let productCloneHtml = document.querySelector("#similar-product").cloneNode(true);
                    productCloneHtml.style.display = ""; // Make it visible

                    // Set product details
                    productCloneHtml.querySelector("#similar-product-image").src = "product-images/" + item.id + "/image1.png";
                    productCloneHtml.querySelector("#similar-product-a1").href = "single-product-view.html?id=" + item.id;
                    productCloneHtml.querySelector("#similar-product-title").innerText = item.title;
                    productCloneHtml.querySelector("#similar-product-price").innerText = `Rs. ${item.price}`;
                    productCloneHtml.querySelector("#similar-product-size").innerText = item.size ? item.size.name : "N/A";
                    productCloneHtml.querySelector("#similar-product-color").innerText = item.color ? item.color.name : "N/A";

                    // Add event listener to the "Add to Cart" button
                    productCloneHtml.querySelector("#add-to-cart-similar").addEventListener("click", (e) => {
                        addToCart(item.id, 1);
                        e.preventDefault();
                    });

                    // Add this product to the swiper wrapper
                    swiperWrapper.appendChild(productCloneHtml);
                });

                // Append the swiper wrapper and pagination to the swiper container
                swiperContainer.appendChild(swiperWrapper);
                let swiperPagination = document.createElement("div");
                swiperPagination.classList.add("swiper-pagination");
                swiperContainer.appendChild(swiperPagination);

                // Add the swiper container to the brand section
                brandSection.appendChild(swiperContainer);

                // Finally, append the brand section to the page
                document.getElementById("brand-hot-deals").appendChild(brandSection);

                // Initialize Swiper for this brand section
                new Swiper(".mySwiper", {
                    spaceBetween: 30,
                    loop: true,
                    pagination: {
                        el: ".swiper-pagination",
                        clickable: true,
                    },
                    breakpoints: {
                        576: {
                            slidesPerView: 1,
                        },
                        768: {
                            slidesPerView: 2,
                        },
                        993: {
                            slidesPerView: 3,
                        },
                    },
                });
            });
        } else {
            console.error("Failed to load brand products");
        }
    } else {
        console.error("Failed to fetch brand products");
    }
}

async function addToCart(id, qty) {
    //console.log("id" + id);
    //console.log("qty" + qty);

    const response = await fetch(
            "AddToCart?id=" + id + "&qty=" + qty
            );
    
    const popup = Notification();
    
    if (response.ok) {
        const json = await response.json();

        popup.setProperty({
            duration: 5000,
            isHidePrev: true
        });

        if (json.success) {

            popup.success({
                message: json.content
            });

        } else {

            popup.error({
                message: json.content
            });

        }

    } else {
        popup.error({
            message: "Unable to process your request"
        });
    }

}