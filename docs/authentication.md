# TMT-359 인증

## 선택과 근거

2026-09-07 합의: access token은 브라우저 메모리, refresh token은 Next.js가 설정하는 HttpOnly 쿠키에 둔다. 일반 API는 기존 Orval·React Query를 통해 백엔드에 직접 요청한다.

이 선택은 기존 호출 구조를 유지하면서 장기간 재발급에 쓰이는 refresh token의 JavaScript 노출을 줄이는 절충안이다. 가장 강한 토큰 격리 방식이라는 뜻은 아니다.

| 방식 | 효과 | 부담·한계 |
| --- | --- | --- |
| 두 토큰을 localStorage에 저장 | 구현·로그인 유지가 간단 | JavaScript가 장기간 유효한 refresh까지 읽을 수 있음 |
| access 메모리 + refresh HttpOnly | refresh를 숨기고 API 직접 호출 유지 | access 유출·악성 코드의 재발급 요청까지 방지하지는 못함 |
| BFF에서 두 토큰 사용 | JavaScript에 두 토큰 모두 노출하지 않음 | 모든 보호 API의 중계·헤더·오류·업로드 등을 Next.js가 관리 |

토큰의 JavaScript 노출을 없애는 것이 변경 범위보다 중요해지거나, 서버 렌더링에서 인증된 데이터를 제공해야 하면 BFF를 다시 검토한다. Orval·React Query는 BFF에서도 유지할 수 있다.

