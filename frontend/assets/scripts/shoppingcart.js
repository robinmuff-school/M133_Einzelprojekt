const content = document.getElementById("cart");
let localcart = [];
let localcart_ammount = [];

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
        if (usercart.length == 0) {
            isitemincart = false;
        }
    } catch {};
    if (isitemincart) {   
        let table = "<table id=\"cart_table\" class=\"table\"><tbody id=\"cart_table_body\"><tr><th>Produkt</th><th>Einzelpreis</th><th>Anzahl</th><th>Total</th></tr></tbody></table>";
        document.getElementById("cart").innerHTML += table;

        localcart = [];
        localcart_ammount = [];
        for (let i = 0; i < usercart.length; i++) {
            let isset = false;
            for (let y = 0;y < localcart.length; y++) {
                if (usercart[i] == localcart[y]) {
                    localcart_ammount[y]++;
                    isset = true;
                }
            }
            if(!isset) {
                localcart.push(usercart[i]);
                localcart_ammount.push(1);
            }
        }

        let html = "";
        let totalprice = 0;
        for (let i = 0; i < localcart.length; i++) {
            let item;
            products.forEach(element => {
                if (element.id == localcart[i]) {
                    item = element;
                }
            });
    
            let title = item.productName;
            let price = item.specialOffer.toFixed(2);
            let amount = localcart_ammount[i];
            let total = (price * amount).toFixed(2);
            totalprice = totalprice + (price * amount);
    
            html += "<tr><td>"+title+"</td><td>CHF "+price+"</td><td><button onclick=\"oneless("+i+")\">-</button><a> "+amount+" </a><button onclick=\"onemore("+i+")\">+</button></td><td>CHF "+total+"</td></tr>";
        }
        html += "<tr><td></td><td></td><td></td><td>CHF "+totalprice.toFixed(2)+"</td></tr>";

        document.getElementById("cart_table_body").innerHTML += html;
    } else {
        let html = "<p>Einkaufswagen leer</p>"
        content.innerHTML = html;
    }
}

async function onemore(id) {
    localcart_ammount[id]++;
    let newarr = [];

    for (let i = 0; i < localcart.length; i++) {
        for (let y = 0; y < localcart_ammount[i]; y++) {
            newarr.push(localcart[i]);
        }
    }

    await fetch(
        "/api/shoppingcart",
        {
            body: JSON.stringify(newarr),
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST"
    });

    loadPage();
    createhead();
}

async function oneless(id) {
    localcart_ammount[id]--;
    let newarr = [];

    for (let i = 0; i < localcart.length; i++) {
        for (let y = 0; y < localcart_ammount[i]; y++) {
            newarr.push(localcart[i]);
        }
    }

    await fetch(
        "/api/shoppingcart",
        {
            body: JSON.stringify(newarr),
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST"
    });

    loadPage();
    createhead();
}