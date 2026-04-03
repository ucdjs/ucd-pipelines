# ucdjs pipelines

A project for managing and running UCD (Unicode Character Database) extraction pipelines with a built-in UI for pipeline execution and management.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** `>= 24.13` - [Download Node.js](https://nodejs.org/)
- **pnpm** `>= 10.29.3` - [Installation guide](https://pnpm.io/installation)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/ucdjs/ucdjs-pipelines.git
cd ucdjs-pipelines
```

2. Install dependencies using pnpm:

```bash
pnpm install
```

## Structure

```
.
├── sources/              # Reusable data sources
│   └── ucd-store.source.ts    # HTTP source for api.ucdjs.dev
├── routes/               # File processing routes
│   ├── core/             # Core UCD files
│   │   ├── blocks.route.ts
│   │   └── arabic-shaping.route.ts
│   ├── auxiliary/        # Auxiliary files (break properties)
│   ├── extracted/        # Derived/extracted files
│   └── emoji/            # Emoji-related files
├── pipelines/            # Pipeline definitions (*.ucd-pipeline.ts)
│   ├── core/
│   │   ├── blocks.ucd-pipeline.ts
│   │   └── arabic-shaping.ucd-pipeline.ts
│   └── emoji/
└── index.ts              # Registry - exports all pipelines
```

## Usage

### List Available Pipelines

View all available pipelines in your project:

```bash
pnpm pipelines:list
```

### Run Pipelines

Execute pipelines from the command line:

```bash
pnpm pipelines:run
```

### Run Pipelines with UI

Execute pipelines using the interactive web-based UI:

```bash
pnpm pipelines:run:ui
```

This opens a user-friendly interface where you can:
- Select and configure pipelines
- Monitor execution progress
- View results and logs

## Adding a New Pipeline

1. **Create a route** in `routes/<category>/<file>.route.ts`:
   ```typescript
   import { definePipelineRoute, byName } from "@ucdjs/pipelines-core";
   
   export const myRoute = definePipelineRoute({
     id: "my-route",
     filter: byName("MyFile.txt"),
     parser: async function* (ctx) {
       // Parse file content
     },
     resolver: async (ctx, rows) => {
       // Transform to output format
     },
   });
   ```

2. **Create a pipeline** in `pipelines/<category>/<file>.ucd-pipeline.ts`:
   ```typescript
   import { definePipeline, byExt } from "@ucdjs/pipelines-core";
   import { createUcdStoreSource } from "../../sources/ucd-store.source";
   import { myRoute } from "../../routes/<category>/my.route";
   
   export const myPipeline = definePipeline({
     id: "my-pipeline",
     name: "My Pipeline",
     description: "Extracts data from MyFile.txt",
     versions: ["16.0.0", "15.1.0"],
     inputs: [createUcdStoreSource()],
     routes: [myRoute],
     include: byExt(".txt"),
   });
   ```

3. **Export from registry** in `index.ts`:
   ```typescript
   export { myPipeline } from "./pipelines/<category>/my.ucd-pipeline";
   
   // Add to pipelines array
   export const pipelines = [
     // ...existing pipelines
     myPipeline,
   ];
   ```

## File Categories

Based on the UCD store structure:

- **Core** (`ucd/`): UnicodeData.txt, Blocks.txt, Scripts.txt, etc.
- **Auxiliary** (`ucd/auxiliary/`): Break properties, test files
- **Extracted** (`ucd/extracted/`): Derived properties
- **Emoji** (`ucd/emoji/`): Emoji data files

See `https://api.ucdjs.dev/.well-known/ucd-store/16.0.0.json` for the complete file list.
