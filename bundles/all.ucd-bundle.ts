import type {
  AnyPipelineDefinition,
  PipelineHooks,
} from "@ucdjs/pipeline-core";

import { createPkgHooks } from "#helpers/pkg-hooks";
import { arabicShapingPipeline } from "../pipelines/core/arabic-shaping.ucd-pipeline";
import { blocksPipeline } from "../pipelines/core/blocks.ucd-pipeline";

export interface PipelineBundleDefinition {
  id: string;
  name: string;
  description?: string;
  pipelines: readonly AnyPipelineDefinition[];
  hooks?: PipelineHooks;
}

export function definePipelineBundle(
  bundle: PipelineBundleDefinition,
): PipelineBundleDefinition {
  return bundle;
}

export const allBundle = definePipelineBundle({
  id: "all",
  name: "All UCD pipelines",
  description:
    "Runs all pipelines and writes shared data package artifacts per version.",
  pipelines: [blocksPipeline, arabicShapingPipeline],
  hooks: createPkgHooks({
    packageName: (version) => `@ucdjs-data/data-${version}`,
    packageFolder: "data",
  }),
});
