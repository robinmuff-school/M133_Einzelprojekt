import { Application, Router, send } from "https://deno.land/x/oak@v6.3.1/mod.ts"

const app = new Application();
const router = new Router();

router 
    //HTML
    .get("/", (context) => {
        return send(context, "./frontend/html/index.html");
    })
    .get("/product/:id", (context) => {
        return send(context, "./frontend/html/product.html");
    })

    //CSS OR JS
    .get("/assets/scripts/:file", (context) => {
        return send(context, "./frontend/assets/scripts/" + context.params.file);
    })
    .get("/assets/images/:file", (context) => {
        return send(context, "./frontend/assets/images/" + context.params.file);
    })
    .get("/assets/css/:file", (context) => {
        return send(context, "./frontend/assets/css/" + context.params.file);
    })

    //API
    .get("/api/products", (context) => {
        return send(context, "./frontend/assets/products.json");
    })

app.use(router.routes());
app.listen({ port: 8000 });