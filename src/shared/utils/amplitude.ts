/**
 * Amplitude 프로덕트 분석 어댑터.
 *
 * UT2용 Clarity 계측(`clarity.ts` 계열)과 달리 이건 상시 유지한다. UT가 끝나도 지우지 않는다.
 *
 * SDK는 최초 렌더 이후 동적으로 불러온다. 모바일 전용 서비스라 첫 화면 번들에 분석 SDK를
 * 얹을 이유가 없고, autocapture는 로드 이후 시점부터 수집해도 충분하다.
 */

export const AMPLITUDE_API_KEY = "d461d786603b781b2e5b3c314bb1276c";

/** 로컬 개발 세션이 프로덕트 지표에 섞이지 않도록 프로덕션 빌드에서만 켠다. */
export const isAmplitudeEnabled = process.env.NODE_ENV === "production";

let initialized = false;

export async function initAmplitude(): Promise<void> {
  if (initialized || typeof window === "undefined") {
    return;
  }

  initialized = true;

  const amplitude = await import("@amplitude/analytics-browser");

  amplitude.init(AMPLITUDE_API_KEY, {
    // 클릭·페이지뷰 자동 수집. 이벤트를 따로 심지 않아도 기본 지표가 쌓인다.
    autocapture: true,
  });
}
