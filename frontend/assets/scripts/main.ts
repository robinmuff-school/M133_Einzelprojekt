/// <reference lib="dom" />
import { Product, ShoppingCart } from "../../../classes/types.ts";
let localcart:Product[] = [];
let localcart_ammount:number[] = [];

export async function loadPage() {
    const content:Element = document.getElementById("main");
    let products:Product[] = await (await fetch("/api/products")).json()

    addStyleSheet('/assets/css/main.css')
    createhead();

    if (window.location.pathname == "/" || window.location.pathname == "") {
        addStyleSheet('/assets/css/indexstyle.css');

        products.forEach(element => {
            let pricehtml;
            
            if (element.specialOffer == 0) {
                pricehtml = 
                `div class="item_price">
                    <p>${element.normalPrice.toFixed(2)}</p>
                </div>
                `
            } else {
                pricehtml = 
                `<div class="item_price">
                    <p class="item_price_normal">CHF ${element.normalPrice.toFixed(2)}</p>
                    <p class="item_price_special">CHF ${element.specialOffer.toFixed(2)}</p>
                </div>
                `
            }

            content.innerHTML += `
                <div class="item">
                    <a class="item_link" href="/product/${element.id}">
                        <img class="item_img" src="/assets/images/${element.imageName}"}>
                        <p class="item_title">${element.productName}</p>
                        ${pricehtml}
                    </a>
                </div>
                `
        });
    }

    if (window.location.pathname.slice(0, 8) == "/product") {
        addStyleSheet('/assets/css/productstyle.css');
        let productid = Number(window.location.pathname.slice(9, 12));

        products.forEach(element => {
            if (element.id == productid) {
                let pricehtml;
                if (element.specialOffer == 0) {
                    pricehtml = 
                    `div class="item_price">
                        <p>${element.normalPrice.toFixed(2)}</p>
                    </div>
                    `
                } else {
                    pricehtml = 
                    `<div class="item_price">
                        <p class="item_price_normal">CHF ${element.normalPrice.toFixed(2)}</p>
                        <p class="item_price_special">CHF ${element.specialOffer.toFixed(2)}</p>
                    </div>
                    `
                }


                let html = 
                `<div class="item">
                        <div class="item_body">
                            <a class="item_img">
                                <img class="item_img" src="/assets/images/${element.imageName}">
                            </a>
                            <div class="item_desc">
                                <h2>${element.productName}</h2>
                                <p>${element.description}</p>
                                ${pricehtml}
                                <input id="addtocart" class="item_tocart" type="button" value="In Warenkorb legen" />
                            </div>
                        </div>
                </div>`;
                content.innerHTML = html;

                document.getElementById("addtocart").addEventListener("click", addtocart);
            }
        })
    }

    if (window.location.pathname == "/shoppingcart") {
        addStyleSheet("/assets/css/shoppingcartstyle.css")
        let usercart:ShoppingCart = await (await fetch("/api/shoppingcart")).json();

        console.log(usercart)
        
        let html = "";
        let isitemincart:Boolean = true;
        if (usercart.products == undefined) {
            isitemincart = false;
        }
        if (usercart.products.length == 0) {
            isitemincart = false
        }

        if (isitemincart) {
            let table = "<table id=\"cart_table\" class=\"table\"><tbody id=\"cart_table_body\"><tr><th>Produkt</th><th>Einzelpreis</th><th>Anzahl</th><th>Total</th></tr></tbody></table>";
            document.getElementById("main").innerHTML = table;

            localcart = new Array<Product>();
            localcart_ammount = new Array<number>();
            for (let i = 0; i < usercart.products.length; i++) {
                let isset = false;
                for (let y = 0;y < localcart.length; y++) {
                    if (usercart.products[i].id == localcart[y].id) {
                        localcart_ammount[y]++;
                        isset = true;
                    }
                }
                if(!isset) {
                    localcart.push(usercart.products[i]);
                    localcart_ammount.push(1);
                }
            }

            let html = "";
            let totalprice = 0;
            for (let i = 0; i < localcart.length; i++) {
                let item:Product;
                products.forEach(element => {
                    if (element.id == localcart[i].id) {
                        item = element;
                    }
                });
        
                let title = item.productName;
                let price = item.specialOffer||item.normalPrice;
                let amount = localcart_ammount[i];
                let total = (price * amount).toFixed(2);
                totalprice = totalprice + (price * amount);
        
                html = `<tr><td>`+title+`</td><td>CHF `+price.toFixed(2)+`</td><td><button id="btn_less_`+i+`">-</button><a> `+amount+` </a><button id="btn_more_`+i+`">+</button></td><td>CHF `+total+`</td></tr>`;
                document.getElementById("cart_table_body").innerHTML += html;
            }
            html = "<tr><td></td><td></td><td></td><td>CHF "+totalprice.toFixed(2)+"</td></tr>";
            
            html += "<tr><td></td><td></td><td></td><td><a href=\"/checkout\"><button>Bestellung abschliessen</button><a></td></tr>";
    
            document.getElementById("cart_table_body").innerHTML += html;

            for (let i = 0; i < localcart.length; i++) {
                document.getElementById("btn_less_" + i).addEventListener("click", async () => {
                    console.log("LOG less")
                    await oneless(i);
                });
                document.getElementById("btn_more_" + i).addEventListener("click", async () => {
                    await onemore(i);
                });
            }
        } else {
            html += '<p class="empty">Einkaufswagen ist leer</p>';
            content.innerHTML = html;
        }
    }

    if (window.location.pathname == "/checkout") {
        addStyleSheet("/assets/css/checkoutstyle.css")

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

        content.innerHTML = html;
    }

    if (window.location.pathname == "/successfullorder") {
        addStyleSheet("/assets/css/orderedstyle.css")
        let html = 
        `
        <p class="header">Bestellung wurde erfolgreich abgegeben</p>
        <button class="return" onclick="location.pathname = '/';">Zurück zu Startseite</button>
        `

        content.innerHTML = html;
    }
}

export async function createhead() {
    let header = document.getElementById("header");
    let total:number = await (await fetch("/api/totalprice")).json();
    let htmlheader = `
    <a class="header" href="/"><h1>Dorfladen by Robin Muff</h1></a>
    <div class="cart">
        <a class="cart" href="/shoppingcart">
            <img class="cart_img" src="/assets/images/cart.jpg">
        </a>
        <p>CHF ${total.toFixed(2)}</p>
    </div>
    `;
    header.innerHTML = htmlheader;
}

async function addtocart() {
    let link = window.location.href;
    let id = link.substr(link.length - 3, 3);

    await fetch(
        "/api/shoppingcart/add/" + id,
        {
            body: "",
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST"
    });

    loadPage();
}

async function addStyleSheet(pi_link:string) {
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = pi_link;
    link.media = 'all';
    head.appendChild(link);
}

async function onemore(pi_id:number) {
    console.log("MORE")

    let fetchid:number = localcart[pi_id].id

    await fetch(
        "/api/shoppingcart/add/" + fetchid,
        {
            body: "",
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST"
    });

    loadPage();
}

async function oneless(pi_id:number) {
    console.log("LESS")

    let fetchid:number = localcart[pi_id].id

    await fetch(
        "/api/shoppingcart/remove/" + fetchid,
        {
            body: "",
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST"
    });

    loadPage();
}