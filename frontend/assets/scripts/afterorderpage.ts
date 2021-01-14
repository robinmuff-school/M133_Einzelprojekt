import { addtocart, addStyleSheet, onemore, oneless } from "./functions.ts"

export async function loadAfterorderpage(issuccessfull:boolean) {
    const content:Element = document.getElementById("main");

    if (issuccessfull) {
        addStyleSheet("/assets/css/orderedstyle.css")
        let html = 
        `
        <p class="header">Bestellung wurde erfolgreich</p>
        <button class="return" onclick="location.pathname = '/';">Zurück zu Startseite</button>
        `

        content.innerHTML = html;
    } else {
        addStyleSheet("/assets/css/orderedstyle.css")
        let html = 
        `
        <p class="header">Bestellung konnte nicht abgeschickt werden. Invalide Dateneingabe</p>
        <button class="return" onclick="location.pathname = '/checkout';">Zurück zu Checkout</button>
        `

        content.innerHTML = html;
    }
}