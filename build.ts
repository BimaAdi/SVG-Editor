import tailwind from "bun-plugin-tailwind";
import solid from "./solid-plugin";

// `Bun.build` does not apply `--production` semantics for us, so set it
// before the plugin compiles the frontend.
process.env.NODE_ENV = "production";

const result = await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  target: "bun",
  minify: true,
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  plugins: [tailwind, solid],
});

if (!result.success) {
  console.error("Build failed");
  for (const log of result.logs) console.error(log);
  process.exit(1);
}

console.log(
  "Built:\n" + result.outputs.map((output) => `  ${output.path}`).join("\n"),
);
