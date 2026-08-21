import { defineConfig } from "orval";

export default defineConfig({
  tmt: {
    input: {
      target: "./_scripts/api/openapi.json",
      override: {
        // 한글 태그가 그대로 폴더·파일명이 되지 않게 스펙 단계에서 바꾼다.
        transformer: "./orval.transformer.ts",
      },
    },
    output: {
      target: "./src/api/gen",
      schemas: "./src/api/gen/_model",
      client: "react-query",
      httpClient: "fetch",
      mode: "tags-split",
      fileExtension: ".gen.ts",
      clean: true,
      mock: false,
      formatter: "biome",
      indexFiles: false,
      override: {
        mutator: {
          path: "./src/api/mutator.ts",
          name: "tmtFetch",
        },
        fetch: {
          includeHttpResponseReturnType: false,
        },
      },
    },
  },
});
