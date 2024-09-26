async function checkSignIn() {

    const response = await fetch("CheckSignInProcess");

    if (response.ok) {

        const json = await response.json();
        console.log(json);

        const response_DTO = json.response_DTO;

        if (response_DTO.success) {
            //console.log(json);
            //sign in   casual-user-name casual-sign-process 
            const user = response_DTO.content;

            let casual_quick_links = document.getElementById("casual-quick-links");

            let casual_user_name = document.getElementById("casual-user-name");
            casual_user_name.remove();

            let sign_in_button = document.getElementById("sign-in-tag");
            sign_in_button.remove();

            let new_casual_user_name_tage = document.createElement("li");
            new_casual_user_name_tage.innerHTML = 'Hi <span style="color: #b56700; font-weight:bold;">' + user.first_name + '!</span>';
            casual_quick_links.appendChild(new_casual_user_name_tage);
            
            let casual_sign_process_button = document.getElementById("casual-sign-process");
            casual_sign_process_button.href = "SignOutProcess";
            casual_sign_process_button.innerHTML = "Sign Out";
            //new_li_a_tag.href = "#";


            //new_li_tag1.appendChild(new_li_a_tag);



        } else {

            // If not signed in
            let casual_quick_links1 = document.getElementById("casual-quick-links");
            let wishlist = document.getElementById("wishlist");
            wishlist.remove();

            let user_button = document.getElementById("user-button");
            if (user_button) {
                user_button.remove();  // Remove user button if it exists
            }

            // Create the "Sign In" option
            let sign_in_tag = document.getElementById("sign-in-tag");

            sign_in_tag = document.createElement("li");
            sign_in_tag.classList.add("nav-item");
            sign_in_tag.id = "sign-in-tag";

            // Add the "Sign In" anchor tag
            //sign_in_tag.innerHTML = '<a href="/login" style="color: #b56700; font-weight: bold; text-decoration: none;">Sign Innn</a>';

            // Append the "Sign In" option to the casual quick links
            casual_quick_links1.appendChild(sign_in_tag);


        }

//        const productList = json.products;
//
//        let i = 1;
//        productList.forEach(product => {
//            document.getElementById("st-product-title-" + i).innerHTML = product.title;
//            document.getElementById("st-product-link-" + i).href = "single-product.html?id=" + product.id;
//            document.getElementById("st-product-image-" + i).src = "product-images/" + product.id + "/image1.png";
//            document.getElementById("st-product-price-" + i).innerHTML = new Intl.NumberFormat(
//                    "en-US",
//                    {
//                        minimumFractionDigits: 2
//                    }
//            ).format((product.price));
//            i++;
//        });
//
//        $('.slider-content-activation-one').slick({
//            infinite: true,
//            slidesToShow: 1,
//            slidesToScroll: 1,
//            arrows: false,
//            dots: false,
//            focusOnSelect: false,
//            speed: 500,
//            fade: true,
//            autoplay: false,
//            asNavFor: '.slider-thumb-activation-one',
//        });
//
//        $('.slider-thumb-activation-one').slick({
//            infinite: true,
//            slidesToShow: 2,
//            slidesToScroll: 1,
//            arrows: false,
//            dots: true,
//            focusOnSelect: false,
//            speed: 1000,
//            autoplay: true,
//            asNavFor: '.slider-content-activation-one',
//            prevArrow: '<button class="slide-arrow prev-arrow"><i class="fal fa-long-arrow-left"></i></button>',
//            nextArrow: '<button class="slide-arrow next-arrow"><i class="fal fa-long-arrow-right"></i></button>',
//            responsive: [{
//                    breakpoint: 991,
//                    settings: {
//                        slidesToShow: 1,
//                    }
//                }
//            ]
//
//        });

    }

}

//async function viewCart() {
//
//    const response = await fetch("cart.html");
//
//    if (response.ok) {
//
//        const cartHtmlText = await response.text();
//
//        const parser = new DOMParser();
//        const cartHtml = parser.parseFromString(cartHtmlText, "text/html");
//
//        const cart_main = cartHtml.querySelector(".main-wrapper");
//
//        document.querySelector(".main-wrapper").innerHTML = cart_main.innerHTML;
//
//        loadCartItems();
//
//    }
//
//}