import { blocksRoute } from "#routes/core/blocks";
import { ucdStoreSource } from "#sources/ucd-store";
import { byExt, definePipeline } from "@ucdjs/pipeline-core";

export const blocksPipeline = definePipeline({
  id: "blocks",
  name: "Unicode Blocks",
  description: "Extracts Unicode block definitions from Blocks.txt",
  versions: ["16.0.0", "15.1.0", "15.0.0"],
  inputs: [ucdStoreSource],
  routes: [blocksRoute],
  include: byExt(".txt"),
  strict: false,
});
