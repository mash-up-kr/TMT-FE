import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "@/shared/constants/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = SITE.name;

/** `--primitive-red-600`. Satori는 CSS 변수를 읽지 못해 토큰 값을 여기서 고정한다. */
const BRAND_RED = "#f43d2d";

/** 앱이 쓰는 로고 정본. 로고가 바뀌면 카드도 함께 바뀌도록 파일을 직접 읽는다. */
const LOGO_PATH = "src/shared/ui/Icons/assets/tmt-logo-simple.svg";

/** 로고는 `currentColor`로 그려져 있어, 붉은 바탕 위에 놓기 전에 흰색으로 확정한다. */
async function loadLogo() {
  const svg = await readFile(join(process.cwd(), LOGO_PATH), "utf8");
  const white = svg.replaceAll("currentColor", "#ffffff");
  return `data:image/svg+xml;base64,${Buffer.from(white).toString("base64")}`;
}

/**
 * 로고만 놓는다. 카드에 문구가 없으므로 한글 폰트를 싣지 않는다.
 * 문구를 다시 넣으려면 Satori가 한글을 그릴 폰트를 함께 실어야 한다.
 */
export default async function OpengraphImage() {
  const logo = await loadLogo();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: BRAND_RED,
      }}
    >
      {/* biome-ignore lint/performance/noImgElement: Satori는 next/image가 아니라 img만 그린다. */}
      <img src={logo} width={680} height={149} alt={SITE.name} />
    </div>,
    size,
  );
}
