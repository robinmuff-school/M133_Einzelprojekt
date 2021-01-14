/// <reference lib="dom" />
import { localcart, localcart_ammount, loadPage } from "./main.ts"

export async function addtocart(pi_id?:string) {
    let id;
    if (pi_id == null) {
        let link = window.location.href;
        id = link.substr(link.length - 3, 3);
    } else {
        id = pi_id;
    }

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

export async function addStyleSheet(pi_link:string) {
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = pi_link;
    link.media = 'all';
    head.appendChild(link);
}

export async function onemore(pi_id:number) {
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

export async function oneless(pi_id:number) {
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