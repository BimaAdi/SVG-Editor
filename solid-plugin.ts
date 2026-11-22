import { transform } from "@solidjs/compiler";
import type { BunPlugin } from "bun";

const SOLID_EXTENSIONS = /\.(jsx|tsx)$/;

/**
 * Compiles Solid 2 JSX with `@solidjs/compiler`.
 *
 * Register it for Bun's HTML dev server in `bunfig.toml`:
 *
 * ```toml
 * [serve.static]
 * plugins = ["./solid-plugin.ts"]
 * ```
 *
 * or pass it to `Bun.build({ plugins: [solid] })`.
 */
const solid: BunPlugin = {
  name: "solid",
  setup(build) {
    build.onLoad({ filter: SOLID_EXTENSIONS }, async ({ path }) => {
      // Dependencies are already published with their JSX compiled.
      if (path.includes("node_modules")) return;

      const source = await Bun.file(path).text();
      const result = transform(source, {
        filename: path,
        generate: "dom",
        // Keep source names and locations in development so diagnostics
        // point at the authored component.
        dev: process.env.NODE_ENV !== "production",
      });

      // The compiler leaves TypeScript syntax in place, so let Bun strip it
      // with the "ts" loader. All JSX has already been compiled away.
      return {
        contents: result.code,
        loader: "ts",
      };
    });
  },
};

export default solid;
