import { definePipeline, byExt } from "@ucdjs/pipelines-core";
import { createUcdStoreSource } from "../../sources/ucd-store.source";
import { blocksRoute } from "../../routes/core/blocks.route";

export const blocksPipeline = definePipeline({
  id: "blocks",
  name: "Unicode Blocks",
  description: "Extracts Unicode block definitions from Blocks.txt",
  versions: ["16.0.0", "15.1.0", "15.0.0"],
  inputs: [
    createUcdStoreSource(),
  ],
  routes: [blocksRoute],
  include: byExt(".txt"),
  strict: false,
});
