import { defineConfig } from "orval";

export default defineConfig({
  tmt: {
    input: {
      target: "./_scripts/api/openapi.json",
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
        // useQuery·useMutation은 verb 기본 매핑(GET=query, 그 외=mutation)을 덮어쓰는 옵션이다.
        // 켜면 매핑이 뒤집히므로 건드리지 않는다.
        query: {
          useSuspenseQuery: true,
          useInfinite: false,
        },
      },
    },
  },
});
