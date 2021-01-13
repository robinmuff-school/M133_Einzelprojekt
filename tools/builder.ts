import { ensureDirSync } from "https://deno.land/std@0.82.0/fs/mod.ts";

const [diagnostics, emit] = await Deno.bundle(
    "./frontend/app.ts",
);

ensureDirSync("./frontend/build");
await Deno.writeTextFile("./frontend/build/app.js", emit);