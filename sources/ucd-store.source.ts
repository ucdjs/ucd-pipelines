import { createHttpSource } from "@ucdjs/pipelines-core/sources";

export interface UcdStoreSourceOptions {
  baseUrl?: string;
  version?: string;
}

export function createUcdStoreSource(options: UcdStoreSourceOptions = {}) {
  const { baseUrl = "https://api.ucdjs.dev/api/v1/files" } = options;

  return createHttpSource({
    id: "ucd-store",
    baseUrl,
    headers: {
      Accept: "text/plain",
    },
  });
}
