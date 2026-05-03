import { createPkgHooks } from "#helpers/pkg-hooks";
import { blocksRoute } from "#routes/core/blocks";
import { ucdStoreSource } from "#sources/ucd-store";
import { byExt, definePipeline } from "@ucdjs/pipeline-core";

const dataPackageHooks = createPkgHooks({
  packageName: (version) => `@ucdjs-data/data-${version}`,
  packageFolder: "data",
});

export const blocksPipeline = definePipeline({
  id: "blocks",
  name: "Unicode Blocks",
  description: "Extracts Unicode block definitions from Blocks.txt",
  versions: ["16.0.0", "15.1.0", "15.0.0"],
  inputs: [ucdStoreSource],
  routes: [blocksRoute],
  include: byExt(".txt"),
  strict: false,
  hooks: dataPackageHooks,
});
