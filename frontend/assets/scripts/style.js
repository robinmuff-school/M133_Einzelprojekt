/*

createhead();

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
    header.innerHTML = htmlheader;
}

*/