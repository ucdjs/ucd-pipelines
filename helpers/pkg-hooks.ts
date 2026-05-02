import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";

type PipelineHookPhase = "start" | "end";

interface PipelineHookContext {
  phase: PipelineHookPhase;
  pipelineId: string;
  logger: {
    info?: (...args: unknown[]) => void;
    warn?: (...args: unknown[]) => void;
  };
  error?: unknown;
}

interface PipelineVersionHookContext extends PipelineHookContext {
  version: string;
}

interface PipelineOutputHookContext extends PipelineVersionHookContext {
  outputId: string;
  property?: string;
  sink: string;
  locator: string;
  status?: "written" | "failed";
}

interface PkgHooksOptions {
  packageName: string;
  packageFolder: string;
  templateDir?: string;
  outputDir?: string;
}

export function createPkgHooks(options: PkgHooksOptions) {
  const templateDir = options.templateDir ?? "pkg-template";
  const outputDir = options.outputDir ?? "pkg";

  const packageDir = (version: string) => join(outputDir, version, options.packageFolder);

  return {
    version: async (ctx: PipelineVersionHookContext) => {
      if (ctx.phase !== "start") return;

      const targetDir = packageDir(ctx.version);
      await mkdir(targetDir, { recursive: true });
      await cp(templateDir, targetDir, { recursive: true });

      const packageJsonPath = join(targetDir, "package.json");
      const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8")) as Record<string, unknown>;

      packageJson.name = options.packageName;
      packageJson.version = ctx.version;

      await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
      ctx.logger.info?.(`created package folder ${relative(process.cwd(), targetDir)}`);
    },
    output: async (ctx: PipelineOutputHookContext) => {
      if (ctx.phase !== "end" || ctx.status !== "written" || ctx.sink !== "filesystem") return;

      const dataPath = join(packageDir(ctx.version), "data", `${ctx.property ?? ctx.outputId}.json`);
      await mkdir(dirname(dataPath), { recursive: true });
      await cp(ctx.locator, dataPath);
      ctx.logger.info?.(`copied package data ${relative(process.cwd(), dataPath)}`);
    },
  };
}