참고: [IETF 브라우저 앱 인증 구조 비교](https://www.ietf.org/ietf-ftp/rfc/rfc10017.html#section-6.2), [OWASP 세션 쿠키](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#httponly-attribute). 우리 서비스 JWT를 다루는 구현이며, 외부 OAuth 표준 전체를 구현했다는 의미는 아니다.

## 요청 흐름

1. `/login`에서 버튼을 누르면 `POST /api/auth/kakao`가 난수 state를 발급하고 10분짜리 HttpOnly 쿠키로 저장한다. 서버의 REST API 키로 카카오 인가 URL을 만들어 반환한다.
2. 브라우저가 인가 URL(`client_id=REST API 키`)로 이동한다. 카카오가 `/auth/kakao/callback`으로 돌아오면 서버가 state 쿠키와 쿼리를 비교한다. 로그인에 JavaScript SDK를 사용하지 않는다.
3. Next.js가 생성된 `loginWithKakao` client로 백엔드에 인가 코드를 넘긴다. 응답을 검증하고 refresh 쿠키를 설정한 뒤 `/auth/complete`로 이동한다. 코드나 토큰을 이동 URL에 싣지 않는다.
   state 검증을 통과한 취소·실패는 안전하게 검증한 `returnTo`를 로그인 URL에 보존해 재시도 후에도 원래 화면으로 돌아간다. state가 유효하지 않으면 복귀 경로를 전달하지 않는다.
4. 새 문서에서 `AuthProvider`가 `POST /api/auth/refresh`로 access를 받아 메모리에 저장한다. 로그인 응답의 access는 브라우저에 전달하지 않으므로 최초 로그인에도 재발급 1회가 필요하다.
5. 프로필 저장 API 연결 전까지 신규 사용자는 홈(`/`)으로 이동한다. 기존 사용자는 로그인 전 앱 내부 경로로 이동하며 기본값은 홈이다. 회원가입 화면·프로필 저장은 별도 작업으로 진행한다.
6. API의 `401 AUTH_TOKEN_EXPIRED`일 때만 재발급 후 원래 요청을 한 번 재시도한다. 동시 요청은 Promise를 공유하고 재시도에도 같은 Idempotency-Key를 사용한다. 이미 갱신된 경우 새 토큰을 재사용한다.
7. `AUTH_TOKEN_INVALID`·`UNAUTHORIZED` 또는 재시도한 요청의 401은 세션을 정리한다. 재발급 자체의 401은 refresh 쿠키를 삭제한다. 네트워크·5xx 오류는 쿠키를 보존한다.
8. 로그아웃은 메모리와 Query 캐시를 비우고 `POST /api/auth/logout`으로 쿠키를 지운다. 진행 중인 재발급을 기다린 뒤 삭제하며, 실패하면 재시도 UI를 보여 준다. BroadcastChannel로 시작 시 즉시 알리고, 쿠키 삭제 성공 후에도 다시 알려 그 사이 열린 탭의 세션을 정리한다. 지원 브라우저에서는 Web Locks로 쿠키 변경과 완료 알림의 순서를 맞춘다.

## 재방문 시 로그인 유지 정책

- 같은 브라우저·서비스 출처에 유효한 refresh 쿠키가 남아 있으면, access token이 만료되었거나 메모리에서 사라졌어도 카카오 재로그인·재동의를 요구하지 않는다.
- 새 문서로 재방문하면 먼저 `/api/auth/refresh`로 access token을 발급받아 메모리에 저장한다. 보호 화면은 세션 복원 결과가 나오기 전 로그인 화면으로 보내지 않는다.
- 기존 탭에서 만료된 access token으로 API를 호출하면 `401 AUTH_TOKEN_EXPIRED`를 받은 뒤 재발급하고 원래 요청을 한 번 재시도한다.
- refresh 쿠키가 없거나 만료·무효로 401이 반환되면 세션을 정리하고 보호 화면 접근 시 로그인을 요청한다. 직접 로그아웃하거나 쿠키를 삭제한 경우도 여기에 해당한다.
- 네트워크·서버 오류는 로그인 만료로 취급하지 않는다. 쿠키를 보존하며 세션 복원 실패 시 재시도할 수 있게 한다.

## 경계와 설정

- `KAKAO_REST_API_KEY`: Next.js 서버에서 인가 URL을 구성할 때 사용한다. 백엔드 토큰 교환에 쓰는 REST API 키와 동일한 값을 Infisical에 등록한다. URL의 `client_id`로 브라우저에 노출되는 앱 식별자이며, Client Secret은 백엔드만 소유한다. 기존 `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY`는 로그인에 사용하지 않는다.
- `NEXT_PUBLIC_API_BASE_URL`: 기존 백엔드 주소. `TMT_OPENAPI_URL`은 `pnpm api:sync`에 사용한다.
- `APP_ORIGIN`: 선택 서버 환경 변수. 기본값은 `https://ttomatto-web.vercel.app`. 나중에 운영 도메인이 확정되면 이 값과 카카오 콘솔의 REST API 키에 등록된 redirect URI를 함께 바꾼다.
- 등록한 callback: `https://ttomatto-web.vercel.app/auth/kakao/callback`, `http://localhost:3000/auth/kakao/callback`. 임의 Vercel preview 주소는 허용하지 않는다.
- refresh 쿠키: `tmt-refresh`, HttpOnly, SameSite=Lax, HTTPS에서 Secure, Domain 생략, Path=/api/auth, 7일. 백엔드의 현재 refresh 유효기간에 맞췄으며 설정 변경 시 함께 갱신한다.
- state 쿠키: `tmt-kakao-state`, 동일 보안 속성, Path=/auth/kakao/callback, 10분. 성공·실패 콜백에서 삭제한다.
- 인증 POST는 `handleAuthPost` 안에서 처리한다. 허용한 origin과 실제 요청 origin이 일치하고 cross-site가 아닌 요청만 내부 핸들러를 실행하며, 반환 응답에 no-store·no-referrer를 적용한다. callback redirect에도 같은 응답 헤더를 적용한다.
- `useKakaoLogin`은 로그인 라우트의 인가 시작 요청·카카오 URL 이동·대기 및 오류 상태를 소유한다. 페이지는 URL 해석·로그인 후 이동·화면 구성을 담당한다. 전역 인증 Context와 이를 읽는 `useAuth`는 Provider와 별도 파일에 둔다.
- `AuthProvider`의 가드는 화면/요청 실행 순서를 위한 장치다. 실제 데이터 접근 권한은 백엔드에서 검증한다. 타인 프로필은 비로그인으로 열 수 있고, `/preview/*`는 인증 네트워크 없이 확인한다.

## 현재 계약의 한계

- 메모리도 XSS로부터 안전한 저장소가 아니다. HttpOnly는 refresh 값의 직접 읽기를 막지만 악성 스크립트의 access 획득·사용을 막지는 못한다. SameSite·Origin 검사도 XSS 방어를 대체하지 않는다.
- 백엔드는 토큰 폐기·로그아웃 API가 없다. 로그아웃은 해당 브라우저의 세션 제거이며 이미 유출된 JWT를 무효화하지 못한다. 새 refresh 발급도 이전 refresh의 즉시 무효화를 보장하지 않는다.
- `isNewUser`는 최초 사용자 생성 여부이고, 가입 완료 판정은 `profileCompleted`가 담당한다. 로그인 응답에서 이 필드를 검증하고, 인증 복원 후 `GET /v1/users/me`로 현재 상태를 확인한다. 미완료 사용자는 보호 화면을 마운트하기 전에 `/signup`으로 보낸다. 가입 상태를 확인하지 못한 채 조회가 실패하면 재시도 화면을 표시하고 가드를 통과시키지 않는다. 이미 확인한 가입 상태가 있으면 백그라운드 재조회 실패에도 현재 화면과 입력을 유지한다. 미완료 사용자의 가입 가드와 실제 인증 오류 처리는 계속 적용된다.
- `/signup`은 로그인 사용자만 접근한다. 닉네임(공백 제거 후 유니코드 코드포인트 2~20자)과 선택한 사진의 assetId를 `PUT /v1/users/me/profile`로 저장한다. 사진은 `POST /v1/media/upload-intents`와 발급된 URL의 PUT 업로드를 사용한다. 저장 성공 응답으로 내 프로필 캐시를 갱신한 뒤 기존 온보딩으로 이동한다. 가입 완료는 온보딩 슬라이드 열람 완료와 별개다.
- `SIGNUP_NOT_COMPLETED`(403)는 백엔드의 가입 미완료 제한이다. 토큰 만료가 아니므로 로그아웃이나 토큰 재발급으로 해결하지 않는다. 가입 전 허용 API는 인증·내 프로필 조회·프로필 저장·사진 업로드 발급이다.
- 내 프로필 조회가 `USER_NOT_FOUND`(404)를 반환하면 캐시 유무와 관계없이 X 마스코트와 재로그인 안내를 표시한다. 버튼은 `logoutSession`으로 access·refresh 쿠키·사용자 캐시를 정리한 뒤 로그인으로 이동한다. 쿠키 삭제에 실패하면 로그아웃 재시도 화면을 유지한다. 다른 사용자의 프로필 404에는 이 처리를 적용하지 않는다. 현재 백엔드 재발급은 사용자 존재를 검사하지 않으므로, 계정 삭제 상태를 재발급만으로 복구할 수는 없다.

- 현 API base는 `https://3-39-38-23.sslip.io/api`다. OpenAPI 다운로드 주소는 별도로 HTTP를 사용하지만 토큰 요청은 HTTPS API base를 사용한다. 운영 도메인을 바꿀 때 API base의 HTTPS와 백엔드 CORS 허용 출처도 함께 확인한다.
- 이번 스펙에서 티켓 작성 중 항목은 개별 이력에서 제거되고 `inProgressSaveCount`로 분리됐다. 프리뷰 응답은 새 계약에 맞췄고, 카운트의 별도 UI 연결은 이 인증 작업에 포함하지 않았다.

## 검증 기준

정식 명령은 `pnpm verify`다. 별도 테스트 프레임워크는 추가하지 않는다. 만료 요청 동시성·재시도 횟수·Idempotency-Key 유지·로그아웃 경쟁·Origin 및 state 거부·응답의 refresh 비노출은 격리된 실행으로 확인한다. 실제 카카오 계정 로그인과 배포 도메인의 쿠키 동작은 별도 실제 환경 확인이 필요하다.

## 최신 develop 통합

- AppChrome은 AuthProvider 안에 두어 인증 복원 전에 보호 화면과 하단 내비를 표시하지 않는다.
- 홈·그룹 상세·가게 상세의 임시 사용자 ID 기반 서버 prefetch를 제거한다. 서버에는 브라우저 메모리의 access token이 없으므로 세션 복원 후 기존 Suspense hook으로 조회한다. 로그인 계정의 데이터를 서버에서 선조회하려면 별도 인증 설계가 필요하다.
