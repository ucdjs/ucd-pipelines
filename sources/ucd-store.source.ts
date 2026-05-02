import HTTPFileSystemBackend from "@ucdjs/fs-backend/backends/http";
import { definePipelineSource } from "@ucdjs/pipeline-core";

export const ucdStoreSource = definePipelineSource({
  id: "ucd-store",
  backend: HTTPFileSystemBackend({
    // baseUrl: "https://ucd-store.ucdjs.dev",
    baseUrl: "http://localhost:8788"
  }),
});
