const loadFeatures = async () => {
    const response = await fetch(
            "LoadFeatures"
            );

    if (response.ok) {
        const json = await response.json();
        console.log(json);

        const brandList = json.brandList;
        const sizeList = json.sizeList;
        const colorList = json.colorList;

        loadSelect("brandSelect", brandList, "name");
        loadSelect("sizeSelect", sizeList, "name");
        loadSelect("colorSelect", colorList, "name");


    } else {
        document.getElementById("message").innerHTML = "Please try again later";
    }
};

const loadSelect = (selectTagId, list, property) => {

    const selectTag = document.getElementById(selectTagId);
    list.forEach(item => {
        let optionTag = document.createElement("option");
        optionTag.value = item.id;
        optionTag.innerHTML = item[property];
        selectTag.appendChild(optionTag);
    });

};

const productListing = async  () => {

    const titleTag = document.getElementById("title");
    const brandSelectTag = document.getElementById("brandSelect");
    const sizeSelectTag = document.getElementById("sizeSelect");
    const colorSelectTag = document.getElementById("colorSelect");
    const priceTag = document.getElementById("price");
    const qtyTag = document.getElementById("qty");
    const descriptionTag = document.getElementById("description");



    const image1Tag = document.getElementById("fileInput1");
    const image2Tag = document.getElementById("fileInput2");
    const image3Tag = document.getElementById("fileInput3");
    const image4Tag = document.getElementById("fileInput4");

    const data = new FormData();

    data.append("title", titleTag.value);

    data.append("brandId", brandSelectTag.value);
    data.append("sizeId", sizeSelectTag.value);
    data.append("colorId", colorSelectTag.value);
    data.append("price", priceTag.value);
    data.append("qty", qtyTag.value);
    data.append("description", descriptionTag.value);
    data.append("image1", image1Tag.files[0]);
    data.append("image2", image2Tag.files[0]);
    data.append("image3", image3Tag.files[0]);
    data.append("image4", image4Tag.files[0]);

    const response = await fetch(
            "ProductListing",
            {
                method: "POST",
                body: data

            }
    );

    const popup = Notification();

    popup.setProperty({

        isHidePrev: true

    });



    if (response.ok) {
        const json = await response.json();
        console.log(json);

        if (json.success) {
            titleTag.value = "";
            brandSelectTag.value = 0;
            sizeSelectTag.value = 0;
            colorSelectTag.value = 0;
            priceTag.value = "";
            qtyTag.value = "";

            descriptionTag.value = "";
            image1Tag.src = "";
            image2Tag.src = "";
            image3Tag.src = "";
            image4Tag.src = "";

            popup.success({
                title: 'Success',
                message: json.content
            });


        } else {


            popup.error({
                title: 'Error',
                message: json.content
            });

        }


    } else {

        popup.error({
            title: 'Error',
            message: json.content
        });
    }



};