/// <reference lib="dom" />
import { Product, ShoppingCart } from "../../../classes/types.ts";
import { addtocart, addStyleSheet, onemore, oneless } from "./functions.ts"

export async function loadProductpage() {
    let products:Product[] = await (await fetch("/api/products")).json()
    const content:Element = document.getElementById("main");

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
                                <button id="addtocart" class="item_tocart">In Warenkorb legen</button>
                            </div>
                        </div>
                </div>`;
                content.innerHTML = html;

                document.getElementById("addtocart").addEventListener("click", async () => {
                    addtocart();
                });
            }
        })
}