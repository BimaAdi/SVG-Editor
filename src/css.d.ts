// Bun bundles CSS imports (and the Tailwind plugin processes them), but
// TypeScript still needs to know these files exist. Without this, side-effect
// imports such as `import "./index.css"` fail `bun check` with TS2882.
declare module "*.css";
