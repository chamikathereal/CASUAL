async function loadProduct() {

    const parameters = new URLSearchParams(window.location.search);

    if (parameters.has("id")) {

        const productId = parameters.get("id");

        const response = await fetch("LoadSingleProduct?id=" + productId);

        if (response.ok) {

            const json = await response.json();

            const id = json.product.id;
            document.getElementById("main-image").src = "product-images/" + id + "/image1.png";
            document.getElementById("fileInput1").src = "product-images/" + id + "/image2.png";
            document.getElementById("fileInput2").src = "product-images/" + id + "/image3.png";
            document.getElementById("fileInput3").src = "product-images/" + id + "/image4.png";
            document.getElementById("fileInput4").src = "product-images/" + id + "/image1.png";

            document.getElementById("product-title").innerHTML = json.product.title;
            document.getElementById("product-published-on").innerHTML = json.product.date_time;

            document.getElementById("product-price").innerHTML = new Intl.NumberFormat(
                    "en-US",
                    {
                        minimumFractionDigits: 2
                    }
            ).format(json.product.price);

            document.getElementById("product-brand").innerHTML = json.product.brand.name;
            document.getElementById("product-size").innerHTML = json.product.size.name;
            document.getElementById("product-quantity").innerHTML = json.product.qty;

            document.getElementById("product-color").innerHTML = json.product.color.name;
            document.getElementById("product-description").innerHTML = json.product.description;

            document.getElementById("add-to-cart-main").addEventListener(
                    "click",
                    (e) => {
                addToCart(
                        json.product.id,
                        document.getElementById("add-to-cart-qty").value
                        );
                e.preventDefault();
            });
            //console.log(json.product.id);

            let productHtml = document.getElementById("similar-product");
            document.getElementById("similar-product-main").innerHTML = "";

            json.productList.forEach(item => {

                let productCloneHtml = productHtml.cloneNode(true);

                productCloneHtml.querySelector("#similar-product-image").src = "product-images/" + item.id + "/image1.png";
                productCloneHtml.querySelector("#similar-product-a1").href = "single-product-view.html?id=" + item.id;
                productCloneHtml.querySelector("#similar-product-a2").href = "single-product-view.html?id=" + item.id;
                productCloneHtml.querySelector("#similar-product-title").innerHTML = item.title;
                productCloneHtml.querySelector("#similar-product-price").innerHTML = "Rs." + new Intl.NumberFormat(
                        "en-US",
                        {
                            minimumFractionDigits: 2
                        }
                ).format(item.price);
                productCloneHtml.querySelector("#similar-product-size").innerHTML = item.size.name;
                productCloneHtml.querySelector("#similar-product-color").innerHTML = item.color.name;

                productCloneHtml.querySelector("#add-to-cart-similar").addEventListener(
                        "click",
                        (e) => {
                    addToCart(item.id, 1);
                    e.preventDefault();
                });

                document.getElementById("similar-product-main").appendChild(productCloneHtml);
                //console.log(productCloneHtml);
            });

            var swiper = new Swiper(".mySwiper", {
                spaceBetween: 30,
                loop: true, // Enable infinite loop
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                },
                breakpoints: {
                    // When window width is less than 768px (mobile devices)
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
            window.location = "index.html";
        }

    } else {
        window.location = "index.html";
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