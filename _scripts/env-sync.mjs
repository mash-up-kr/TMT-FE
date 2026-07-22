import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ENV_FILE = path.join(ROOT_DIR, ".env");
const VERSION_TIMEOUT_MS = 5_000;
const EXPORT_TIMEOUT_MS = 60_000;

// Infisical 대시보드의 환경 슬러그 (dev | staging | prod)
const TARGET_ENV = process.env.ENV ?? "dev";

function run(args, timeout) {
  return execFileSync("infisical", args, {
    cwd: ROOT_DIR,
    timeout,
    stdio: ["ignore", "pipe", "pipe"],
  })
    .toString()
    .trim();
}

function fail(reason, hints) {
  console.error(`\n🚫 ${reason}`);
  for (const hint of hints) {
    console.error(`   · ${hint}`);
  }
  console.error("");
  process.exit(1);
}

// 1. Infisical CLI 확인
try {
  run(["--version"], VERSION_TIMEOUT_MS);
} catch {
  fail("Infisical CLI를 찾을 수 없어요.", [
    "설치: brew install infisical/get-cli/infisical (Windows: scoop install infisical)",
    "설치 후 로그인: infisical login",
  ]);
}

// 2. 시크릿 내려받기 → .env 생성
console.log(`🔄 Infisical(${TARGET_ENV})에서 환경변수를 동기화하는 중...`);

try {
  const dotenv = run(["export", `--env=${TARGET_ENV}`, "--format=dotenv"], EXPORT_TIMEOUT_MS);
  writeFileSync(ENV_FILE, `${dotenv}\n`);
  const count = dotenv.split("\n").filter((line) => line.includes("=")).length;
  console.log(`🖱️  딸깍! .env 준비 완료 (변수 ${count}개)`);
} catch (error) {
  const message = (error.stderr?.toString() ?? error.message ?? "").toLowerCase();

  if (/login|token|unauthorized|401|authentication/.test(message)) {
    fail("Infisical 로그인이 필요해요.", [
      "infisical login 으로 다시 로그인해 주세요.",
      "프로젝트에 초대되지 않았다면 팀에 요청해 주세요.",
    ]);
  }
  if (error.code === "ETIMEDOUT" || /econnrefused|enotfound|network/.test(message)) {
    fail("Infisical 서버에 연결하지 못했어요.", [
      "인터넷 연결을 확인해 주세요.",
      "로그인이 만료된 경우에도 응답이 멈출 수 있어요: infisical login",
    ]);
  }
  fail("환경변수 동기화에 실패했어요.", [
    error.stderr?.toString().trim() || error.message,
    "해결되지 않으면 infisical reset 후 재로그인하거나 팀에 공유해 주세요.",
  ]);
}
