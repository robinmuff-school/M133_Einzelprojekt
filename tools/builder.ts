import { ensureDirSync } from "https://deno.land/std@0.82.0/fs/mod.ts";

const [diagnostics, emit] = await Deno.bundle(
    "../frontend/app.ts",
);

ensureDirSync("../frontend/");
await Deno.writeTextFile("../frontend/build/app.js", emit);