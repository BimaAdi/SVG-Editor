import { mkdir } from "node:fs/promises";
import path from "node:path";
import tailwind from "bun-plugin-tailwind";
import solid from "./solid-plugin";

const APP_NAME = "svged";
const executable = process.platform === "win32" ? `${APP_NAME}.exe` : APP_NAME;
const outfile = path.join(process.cwd(), "dist", executable);

await mkdir(path.dirname(outfile), { recursive: true });

// `Bun.build` does not apply `--production` semantics for us, so set it
// before the plugin compiles the frontend.
process.env.NODE_ENV = "production";

const result = await Bun.build({
  entrypoints: ["src/index.ts"],
  target: "bun",
  plugins: [tailwind, solid],
  minify: true,
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  env: "BUN_PUBLIC_*",
  compile: { outfile },
});

if (!result.success) {
  console.error(...result.logs);
  process.exit(1);
}

console.log(`Built ${outfile}`);
