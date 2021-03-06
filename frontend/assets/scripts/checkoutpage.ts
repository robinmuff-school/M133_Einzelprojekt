/// <reference lib="dom" />
import { addtocart, addStyleSheet, onemore, oneless } from "./functions.ts"

export async function loadCheckoutpage() {
    const content:Element = document.getElementById("main");

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

        content.innerHTML = html
}