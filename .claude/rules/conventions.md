---
paths:
  - "src/**/*.{ts,tsx}"
---

# Code Conventions

## Sources of truth

- 문법·포맷·import 정렬: `biome.json`
- 타입 설정: `tsconfig.json` (strict, `@/*` → `./src/*`)

따옴표, 세미콜론, 들여쓰기, 줄 길이는 Biome이 정본이다. 이 문서에 복제하지 않는다. 이 문서와 실행 가능한 설정이 충돌하면 설정을 우회하지 말고 충돌을 보고한다.

## Types and validation

- 내부 정적 타입과 외부 입력 검증을 구분한다.
- network response, 환경 변수, user input, storage 데이터는 경계에서 검증한다. 신뢰된 내부 타입으로 간주하지 않는다.
- `any`, 근거 없는 type assertion, non-null assertion으로 불확실성을 숨기지 않는다.
- 런타임 스키마 검증 라이브러리는 아직 없다. 필요하면 임의로 추가하지 말고 보고한다.

## Dependencies

- 기존 dependency와 플랫폼 API로 해결 가능한지 먼저 확인한다.
- production dependency 추가 전 목적, 대안, 크기를 검토하고 이유를 보고한다.
- 하나의 단순 기능을 위해 무거운 라이브러리를 추가하지 않는다.
- API 연동과 HTTP client 선택은 architecture rule의 API·Mock 도입 계약을 따른다.

## Generated and external files

- `next-env.d.ts`는 생성 파일이다. 직접 수정하지 않는다.
- `pnpm-lock.yaml` 변경이 `package.json` 변경과 일치하는지 확인한다.

## Testing

- 자동 테스트 명령이 없다. 테스트 프레임워크를 임의로 추가하지 않는다.
- 테스트를 통과했다고 말하지 않는다. 검증은 `pnpm verify`로 한다.
- 테스트 러너를 도입하는 변경에서 이 절과 CLAUDE.md의 명령 목록을 갱신한다.
