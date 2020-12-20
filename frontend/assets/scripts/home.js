const body = document.getElementById("products");


fetch("/api/products")
    .then(r => r.json())
    .then(products => products.forEach(product => {
        let price = Number(product.normalPrice).toFixed(2);
        let specialPrice = Number(product.specialOffer).toFixed(2);

        body.innerHTML += 
        `
        <div class="item">
            <a class="item_link" href="/product/${product.id}">
                <img class="item_img" src="/assets/images/${product.imageName}"}>
                <p class="item_title">${product.productName}</p>
                <div class="item_price">
                    <p class="item_price_normal">${price} CHF</p>
                    <p class="item_price_special">${specialPrice} CHF</p>
                </div>
            </a>
        </div>
        `
    }));