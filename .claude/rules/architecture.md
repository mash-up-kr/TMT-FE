---
paths:
  - "src/**/*.{ts,tsx}"
---

# Architecture Rules

## Source of truth

구조 정본은 `docs/frontend-architecture.md`다.

segment 명세, 코드 배치 decision tree, 안티패턴 목록이 필요하면 그 문서를 읽는다. 이 문서에 복제하지 않는다.

## 항상 지키는 3규칙

1. 모든 코드는 `src/app/{route}/_*/`에서 시작한다.
2. 두 곳 이상에서 쓰이면 `src/shared/`로 승격한다.
3. import는 route → shared 단방향이다.

금지: `shared/` → `app/` import, 라우트 간 직접 import, 다른 라우트의 `_*` 폴더 import.

## 현재 사실과 다른 부분

`docs/frontend-architecture.md`의 다음 절은 **아직 미도입**이다. 현재 코드로 간주하지 않는다.

- §5 API 생성 정책 — `src/api/`도 `pnpm api-gen` 스크립트도 orval 의존성도 없다.
- §5.4 Mock 서버 — msw 의존성이 없다.

API 연동이 필요해지면 `@/api/gen/...`에서 import하려 하지 말고, 먼저 도입이 필요하다고 보고한다. 도입하는 변경에서 이 절의 해당 항목을 제거한다.

## Unresolved decisions

- 서버 상태는 react-query를 쓴다 (`src/shared/providers/QueryProvider.tsx`).
- `zustand`는 설치되어 있으나 사용처가 없다. 실제 cross-route 요구가 확인되기 전에는 전역 store를 만들지 않는다.
- 라우트를 추가할 때 §3 폴더 구조를 따른다. 기존 라우트 현황은 이 문서가 아니라 `src/app/`을 직접 확인한다.

위 미결정 사항을 임의로 확정하지 않는다.
