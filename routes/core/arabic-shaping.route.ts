import type { ResolvedEntry } from "@ucdjs/pipeline-core";
import { byName, definePipelineRoute, filesystemSink } from "@ucdjs/pipeline-core";

export const arabicShapingRoute = definePipelineRoute({
  id: "arabic-shaping",
  filter: byName("ArabicShaping.txt"),
  parser: async function* (ctx) {
    for await (const line of ctx.readLines()) {
      const trimmed = line.trim();
      if (!trimmed || ctx.isComment(trimmed)) continue;

      const parts = trimmed.split("#")[0]!.trim().split(";");
      if (parts.length < 4) continue;

      const [codePoint, shortName, joiningType, joiningGroup] = parts.map((p) => p.trim());

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

    return [
      {
        version: ctx.version,
        property: "Arabic_Shaping",
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
