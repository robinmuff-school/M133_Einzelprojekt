import { Application, Context, Router, send } from "https://deno.land/x/oak/mod.ts";
import { Product, ShoppingCart } from "./classes/types.ts";

const app = new Application();
const router = new Router();

const products:Product[] = JSON.parse(await Deno.readTextFile(`frontend/assets/products.json`));

router 
    //HTML
    .get("/", async (ctx, next) => {
        await send(ctx, "/frontend/html/index.html");
    })
    .get("/product/:id", async (ctx, next) => {
        await send(ctx, "/frontend/html/index.html");
    })
    .get("/shoppingcart", async (ctx, next) => {
        await send(ctx, "/frontend/html/index.html");
    })
    .get("/checkout", async (ctx, next) => {
        let cart:ShoppingCart = await getShoppingCart(ctx);
        
        if (cart.products.length == 0) {
            ctx.response.redirect("/shoppingcart");
        }
        await send(ctx, "frontend/html/index.html");
    })
    .get("/successfullorder", async (ctx, next) => {
        await send(ctx, "frontend/html/index.html");
    })
    .get("/unsuccessfullorder", async (ctx, next) => {
        await send(ctx, "frontend/html/index.html");
    })

    //Assets
    .get("/assets/:folder/:file", async (ctx, next) => {
        await send(ctx, "/frontend/assets/" + ctx.params.folder + "/" + ctx.params.file);
    })
    .get("/jsassets/:folder/:file", async (ctx, next) => {
        await send(ctx, "/frontend/" + ctx.params.folder + "/" + ctx.params.file); 
    })

    //API
    .get("/api/products", async (ctx, next) => {
        ctx.response.body = products;
    })
    .post("/api/shoppingcart", async (ctx, next) => {
        let cart:ShoppingCart = await ctx.request.body({ type: "json" }).value;
        setShoppingCart(ctx, cart);

        ctx.response.status = 200
        ctx.response.body = { message: 'OK' }
    })
    .get("/api/shoppingcart", async (ctx, next) => {
        ctx.response.body = await getShoppingCart(ctx);

        ctx.response.status = 200;
    })
    .post("/api/shoppingcart/add/:id", async (ctx, next) => {
        let shoppingcart:ShoppingCart = await getShoppingCart(ctx);
        const product = products.find(x => Number(x.id) === Number(ctx.params.id));
        if (!product) {
            ctx.response.status = 404;
            return;
        }
        shoppingcart.products.push(product);
        await setShoppingCart(ctx, shoppingcart);
        ctx.response.status = 200;
    })
    .post("/api/shoppingcart/remove/:id", async (ctx, next) => {
        let shoppingcart:ShoppingCart = await getShoppingCart(ctx);
        const product = products.find(x => Number(x.id) === Number(ctx.params.id));
        if (!product) {
            ctx.response.status = 404;
            return;
        }
        let index = shoppingcart.products.indexOf(product);
        shoppingcart.products.splice(index, 1);
        await setShoppingCart(ctx, shoppingcart);
        ctx.response.status = 200;
    })
    .post("/api/order", async (ctx, next) => {
        let cart:ShoppingCart = await getShoppingCart(ctx);
        
        if (cart.products.length == 0) {
            ctx.response.redirect("/shoppingcart");
        }

        const body = await ctx.request.body({ type: "form"})
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
            ctx.response.status = 200;
            ctx.response.redirect("/unsuccessfullorder");
        }

        setShoppingCart(ctx, new ShoppingCart());

        ctx.response.status = 200;
        ctx.response.redirect("/successfullorder");
    })
    .get("/api/totalprice", async (ctx, next) => {
        let shoppingcart:ShoppingCart = await getShoppingCart(ctx);
        await ctx.cookies.set("shoppingcartt", "T")

        let price:number = 0.00;
  
        shoppingcart.products.forEach(product => {
          if (product.specialOffer == 0 || product.specialOffer == undefined || product.specialOffer == null) {
            price += product.normalPrice
          } else {
            price += product.specialOffer
          }
        });
    
        ctx.response.body = price;
    })

async function getShoppingCart(ctx:any) {
    if (await ctx.cookies.get("shoppingcart") == undefined) { 
        return new ShoppingCart();
    }

    return await JSON.parse(await ctx.cookies.get("shoppingcart"));
}
async function setShoppingCart(ctx:any, ShoppingCart:ShoppingCart) {
    await ctx.cookies.set("shoppingcart", JSON.stringify(ShoppingCart));
}


app.use(router.routes());
app.listen({ port: 8000 });
console.log("Server running on http://localhost:8000");