const SCRIPT_ID = "naver-maps-sdk";
const SDK_ORIGIN = "https://oapi.map.naver.com/openapi/v3/maps.js";

/**
 * 네이버 지도 SDK를 한 번만 로드한다.
 *
 * 같은 페이지에서 여러 컴포넌트가 동시에 호출해도 스크립트 태그는 하나만 생기고,
 * 진행 중인 로드가 있으면 그 Promise를 공유한다.
 *
 * 키는 스크립트 URL에 실려 나가는 공개 값이고, NCP에 등록한 서비스 URL로 보호된다.
 */
let loading: Promise<typeof naver.maps> | null = null;

export function loadNaverMaps(): Promise<typeof naver.maps> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("네이버 지도 SDK는 브라우저에서만 로드할 수 있어요."));
  }

  if (window.naver?.maps) {
    return Promise.resolve(window.naver.maps);
  }

  if (loading) {
    return loading;
  }

  const keyId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

  if (!keyId) {
    return Promise.reject(
      new Error("NEXT_PUBLIC_NAVER_MAP_CLIENT_ID가 없어요. pnpm env:sync를 실행해 주세요."),
    );
  }

  loading = new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID);
    const script =
      existing instanceof HTMLScriptElement ? existing : document.createElement("script");

    const handleLoad = () => {
      if (window.naver?.maps) {
        resolve(window.naver.maps);
        return;
      }
      // 스크립트는 받았지만 인증이 거부된 경우다. 서비스 URL 등록을 먼저 확인한다.
      fail(new Error("네이버 지도 SDK 인증에 실패했어요. 서비스 URL 등록을 확인해 주세요."));
    };

    const handleError = () => {
      fail(new Error("네이버 지도 SDK를 불러오지 못했어요."));
    };

    // 실패한 태그를 남겨두면 다음 시도가 이미 끝난 load 이벤트를 기다리며 멈춘다.
    const fail = (error: Error) => {
      script.remove();
      loading = null;
      reject(error);
    };

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    if (!existing) {
      script.id = SCRIPT_ID;
      script.async = true;
      script.src = `${SDK_ORIGIN}?ncpKeyId=${keyId}`;
      document.head.append(script);
    }
  });

  return loading;
}
