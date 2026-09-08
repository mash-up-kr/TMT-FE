/**
 * 서비스 식별 정보와 공개 origin의 정본.
 *
 * canonical, Open Graph, sitemap, robots, 인증 origin 검사가 모두 이 값을 본다.
 * `ttomatto.kr` 연결 시 `APP_ORIGIN` 하나만 바꾸면 전부 함께 전환된다.
 *
 * `APP_ORIGIN`은 `NEXT_PUBLIC_` 접두가 없어 브라우저 번들에서는 `undefined`다.
 * `SITE_ORIGIN`은 metadata, robots, sitemap, `app/_utils/authServer.ts`처럼
 * 서버에서만 쓴다. 클라이언트에서 절대 URL이 필요하면 `location.origin`을 읽는다.
 */

/** 정식 도메인 연결 전까지의 운영 URL. 배포 환경에서는 `APP_ORIGIN`이 덮는다. */
const FALLBACK_ORIGIN = "https://ttomatto-web.vercel.app";

export const SITE_ORIGIN = process.env.APP_ORIGIN ?? FALLBACK_ORIGIN;

/** 아래 값들을 조립한다. 서비스명과 문구가 여러 자리에 문자열로 흩어지지 않게 한다. */
const NAME = "또맛또";
const TAGLINE = "또 가고 싶은 맛집, 또 보자";
const PITCH = "취향대로 모으고, 공유하고, 발견하기!";
const LEDE = "믿을 수 있는 사람들의 기록이 나의 취향으로 이어지는 곳.";

export const SITE = {
  name: NAME,
  locale: "ko_KR",
  /** 홈과 fallback title. 다른 화면은 `%s | 또맛또` 템플릿을 쓴다. */
  title: `${NAME} | ${TAGLINE}`,
  description: `${LEDE} ${PITCH}`,
} as const;

/**
 * 기본 공유 카드의 경로. `app/opengraph-image.tsx` 파일 컨벤션이 서빙한다.
 *
 * 그룹 대표 이미지가 없을 때처럼 기본 카드로 되돌려야 하는 자리에서 명시적으로 쓴다.
 * 상위 segment의 카드가 상속되기를 기대하지 않고 각 화면이 직접 선언한다.
 */
export const OG_IMAGE_PATH = "/opengraph-image";

/** 그룹·장소 공유 카드 문구. 사용자 작성 문구는 합성하지 않는다. */
export const shareDescription = {
  group: (name: string) => `${NAME}에서 ${name}의 맛집 기록을 확인하세요.`,
  place: (name: string) => `${NAME}에서 ${name}의 리뷰를 확인하세요.`,
} as const;
