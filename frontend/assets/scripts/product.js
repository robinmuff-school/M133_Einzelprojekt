const content = document.getElementById("product");

displayProduct();

function displayProduct() {
    let link = window.location.href;

    fetch("/api/products")
        .then(r => r.json())
        .then(products => products.forEach(product => {
            if (product.id == link.substr(link.length - 3, 3)) {
                let price = Number(product.normalPrice).toFixed(2);
                let specialPrice = Number(product.specialOffer).toFixed(2);

                let html = 
                `<div class="item">
                        <div class="item_title">
                            <h1 class="title">${product.productName}</h1>
                        </div>
                        <div class="item_body">
                            <img class="item_img" src="/assets/images/${product.imageName}">
                            <p class="item_description">${product.description}</p>
                            <div class="item_price">
                                <p class="item_price_normal">${price} CHF</p>
                                <p class="item_price_special">${specialPrice} CHF</p>
                            </div>
                            <input class="item_tocart" type="button" onclick="addtocart()" value="In Warenkorb legen" />
                        </div>
                </div>`;
                content.innerHTML += html;
            }
        }));
}

async function addtocart() {
    let link = window.location.href;
    let id = link.substr(link.length - 3, 3);

    await fetch(
        "/api/shoppingcart/" + id,
        {
            body: "",
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST"
    });
}