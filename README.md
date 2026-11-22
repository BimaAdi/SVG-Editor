# SVG Editor

Experimenting using svg as tools for edit an image.

## Requirements

- bun >= 1.4.4

## Setup

Install dependencies:

```bash
bun install
```

## Development

```bash
bun run dev
```

## Checks

```bash
bun run check
bun run fmt
```

## Project layout

```
bunfig.toml      registers the Solid plugin for Bun.serve() HTML imports
solid-plugin.ts  @solidjs/compiler -> Bun loader
build.ts         production Bun.build() with the same plugin
src/index.ts     Bun server, serves src/index.html for all routes
src/index.html   HTML entry, loads src/frontend.tsx
src/frontend.tsx mounts the Solid app
src/App.tsx      Solid component
```

## Production

### Deploy as server

```bash
bun run build
bun run start
```

`build.ts` runs `Bun.build()` with the Solid plugin and writes the server and
its HTML assets to `dist/`. The CLI `bun build` command does not load
`[serve.static]` plugins, which is why the build script exists. `bun run start`
serves the pre-bundled output.

### Deploy as single executable

```bash
bun run build:exe
./dist/solid
```

This project was created using `bun init` in bun v1.4.4. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
