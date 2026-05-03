import { createPkgHooks } from "#helpers/pkg-hooks";
import { arabicShapingRoute } from "#routes/core/arabic-shaping";
import { ucdStoreSource } from "#sources/ucd-store";
import { byExt, definePipeline } from "@ucdjs/pipeline-core";

const dataPackageHooks = createPkgHooks({
  packageName: (version) => `@ucdjs-data/data-${version}`,
  packageFolder: "data",
});

export const arabicShapingPipeline = definePipeline({
  id: "arabic-shaping",
  name: "Arabic Shaping",
  description:
    "Extracts Arabic character shaping properties from ArabicShaping.txt",
  versions: ["16.0.0", "15.1.0", "15.0.0"],
  inputs: [ucdStoreSource],
  routes: [arabicShapingRoute],
  include: byExt(".txt"),
  strict: false,
  hooks: dataPackageHooks,
});
