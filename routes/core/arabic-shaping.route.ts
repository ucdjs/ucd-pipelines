import { definePipelineRoute, byName } from "@ucdjs/pipelines-core";
import type { ResolvedEntry } from "@ucdjs/pipelines-core";

export const arabicShapingRoute = definePipelineRoute({
  id: "arabic-shaping",
  filter: byName("ArabicShaping.txt"),
  parser: async function* (ctx) {
    const lines = ctx.readLines();
    
    for await (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      
      // Parse format: "codePoint; shortName; joiningType; joiningGroup # comment"
      const parts = trimmed.split("#")[0].trim().split(";");
      if (parts.length >= 4) {
        const [codePoint, shortName, joiningType, joiningGroup] = parts.map(p => p.trim());
        yield {
          sourceFile: ctx.file.path,
          kind: "point" as const,
          codePoint,
          value: joiningType,
          meta: {
            shortName,
            joiningGroup,
          },
        };
      }
    }
  },
  resolver: async (ctx, rows) => {
    const entries: ResolvedEntry[] = [];
    for await (const row of rows) {
      if (row.codePoint && row.value) {
        entries.push({
          codePoint: row.codePoint,
          value: row.value,
        });
      }
    }
    
    return [{
      version: ctx.version,
      property: "Arabic_Shaping",
      file: ctx.file.name,
      entries,
    }];
  },
});
