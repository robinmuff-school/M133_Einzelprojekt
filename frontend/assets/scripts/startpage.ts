/// <reference lib="dom" />
import { Product, ShoppingCart } from "../../../classes/types.ts";
import { addtocart, addStyleSheet, onemore, oneless } from "./functions.ts"

export async function loadStartpage() {
    let products:Product[] = await (await fetch("/api/products")).json()
    const content:Element = document.getElementById("main");
    content.innerHTML = "";

    addStyleSheet('/assets/css/indexstyle.css');

        let count = 0;
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
                    <button id="addtocart_${count.toString()}">In Warenkorb legen</button>
                </div>
                `
            count++;
        });

        for (let i = 0; i < count; i++) {
            let btnname = "addtocart_" + i.toString();
            await document.getElementById(btnname).addEventListener("click", async () => {
                let id = i + 1;
                let string:string;
                if (id < 10) {
                    string = "00" + id.toString();
                }
                if (id > 9 && i < 100) {
                    string = "0" + id.toString();
                }                
                addtocart(string);
            });
        }
}