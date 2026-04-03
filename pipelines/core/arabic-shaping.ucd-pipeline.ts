import { arabicShapingRoute } from "#routes/core/arabic-shaping";
import { createUcdStoreSource } from "#sources/ucd-store";
import { definePipeline, byExt } from "@ucdjs/pipelines-core";

export const arabicShapingPipeline = definePipeline({
  id: "arabic-shaping",
  name: "Arabic Shaping",
  description: "Extracts Arabic character shaping properties",
  versions: ["16.0.0", "15.1.0", "15.0.0"],
  inputs: [createUcdStoreSource()],
  routes: [arabicShapingRoute],
  include: byExt(".txt"),
  strict: false,
});
