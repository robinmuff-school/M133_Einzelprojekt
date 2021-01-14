/// <reference lib="dom" />
import { Product, ShoppingCart } from "../../../classes/types.ts";
import { addtocart, addStyleSheet, onemore, oneless } from "./functions.ts"
//import { localcart, localcart_ammount, loadPage } from "./main.ts"
import * as main from "./main.ts"

export async function loadShoppingcartpage() {
    let products:Product[] = await (await fetch("/api/products")).json()
    const content:Element = document.getElementById("main");

    addStyleSheet("/assets/css/shoppingcartstyle.css")
        let usercart:ShoppingCart = await (await fetch("/api/shoppingcart")).json();
        
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

            main.setlocalcart(new Array<Product>());
            main.setlocalcart_ammount(new Array<number>());
            for (let i = 0; i < usercart.products.length; i++) {
                let isset = false;
                for (let y = 0;y < main.localcart.length; y++) {
                    if (usercart.products[i].id == main.localcart[y].id) {
                        main.localcart_ammount[y]++;
                        isset = true;
                    }
                }
                if(!isset) {
                    main.localcart.push(usercart.products[i]);
                    main.localcart_ammount.push(1);
                }
            }

            let html = "";
            let totalprice = 0;
            for (let i = 0; i < main.localcart.length; i++) {
                let item:Product;
                products.forEach(element => {
                    if (element.id == main.localcart[i].id) {
                        item = element;
                    }
                });
        
                let title = item.productName;
                let price = item.specialOffer||item.normalPrice;
                let amount = main.localcart_ammount[i];
                let total = (price * amount).toFixed(2);
                totalprice = totalprice + (price * amount);
        
                html = `<tr><td>`+title+`</td><td>CHF `+price.toFixed(2)+`</td><td><button id="btn_less_`+i+`">-</button><a> `+amount+` </a><button id="btn_more_`+i+`">+</button></td><td>CHF `+total+`</td></tr>`;
                document.getElementById("cart_table_body").innerHTML += html;
            }
            html = "<tr><td></td><td></td><td></td><td>CHF "+totalprice.toFixed(2)+"</td></tr>";
            
            html += "<tr><td></td><td></td><td></td><td><a href=\"/checkout\"><button>Bestellung abschliessen</button><a></td></tr>";
    
            document.getElementById("cart_table_body").innerHTML += html;

            for (let i = 0; i < main.localcart.length; i++) {
                document.getElementById("btn_less_" + i).addEventListener("click", async () => {
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