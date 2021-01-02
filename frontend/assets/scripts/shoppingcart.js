const content = document.getElementById("cart");
let localcart = [];

loadPage();

async function loadPage() {
    document.getElementById("cart").innerHTML = "";
    
    let isitemincart = false;
    let products_response = await fetch("/api/products");
    let products = await products_response.json();
    let usercart_response = await fetch("/api/shoppingcart");
    let usercart;
    try {
        usercart = await usercart_response.json();
        if (usercart != undefined) {
            isitemincart = true;
        }
    } catch {};
    if (isitemincart) {   
        let table = "<table id=\"cart_table\" class=\"table\"><tbody id=\"cart_table_body\"><tr><th>Produkt</th><th>Einzelpreis</th><th>Anzahl</th><th>Total</th></tr></tbody></table>";
        document.getElementById("cart").innerHTML += table;

        for (let uitemindex = 0; uitemindex < usercart.length; uitemindex++) {
            isset = false;
            for (let litemindex = 0; litemindex < localcart.length; litemindex+=2) {
                if (usercart[uitemindex] == localcart[litemindex]) {
                    localcart[litemindex + 1] = localcart[litemindex + 1] + 1;
                    isset = true;
                }
            }
            if (!isset) {
                localcart.push(usercart[uitemindex]);
                localcart.push(1);
            }
        }

        let html = "";
        for (let i = 0; i < localcart.length; i+=2) {
            let item;
            products.forEach(element => {
                if (element.id == localcart[i]) {
                    item = element;
                }
            });
    
            let title = item.productName;
            let price = item.specialOffer.toFixed(2);
            let amount = localcart[i + 1];
            let total = (price * amount).toFixed(2);
    
            html += "<tr><td>"+title+"</td><td>"+price+"</td><td><button onclick=\"oneless("+i+")\">-</button><a> "+amount+" </a><button onclick=\"onemore("+i+")\">+</button></td><td>"+total+"</td></tr>";
        }

        document.getElementById("cart_table_body").innerHTML += html;
    } else {
        let html = "<p>Einkaufswagen leer</p>"
        content.innerHTML = html;
    }
}

async function onemore(id) {
    console.log(id)
    console.log(localcart[id + 1]);
    localcart[id + 1] = localcart[id + 1] + 1;

    console.log(JSON.stringify(localcart))

    await fetch(
        "/api/shoppingcart",
        {
            body: JSON.stringify(localcart),
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST"
    });

    //loadPage();
}

async function oneless(button) {

}