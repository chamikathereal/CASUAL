//Payment completed.It can be a successful failure.
payhere.onCompleted = function onCompleted(orderId) {

    const popup = Notification();
    popup.setProperty({
        duration: 5000,
        isHidePrev: true
    });

    popup.success({
        message: "Order Placed. Thank You..."
    });

    window.location = "index.html";

};

//Payment window closed
payhere.onDismissed = function onDismissed() {
    // Note: Prompt user to pay again or show an error page
    console.log("Payment dismissed");
};

//Error occurred
payhere.onError = function onError(error) {
    // Note: show an error page
    console.log("Error:" + error);
};

async function loadData() {

    const popup = Notification();

    const response = await fetch(
            "LoadCheckout"
            );
    if (response.ok) {

        const json = await response.json();
        //console.log(json);
        if (json.success) {

            const address = json.address;
            const cityList = json.cityList;
            const cartList = json.cartList;

            //load city
            let citySelect = document.getElementById("city");
            citySelect.length = 1;

            cityList.forEach(city => {

                let cityOption = document.createElement("option");
                cityOption.value = city.id;
                cityOption.innerHTML = city.name;
                citySelect.appendChild(cityOption);
            });

            //load current address
            let currnetAddressCheckbox = document.getElementById("currentAddressCheckBox");
            currnetAddressCheckbox.addEventListener("change", e => {

                let first_name = document.getElementById("first-name");
                let last_name = document.getElementById("last-name");
                let city = document.getElementById("city");
                let address1 = document.getElementById("address1");
                let address2 = document.getElementById("address2");
                let postal_code = document.getElementById("postal-code");
                let mobile = document.getElementById("mobile");

                if (currnetAddressCheckbox.checked) {

                    first_name.value = address.first_name;
                    last_name.value = address.last_name;
                    first_name.disabled = true;

                    last_name.disabled = true;

                    city.value = address.city.id;
                    city.disabled = true;
                    city.dispatchEvent(new Event("change")); //balen event ekk call krn wdiy

                    address1.value = address.line1;
                    address1.disabled = true;
                    address2.value = address.line2;
                    address2.disabled = true;
                    postal_code.value = address.postal_code;
                    postal_code.disabled = true;
                    mobile.value = address.mobile;
                    mobile.disabled = true;
                } else {

                    first_name.value = "";
                    first_name.disabled = false;
                    last_name.value = "";
                    last_name.disabled = false;

                    city.value = 0;
                    city.disabled = false;
                    city.dispatchEvent(new Event("change"));

                    address1.value = "";
                    address1.disabled = false;
                    address2.value = "";
                    address2.disabled = false;
                    postal_code.value = "";
                    postal_code.disabled = false;
                    mobile.value = "";
                    mobile.disabled = false;
                }
            });

            //load cart items
            let casual_checkout_body = document.getElementById("casual-checkout-body");

            let casual_items = document.getElementById("casual-items");
            let casula_order_subtotal = document.getElementById("casula-order-subtotal");
            let casula_order_shipping = document.getElementById("casula-order-shipping");
            let casula_order_total = document.getElementById("casula-order-total");

            casual_checkout_body.innerHTML = "";

            let sub_total = 0;

            cartList.forEach(item => {

                let casual_items_clone = casual_items.cloneNode(true);
                casual_items_clone.querySelector("#casual-item-title").innerHTML = item.product.title;
                casual_items_clone.querySelector("#casual-item-qty").innerHTML = item.qty;

                let item_sub_total = item.product.price * item.qty;
                sub_total += item_sub_total;

                casual_items_clone.querySelector("#casual-item-subtotal").innerHTML = "Rs. " + new Intl.NumberFormat(
                        "en-US",
                        {
                            minimumFractionDigits: 2
                        }
                ).format(item_sub_total);

                casual_checkout_body.appendChild(casual_items_clone);

            });

            casula_order_subtotal.querySelector("#casual-full-subtotal").innerHTML = "Rs. " + new Intl.NumberFormat(
                    "en-US",
                    {
                        minimumFractionDigits: 2
                    }
            ).format(sub_total);
            casual_checkout_body.appendChild(casula_order_subtotal);

            //seact cities for eash shipping cost
            citySelect.addEventListener("change", e => {

                //cart item count
                let item_count = cartList.length;

                let shipping_amount = 0;

                //check city
                if (citySelect.value == 0) {

                    let shipping_charges = document.getElementById("casula-order-shipping");
                    shipping_charges.remove();

                } else if (citySelect.value == 1) {

                    //colombo
                    shipping_amount = item_count * 350;

                } else {

                    //not colombo
                    shipping_amount = item_count * 500;
                }

                casula_order_shipping.querySelector("#casual-shipping-amount").innerHTML = "Rs. " + new Intl.NumberFormat(
                        "en-US",
                        {
                            minimumFractionDigits: 2
                        }
                ).format(shipping_amount);
                casual_checkout_body.appendChild(casula_order_shipping);

                // Add a custom <hr> tag after each product item


                //update total
                casula_order_total.querySelector("#casual-order-total").innerHTML = "Rs. " + new Intl.NumberFormat(
                        "en-US",
                        {
                            minimumFractionDigits: 2
                        }
                ).format((sub_total + shipping_amount));
                casual_checkout_body.appendChild(casula_order_total);

            });
            //city.dispatchEvent(new Event("change"));

        } else {

            window.location = "sign-in.html";
        }

    }

}

async function checkout() {

    //console.log("hi");

    let isCurrentAddress = document.getElementById("currentAddressCheckBox").checked;

    //get address
    let first_name = document.getElementById("first-name");
    let last_name = document.getElementById("last-name");
    let city = document.getElementById("city");
    let address1 = document.getElementById("address1");
    let address2 = document.getElementById("address2");
    let postal_code = document.getElementById("postal-code");
    let mobile = document.getElementById("mobile");

    //request data as json
    const data = {
        isCurrentAddress: isCurrentAddress,
        first_name: first_name.value,
        last_name: last_name.value,
        city_id: city.value,
        address1: address1.value,
        address2: address2.value,
        postal_code: postal_code.value,
        mobile: mobile.value
    };

    const response = await fetch(
            "Checkout",
            {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }

            }
    );

    const popup = Notification();
    popup.setProperty({
        duration: 5000,
        isHidePrev: true
    });

    if (response.ok) {

        const json = await response.json();

        if (json.success) {

            //console.log(json);
            payhere.startPayment(json.payhereJson);
            
            //window.location = "index.html";

        } else {
            
        }

    } else {
        popup.error({
            message: "Try again later"
        });
    }
}