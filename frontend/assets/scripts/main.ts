/// <reference lib="dom" />

//import { Product, ShoppingCart } from "..../classes/types.ts";

export async function loadPage() {
    if (window.location.pathname == "/" || window.location.pathname == "") {
        const body = document.getElementById("products");

        /*fetch("/api/products")
            .then(r => r.json())
            .then(products => products.forEach(product => {
                let price = Number(product.normalPrice).toFixed(2);
                let specialPrice = Number(product.specialOffer).toFixed(2);
            
                body.innerHTML += `
                <div class="item">
                    <a class="item_link" href="/product/${product.id}">
                        <img class="item_img" src="/assets/images/${product.imageName}"}>
                        <p class="item_title">${product.productName}</p>
                        <div class="item_price">
                            <p class="item_price_normal">CHF ${price}</p>
                            <p class="item_price_special">CHF ${specialPrice}</p>
                        </div>
                    </a>
                </div>
                `
            }));*/
    }

    if ((window.location.pathname == "/product/".slice(12,9))) {
        const content = document.getElementById("product");
        let link = window.location.href;

        /*fetch("/api/products")
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
                                    <h2>${product.productName}</h2>
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
        }));*/
    }

    if (window.location.pathname == "/shoppingcart") {
        /*document.getElementById("cart").innerHTML = "";
    
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
            html += "<tr><td></td><td></td><td></td><td><a href=\"/checkout\"><button>Bestellung abschliessen</button><a></td></tr>";
    
            document.getElementById("cart_table_body").innerHTML += html;
        } else {
            let html = "<p>Einkaufswagen leer</p>"
            content.innerHTML = html;
        }*/
    }

    if (window.location.pathname == "/checkout") {
        const content = document.getElementById("form");
    
        let html = `
        <div class="form-style">
            <form action="/api/order" method="POST" id="Form">
                <label for="prename">
                    <span>Vorname<span class="required">*</span></span>
                    <input type="text" class="input-field" name="prename" id="prename" value="" required/>
                </label>
                <label for="lastname">
                    <span>Nachname<span class="required">*</span></span>
                    <input type="text" class="input-field" name="lastname" value="" required/>
                </label>
                <label for="email">
                    <span>Email<span class="required">*</span></span>
                    <input type="email" class="input-field" name="email" value="" required/>
                </label>

                <label><span> </span><input type="submit" value="Submit" /></label>
            </form>
        </div>
        `;

        /*content.innerHTML = html;*/
    }
}

async function createhead() {
    let head = document.head;
    let stylesheet = document.createElement("link");
    stylesheet.type = "text/css";
    stylesheet.rel = "stylesheet";
    stylesheet.href = "/assets/css/main.css";
    head.appendChild(stylesheet);

    let header = document.getElementById("header");
    let total_response = await fetch("/api/shoppingcart/totalprice");
    let total;
    try {
        total = "CHF 0.0"
        total = await total_response.json();
    } catch {};
    let htmlheader = `
    <a class="header" href="/"><h1>Dorfladen by Robin Muff</h1></a>
    <div class="cart">
        <a class="cart" href="/shoppingcart">
            <img class="cart_img" src="/assets/images/cart.jpg">
        </a>
        <p>CHF ${total.toFixed(2)}</p>
    </div>
    `;
    /*header.innerHTML = htmlheader;*/
}