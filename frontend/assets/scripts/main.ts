/// <reference lib="dom" />
import { Product, ShoppingCart } from "../../../classes/types.ts";
import { addtocart, addStyleSheet, onemore, oneless } from "./functions.ts";
import { loadStartpage } from "./startpage.ts";
import { loadProductpage } from "./productpage.ts";
import { loadShoppingcartpage } from "./shoppingcartpage.ts";
import { loadCheckoutpage } from "./checkoutpage.ts";
import { loadAfterorderpage } from "./afterorderpage.ts";

export let localcart:Product[] = [];
export let localcart_ammount:number[] = [];

export async function setlocalcart(pi_localcart:Product[]) {
    localcart = pi_localcart;
}
export async function setlocalcart_ammount(pi_localcart_ammount:number[]) {
    localcart_ammount = pi_localcart_ammount;
}

export async function loadPage() {
    addStyleSheet('/assets/css/main.css')
    createhead();

    if (window.location.pathname == "/" || window.location.pathname == "") {
        loadStartpage();
    }

    if (window.location.pathname.slice(0, 8) == "/product") {
        loadProductpage();
    }

    if (window.location.pathname == "/shoppingcart") {
        loadShoppingcartpage();
    }

    if (window.location.pathname == "/checkout") {
        loadCheckoutpage();
    }

    if (window.location.pathname == "/successfullorder") {
        loadAfterorderpage(true);
    }

    if (window.location.pathname == "/unsuccessfullorder") {
        loadAfterorderpage(false);
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