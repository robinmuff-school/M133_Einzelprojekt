import { ensureDirSync } from "https://deno.land/std@0.125.0/fs/mod.ts";

/*const [diagnostics, emit] = await Deno.compile(
    "./frontend/app.ts",
);*/
const emit = await Deno.emit("./frontend/app.ts", {bundle: "module"});

ensureDirSync("./frontend/build");
//console.log(emit)
await Deno.writeTextFile("./frontend/build/app.js", emit.files["deno:///bundle.js"]);