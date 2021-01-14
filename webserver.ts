import { Application, Context, Router, send } from "https://deno.land/x/oak@v6.4.0/mod.ts";
import { Session } from "https://deno.land/x/session@1.1.0/mod.ts";
import { Product, ShoppingCart } from "./classes/types.ts";

const app = new Application();
const router = new Router();

const session = new Session({ framework: "oak" });
await session.init();

const products:Product[] = JSON.parse(await Deno.readTextFile(`frontend/assets/products.json`));

router 
    //HTML
    .get("/", async (context) => {
        await send(context, "/frontend/html/index.html");
    })
    .get("/product/:id", async (context) => {
        await send(context, "/frontend/html/index.html");
    })
    .get("/shoppingcart", async (context) => {
        await send(context, "/frontend/html/index.html");
    })
    .get("/checkout", async (context) => {
        if (await context.state.session.get("shoppingcart") == undefined) {
            await context.state.session.set("shoppingcart", new ShoppingCart());
        }
        let cart:ShoppingCart = await context.state.session.get("shoppingcart");
        
        if (cart.products.length == 0) {
            context.response.redirect("/shoppingcart");
        }
        await send(context, "frontend/html/index.html");
    })
    .get("/successfullorder", async (context) => {
        await send(context, "frontend/html/index.html");
    })
    .get("/unsuccessfullorder", async (context) => {
        await send(context, "frontend/html/index.html");
    })

    //Assets
    .get("/assets/:folder/:file", async (context) => {
        await send(context, "/frontend/assets/" + context.params.folder + "/" + context.params.file);
    })
    .get("/jsassets/:folder/:file", async (context) => {
        await send(context, "/frontend/" + context.params.folder + "/" + context.params.file); 
    })

    //API
    .get("/api/products", async (context) => {
        context.response.body = products;
    })
    .post("/api/shoppingcart", async (context) => {
        let cart:ShoppingCart = await context.request.body({ type: "json" }).value;
        await context.state.session.set("shoppingcart", cart);

        context.response.status = 200
        context.response.body = { message: 'OK' }
    })
    .get("/api/shoppingcart", async (context) => {
        if (await context.state.session.get("shoppingcart") == undefined) {
            await context.state.session.set("shoppingcart", new ShoppingCart());
        }

        context.response.body = await context.state.session.get("shoppingcart");

        context.response.status = 200;
    })
    .post("/api/shoppingcart/add/:id", async (context) => {
        if (await context.state.session.get("shoppingcart") == undefined) {
            await context.state.session.set("shoppingcart", new ShoppingCart());
        }
        let shoppingcart:ShoppingCart = await context.state.session.get("shoppingcart");
        const product = products.find(x => Number(x.id) === Number(context.params.id));
        if (!product) {
            context.response.status = 404;
            return;
        }
        shoppingcart.products.push(product);
        context.response.status = 200;
        })
    .post("/api/shoppingcart/remove/:id", async (context) => {
        if (await context.state.session.get("shoppingcart") == undefined) {
            await context.state.session.set("shoppingcart", new ShoppingCart());
        }                
        let shoppingcart:ShoppingCart = await context.state.session.get("shoppingcart");
        const product = products.find(x => Number(x.id) === Number(context.params.id));
        if (!product) {
            context.response.status = 404;
            return;
        }
        let index = shoppingcart.products.indexOf(product);
        shoppingcart.products.splice(index, 1);        
        context.response.status = 200;
    })
    .post("/api/order", async (context) => {
        if (await context.state.session.get("shoppingcart") == undefined) {
            await context.state.session.set("shoppingcart", new ShoppingCart());
        }
        let cart:ShoppingCart = await context.state.session.get("shoppingcart");
        
        if (cart.products.length == 0) {
            context.response.redirect("/shoppingcart");
        }

        const body = await context.request.body({ type: "form"})
        const values = await body.value;

        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const firstname:string|null = values.get("prename");
        const lastname:string|null = values.get("lastname");
        const email:string|null = values.get("email");
        let isinvalid:boolean = false;

        if (!(firstname && lastname && email)) {
            isinvalid = true;
        } else {
            isinvalid = re.test(String(email).toLowerCase());
        }

        if (isinvalid) {
            context.response.status = 200;
            context.response.redirect("/unsuccessfullorder");
        }

        context.cookies.delete("sid");

        context.response.status = 200;
        context.response.redirect("/successfullorder");
    })
    .get("/api/totalprice", async (context) => {
        if (await context.state.session.get("shoppingcart") == undefined) {
            await context.state.session.set("shoppingcart", new ShoppingCart());
        }

        let shoppingcart:ShoppingCart = await context.state.session.get("shoppingcart");
        context.response.body = shoppingcart.getTotalPrice();
    })

app.use(<any>session.use()(session));
app.use(router.routes());
app.listen({ port: 8000 });
console.log("Server running on http://localhost:8000");