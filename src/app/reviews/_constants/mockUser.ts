const DEFAULT_MOCK_USER_ID = 1;

const configured = Number(process.env.NEXT_PUBLIC_MOCK_USER_ID);

/**
 * mock backend가 쿼리 파라미터로 요구하는 사용자 식별자.
 *
 * `src/api/mutator.ts`가 같은 환경 변수로 `X-User-Id` 헤더를 만든다. import 경계상 라우트는
 * `api/mutator`를 import할 수 없어 상수를 공유하지 못하므로, 양쪽이 같은 규칙으로 각자 읽는다.
 */
export const MOCK_USER_ID =
  Number.isSafeInteger(configured) && configured > 0 ? configured : DEFAULT_MOCK_USER_ID;
