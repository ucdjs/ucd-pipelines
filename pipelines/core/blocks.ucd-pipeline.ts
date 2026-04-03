import { blocksRoute } from "#routes/core/blocks";
import { createUcdStoreSource } from "#sources/ucd-store";
import { definePipeline, byExt } from "@ucdjs/pipelines-core";

export const blocksPipeline = definePipeline({
  id: "blocks",
  name: "Unicode Blocks",
  description: "Extracts Unicode block definitions from Blocks.txt",
  versions: ["16.0.0", "15.1.0", "15.0.0"],
  inputs: [createUcdStoreSource()],
  routes: [blocksRoute],
  include: byExt(".txt"),
  strict: false,
});
