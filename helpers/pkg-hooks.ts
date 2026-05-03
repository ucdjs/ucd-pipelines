import type { PipelineHooks } from "@ucdjs/pipeline-core";
import { access, cp, mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join, relative } from "path";

interface PkgHooksOptions {
  packageName?: string | ((version: string) => string);
  packageFolder?: string | ((version: string) => string);
  packageVersion?: string | ((version: string) => string);
  templateDir?: string;
  outputDir?: string;
}

function resolveValue(
  value: string | ((version: string) => string) | undefined,
  version: string,
  fallback: string,
): string {
  if (typeof value === "function") {
    return value(version);
  }

  return value ?? fallback;
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function applyTemplateTokens(
  value: unknown,
  tokens: Record<string, string>,
): unknown {
  if (typeof value === "string") {
    let next = value;
    for (const [token, tokenValue] of Object.entries(tokens)) {
      next = next.replaceAll(`{{${token}}}`, tokenValue);
    }
    return next;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => applyTemplateTokens(entry, tokens));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        applyTemplateTokens(entry, tokens),
      ]),
    );
  }

  return value;
}

export function createPkgHooks(options: PkgHooksOptions = {}): PipelineHooks {
  const templateDir = options.templateDir ?? "pkg-template";
  const outputDir = options.outputDir ?? "pkg";

  const packageDir = (version: string) =>
    join(
      outputDir,
      version,
      resolveValue(options.packageFolder, version, "data"),
    );

  return {
    async version(ctx) {
      if (ctx.phase !== "start") return;

      const packageName = resolveValue(
        options.packageName,
        ctx.version,
        `@ucdjs-data/data-${ctx.version}`,
      );
      const packageVersion = resolveValue(
        options.packageVersion,
        ctx.version,
        ctx.version,
      );

      const targetDir = packageDir(ctx.version);
      const packageJsonPath = join(targetDir, "package.json");

      await mkdir(targetDir, { recursive: true });

      if (!(await fileExists(packageJsonPath))) {
        await cp(templateDir, targetDir, { recursive: true });
      }

      const packageJson = JSON.parse(
        await readFile(packageJsonPath, "utf8"),
      ) as Record<string, unknown>;

      const withTokens = applyTemplateTokens(packageJson, {
        version: packageVersion,
        packageName,
      }) as Record<string, unknown>;

      withTokens.name = packageName;
      withTokens.version = packageVersion;

      await writeFile(
        packageJsonPath,
        `${JSON.stringify(withTokens, null, 2)}\n`,
      );

      ctx.logger.info?.(
        `prepared package folder ${relative(process.cwd(), targetDir)}`,
      );
    },

    async output(ctx) {
      if (
        ctx.phase !== "end" ||
        ctx.status !== "written" ||
        ctx.sink !== "filesystem"
      ) {
        return;
      }

      const dataPath = join(
        packageDir(ctx.version),
        "data",
        `${ctx.property ?? ctx.outputId}.json`,
      );

      await mkdir(dirname(dataPath), { recursive: true });
      await cp(ctx.locator, dataPath);

      ctx.logger.info?.(
        `copied package data ${relative(process.cwd(), dataPath)}`,
      );
    },
  };
}
