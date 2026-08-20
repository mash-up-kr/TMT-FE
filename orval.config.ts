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
      // workspace 옵션은 쓰지 않는다. gen/ 밖에 src/api/index.ts를 만들고 clean이 그 파일을 지우지 못한다.
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
        // mutator가 응답 본문만 반환한다. true면 { status, data, headers } 래퍼가 생긴다.
        fetch: {
          includeHttpResponseReturnType: false,
        },
      },
    },
  },
});
