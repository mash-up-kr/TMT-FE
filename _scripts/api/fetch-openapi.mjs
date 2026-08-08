import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SNAPSHOT_PATH = path.join(SCRIPT_DIR, "openapi.json");
const FETCH_TIMEOUT_MS = 30_000;
const HTTP_METHODS = new Set(["get", "post", "put", "patch", "delete", "head", "options"]);

const url = process.env.TMT_OPENAPI_URL;

function fail(reason, hints) {
  console.error(`\n🚫 ${reason}`);
  for (const hint of hints) {
    console.error(`   · ${hint}`);
  }
  console.error("");
  process.exit(1);
}

function countOperations(spec) {
  return Object.values(spec.paths ?? {}).reduce(
    (total, pathItem) =>
      total +
      Object.keys(pathItem ?? {}).filter((key) => HTTP_METHODS.has(key.toLowerCase())).length,
    0,
  );
}

// 1. 환경변수 확인
if (!url) {
  fail("TMT_OPENAPI_URL이 없어요.", [
    "pnpm env:sync 로 Infisical에서 환경변수를 내려받아 주세요.",
    "그래도 없으면 Infisical dev 환경에 TMT_OPENAPI_URL(백엔드 OpenAPI JSON 주소)을 추가해야 해요.",
    existsSync(SNAPSHOT_PATH)
      ? "기존 스냅샷으로만 생성하려면: pnpm exec orval"
      : "스냅샷도 없어서 지금은 생성할 수 없어요.",
  ]);
}

// 2. 스펙 내려받기
console.log(`🔄 OpenAPI 스펙을 내려받는 중... (${url})`);

let spec;
try {
  const response = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });

  if (response.status === 401 || response.status === 403) {
    fail(`스펙 요청이 거부됐어요 (${response.status}).`, [
      "인증이 필요한 주소인지 확인해 주세요.",
      "백엔드에 인증 없이 받을 수 있는 스펙 경로를 요청해 주세요.",
    ]);
  }
  if (!response.ok) {
    fail(`스펙을 가져오지 못했어요 (${response.status} ${response.statusText}).`, [
      "TMT_OPENAPI_URL 값이 정확한지 확인해 주세요.",
      "백엔드 서버가 떠 있는지 확인해 주세요.",
    ]);
  }

  spec = await response.json();
} catch (error) {
  if (error.name === "TimeoutError") {
    fail(`스펙 요청이 ${FETCH_TIMEOUT_MS / 1000}초 안에 끝나지 않았어요.`, [
      "백엔드 서버 상태와 네트워크를 확인해 주세요.",
    ]);
  }
  if (error instanceof SyntaxError) {
    fail("응답이 JSON이 아니에요.", [
      "Swagger UI 페이지(HTML) 주소를 넣은 게 아닌지 확인해 주세요.",
      "필요한 값은 스펙 JSON 주소예요 (예: .../v3/api-docs).",
    ]);
  }
  fail("스펙을 내려받는 데 실패했어요.", [error.message, "URL과 네트워크 연결을 확인해 주세요."]);
}

// 3. 스펙 형태 검증
if (!spec || typeof spec !== "object" || (!spec.openapi && !spec.swagger)) {
  fail("OpenAPI 스펙이 아닌 것 같아요.", [
    "응답에 openapi 또는 swagger 버전 필드가 없어요.",
    "백엔드에 정확한 스펙 JSON 주소를 확인해 주세요.",
  ]);
}
if (!spec.paths || Object.keys(spec.paths).length === 0) {
  fail("스펙에 endpoint가 하나도 없어요.", [
    "빈 스펙을 반영하면 생성 코드가 전부 사라져요. 백엔드 상태를 먼저 확인해 주세요.",
  ]);
}

// 4. 스냅샷 저장
const previous = existsSync(SNAPSHOT_PATH) ? readFileSync(SNAPSHOT_PATH, "utf8") : null;
const next = `${JSON.stringify(spec, null, 2)}\n`;

writeFileSync(SNAPSHOT_PATH, next);

const operations = countOperations(spec);
const changed = previous !== next;
console.log(
  changed
    ? `🖱️  딸깍! 스펙 스냅샷 갱신 (endpoint ${operations}개)`
    : `🖱️  딸깍! 스펙 변경 없음 (endpoint ${operations}개)`,
);
