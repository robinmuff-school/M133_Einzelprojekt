import { Application, Router, send } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import { Session } from "https://deno.land/x/session@1.1.0/mod.ts";

const app = new Application();
const router = new Router();

const session = new Session({ framework: "oak" });
await session.init();

router 
    //HTML
    .get("/", (context) => {
        return send(context, "/frontend/html/index.html");
    })
    .get("/product/:id", (context) => {
        return send(context, "/frontend/html/product.html");
    })
    .get("/shoppingcart", (context) => {
        return send(context, "/frontend/html/shoppingcart.html");
    })
    .get("/checkout", (context) => {
        return send(context, "frontend/html/checkout.html");
    })

    //CSS OR JS
    .get("/assets/:folder/:file", (context) => {
        return send(context, "/frontend/assets/" + context.params.folder + "/" + context.params.file);
    })

    //API
    .get("/api/products", (context) => {
        return send(context, "frontend/assets/products.json");
    })
    .post("/api/shoppingcart/:id", async (context) => {
        const product = context.params.id;

        if (!product) {
            context.response.status = 404;
            return;
        }

        if (await context.state.session.get("shoppingcart") == undefined) {
            await context.state.session.set("shoppingcart", []);
        }

        let shoppingcart = await context.state.session.get("shoppingcart");

        await context.state.session.set("shoppingcart", [...shoppingcart, product]);

        context.response.status = 200;
    })
    .post("/api/shoppingcart", async (context) => {
        let cart = await context.request.body({ type: "json" }).value;
        await context.state.session.set("shoppingcart", cart);

        context.response.status = 200
        context.response.body = { message: 'OK' }
    })
    .get("/api/shoppingcart", async (context) => {
        let cart = await context.state.session.get("shoppingcart");

        if (cart == undefined) {
            context.response.body = undefined;
        } else {
            context.response.body = cart;
        }
        context.response.status = 200;
    })
    .get("/api/shoppingcart/totalprice", async (context) => {
        const products_file = await Deno.readTextFile("frontend/assets/products.json");
        let products = JSON.parse(products_file);
        let cart = await context.state.session.get("shoppingcart");
        if (cart == undefined) {
            cart = [];
        }

        let totalprice = 0;
        for (let i = 0; i < cart.length; i++) {
            let item;
            products.forEach(element => {
                if (element.id == cart[i]) {
                    item = element;
                }
            });
            totalprice = totalprice + item.specialOffer;
        }

        context.response.body = totalprice;
    })

app.use(session.use()(session));
app.use(router.routes());
app.listen({ port: 8000 });
console.log("Server running on http://localhost:8000");