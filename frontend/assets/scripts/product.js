displayProduct();

function displayProduct() {
    const content = document.getElementById("product");
    let link = window.location.href;

    fetch("/api/products")
        .then(r => r.json())
        .then(products => products.forEach(product => {
            if (product.id == link.substr(link.length - 3, 3)) {
                let price = Number(product.normalPrice).toFixed(2);
                let specialPrice = Number(product.specialOffer).toFixed(2);

                let html = 
                `<div class="item">
                        <div class="item_body">
                            <a class="item_img">
                                <img class="item_img" src="/assets/images/${product.imageName}">
                            </a>
                            <div class="item_desc">
                                <h1>${product.productName}</h1>
                                <p>${product.description}</p>
                                <div>
                                    <p class="item_price_normal">CHF ${price}</p>
                                    <p class="item_price_special">CHF ${specialPrice}</p>
                                </div>
                                <input class="item_tocart" type="button" onclick="addtocart()" value="In Warenkorb legen" />
                            </div>
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

    createhead();
}