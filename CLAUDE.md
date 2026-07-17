# ttalkkak-web

<!--
유지보수 노트 (블록 HTML 주석은 context 주입 전에 제거되므로 토큰을 쓰지 않는다)

설계 원칙:
- 이 파일은 항상 로드된다. 모든 세션에 필요한 것만 둔다. 목표 40~80줄.
- rule을 `@` import하지 말 것. import된 파일은 시작 시 통째로 로드되므로
  정리 수단일 뿐 경량화 수단이 아니다. 경로는 백틱으로 감싼다.
- rule 내용을 여기 요약해서 다시 넣지 말 것. 중복은 곧 불일치가 된다.
- 문장을 추가하기 전에 물을 것: 이 문장이 실제 판단을 바꾸는가?
  다른 곳에 정본이 있는가? Claude Code 기본 동작과 중복되는가?
- Context routing에는 paths가 놓치는 것만 둔다. paths가 잡는 조건을
  여기 또 쓰면 중복이다. (conventions는 paths가 전부 잡으므로 없다.)

상세 설계: docs/superpowers/specs/2026-07-17-claude-md-design.md (gitignore, 로컬)
-->

## Project

또맛또(TMT) — 그룹 안에서 맛집 평가를 공유하는 **모바일 전용 웹앱**. 데스크탑 반응형은 구현하지 않고, 넓은 화면에서는 430px 프레임을 중앙 정렬한다.

Next.js 16 App Router / React 19 / TypeScript strict / Tailwind v4 / pnpm / Node >= 22.13.0

## Canonical commands

- Install: `pnpm install`
- Development: `pnpm dev`
- Lint + format: `pnpm check` (Biome)
- Typecheck: `pnpm typecheck`
- Build: `pnpm build`
- Verify: `pnpm verify` (check → typecheck → build)

자동 테스트 명령은 없다. 테스트를 통과했다고 말하지 않는다.

## Universal working agreement

- 코드 변경 후 `pnpm verify`를 실행한다. 일부만 실행했다면 실행 범위와 생략 이유를 밝힌다.
- production dependency를 추가하기 전에 필요성과 대안을 확인하고 보고한다.
- 기존 경계와 추상화를 이유 없이 우회하지 않는다.
- 정확한 값과 현재 동작은 코드, 설정, schema를 source of truth로 본다. rule과 실제 코드가 다르면 추측하지 말고 차이를 명시한다.

## Context routing

작업과 관련 있는 rule만 읽는다. `src/` 파일을 다루면 해당 rule이 자동으로 붙지만, 아래는 파일을 열기 전에 먼저 읽는다.

### Architecture — `.claude/rules/architecture.md`

새 라우트·기능·모듈 추가, 모듈 경계나 import 방향 변경, 상태 소유권이나 데이터 흐름 변경, API 연동·schema·storage 변경, 새 dependency나 layer 도입을 **계획하기 전에** 읽는다.

### Design system — `.claude/rules/design-system.md`

UI, 스타일, 토큰, 접근성, 레이아웃을 **계획하기 전에** 읽는다.

## Repository facts

- 구조 정본은 `docs/frontend-architecture.md`다. 단 §5(orval/api-gen)와 §5.4(MSW)는 아직 미도입이니 현재 코드로 간주하지 않는다.
- `.claude/review/**`는 PR 리뷰 봇 `mashong-ai`가 PR에서 쓰는 기준이다. 코딩 작업에서 읽지 않는다.
- 커밋 메시지는 `<type>: <제목>` (type: feat, fix, refactor, chore, style, deploy, docs). GitHub Ruleset이 검증한다.
