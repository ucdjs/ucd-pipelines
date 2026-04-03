import { definePipelineRoute, byName } from "@ucdjs/pipelines-core";
import type { ResolvedEntry } from "@ucdjs/pipelines-core";

export const blocksRoute = definePipelineRoute({
  id: "blocks",
  filter: byName("Blocks.txt"),
  parser: async function* (ctx) {
    const lines = ctx.readLines();
    
    for await (const line of lines) {
      // Skip comments and empty lines
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      
      // Parse format: "startCode..endCode; Block Name"
      const match = trimmed.match(/^([0-9A-F]+)\.\.([0-9A-F]+);\s*(.+)$/);
      if (match) {
        yield {
          sourceFile: ctx.file.path,
          kind: "range" as const,
          start: match[1],
          end: match[2],
          value: match[3].trim(),
        };
      }
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
    
    return [{
      version: ctx.version,
      property: "Block",
      file: ctx.file.name,
      entries,
    }];
  },
});
