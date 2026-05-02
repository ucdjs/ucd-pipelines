import type { ResolvedEntry } from "@ucdjs/pipeline-core";
import { byName, definePipelineRoute, filesystemSink } from "@ucdjs/pipeline-core";

export const blocksRoute = definePipelineRoute({
  id: "blocks",
  filter: byName("Blocks.txt"),
  parser: async function* (ctx) {
    for await (const line of ctx.readLines()) {
      const trimmed = line.trim();
      if (!trimmed || ctx.isComment(trimmed)) continue;

      const match = /^([0-9A-F]+)\.\.([0-9A-F]+);\s*(.+)$/.exec(trimmed);
      if (!match) continue;

      yield {
        sourceFile: ctx.file.path,
        kind: "range" as const,
        start: match[1],
        end: match[2],
        value: match[3]!.trim(),
      };
    }
  },
  resolver: async (ctx, rows) => {
    const entries: ResolvedEntry[] = [];
    for await (const row of rows) {
      if (row.start && row.end && row.value) {
        entries.push({
          range: `${row.start}..${row.end}`,
          value: row.value,
        });
      }
    }

    return [
      {
        version: ctx.version,
        property: "Block",
        file: ctx.file.name,
        entries,
      },
    ];
  },
  outputs: [
    {
      id: "json",
      sink: filesystemSink({ baseDir: "output" }),
      format: "json",
      path: "{version}/{property:kebab}.json",
    },
  ],
});
