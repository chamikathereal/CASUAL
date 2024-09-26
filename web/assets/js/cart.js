async function loadCartItems() {

    const response = await fetch("LoadCartItems");
    const popup = Notification();
    

    if (response.ok) {

        const json = await response.json();
      
        popup.setProperty({
            duration: 5000,
            isHidePrev: true
        });

        if (json.length == 0) {
            
            let cartItemContainer = document.getElementById("cart-item-container");
            let cartItemRow = document.getElementById("cart-item-row");

            cartItemContainer.innerHTML = "";

            popup.error({
                message: "Cart is empty"
            });

            //window.location = "index.html";

        } else {
            console.log(json);
            let cartItemContainer = document.getElementById("cart-item-container");
            let cartItemRow = document.getElementById("cart-item-row");

            cartItemContainer.innerHTML = "";

            let totalQty = 0;
            let total = 0;

            json.forEach(item => {

                let itemSubTotal = item.product.price * item.qty;

                totalQty += item.qty;
                total += itemSubTotal;

                let cartItemRowClone = cartItemRow.cloneNode(true);
                cartItemRowClone.querySelector("#cart-item-a").href = "single-product-view.html?id=" + item.product.id;
                cartItemRowClone.querySelector("#cart-item-img").src = "product-images/" + item.product.id + "/image2.png";
                cartItemRowClone.querySelector("#cart-item-title").innerHTML = item.product.title;
                cartItemRowClone.querySelector("#cart-item-price").innerHTML = new Intl.NumberFormat(
                        "en-US",
                        {
                            minimumFractionDigits: 2
                        }
                ).format(item.product.price);
                cartItemRowClone.querySelector("#cart-item-qty").value = item.qty;
                cartItemRowClone.querySelector("#cart-item-subtotal").innerHTML = new Intl.NumberFormat(
                        "en-US",
                        {
                            minimumFractionDigits: 2
                        }
                ).format(itemSubTotal);

                cartItemContainer.appendChild(cartItemRowClone);
                 console.log(json);
            });

            document.getElementById("cart-total-qty").innerHTML = totalQty;
            document.getElementById("cart-total").innerHTML = "Rs." + new Intl.NumberFormat(
                    "en-US",
                    {
                        minimumFractionDigits: 2
                    }
            ).format(total);
     console.log(json);
    

        }

    } else {
        popup.error({
            message: "Unable to process your request"
        });
    }

}