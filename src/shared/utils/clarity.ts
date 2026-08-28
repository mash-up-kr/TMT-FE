/**
 * ⚠️ UT2 대비 임시 코드다. `shared/constants/ut2.ts`, `shared/hooks/useUt2Step.ts`,
 * `shared/components/Ut2Tracker.tsx`, root layout의 Script와 함께 지운다.
 *
 * Microsoft Clarity 세션 녹화 어댑터. 설치 스니펫이 `window.clarity`를 큐 함수로 먼저
 * 정의하므로, 스크립트가 아직 안 받아졌어도 호출은 유실되지 않고 쌓였다가 실행된다.
 */

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

export const CLARITY_PROJECT_ID = "y9hh66tcq0";

/**
 * 프로덕션 빌드에서만 켠다. 로컬 개발 세션이 UT 녹화에 섞이면 분석이 오염된다.
 * Vercel의 preview 배포도 production 빌드라 함께 켜진다 — UT 리허설에 필요하다.
 */
export const isClarityEnabled = process.env.NODE_ENV === "production";

/** 공식 설치 스니펫. 프로젝트 ID만 우리 값으로 넣었다. */
export const CLARITY_SNIPPET = `(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");`;

/** 현재 세션에 커스텀 태그를 붙인다. Clarity 대시보드의 필터 기준이 된다. */
export function setClarityTag(key: string, value: string): void {
  if (typeof window === "undefined" || value.length === 0) {
    return;
  }

  window.clarity?.("set", key, value);
}
