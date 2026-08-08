# TMT-FE

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
- API 코드 생성: `pnpm api-gen` (OpenAPI 스펙 fetch → orval)

자동 테스트 명령은 없다. 테스트를 통과했다고 말하지 않는다.

## Universal working agreement

- 코드 변경 후 `pnpm verify`를 실행한다. 일부만 실행했다면 실행 범위와 생략 이유를 밝힌다.
- production dependency를 추가하기 전에 필요성과 대안을 확인하고 보고한다.
- 기존 경계와 추상화를 이유 없이 우회하지 않는다.
- 정확한 값과 현재 동작은 코드, 설정, schema를 source of truth로 본다. rule과 실제 코드가 다르면 추측하지 말고 차이를 명시한다.
- 내 변경으로 rule의 서술이 코드와 달라지면 같은 변경에서 rule을 갱신한다.

## Context routing

작업과 관련 있는 rule만 읽는다. Claude Code는 path와 일치하는 `src/` 파일을 읽을 때 해당 rule을 자동으로 붙인다. 구조 계획은 관련 rule을 먼저 읽고 시작한다.

### Architecture — `.claude/rules/architecture.md`

새 라우트·기능·모듈 추가, 모듈 경계나 import 방향 변경, 상태 소유권이나 데이터 흐름 변경, API 연동·schema·storage 변경, 새 dependency나 layer 도입을 **계획하기 전에** architecture rule을 읽는다.

### Design system — `.claude/rules/design-system.md`

UI, 스타일, 토큰, 접근성, 레이아웃을 **계획하기 전에** 읽는다.

## Shared agent skills

- 공용 project skill의 정본은 `.agents/skills/<name>/`이다.
- Claude Code 호환 경로는 `.claude/skills/<name>`에서 정본을 가리키는 상대 symlink로 유지한다.
- 공용 skill에는 런타임 고유 도구명을 넣지 않고, 연결된 도구의 기능 단위로 절차를 기술한다.

## Repository facts

- 구조 규약, API 계약, Mock 정책의 정본은 `.claude/rules/architecture.md`다.
- `.claude/review/**`는 PR 리뷰 봇 `mashong-ai`가 PR에서 쓰는 기준이다. 코딩 작업에서 읽지 않는다.
- 브랜치는 develop에서 `<type>/#<번호>-<내용>`으로 만든다 (번호는 Jira TMT 티켓). PR은 develop 대상이며, 1인 이상 승인과 squash merge를 GitHub Ruleset이 강제한다.
- 커밋 메시지는 `<type>: <제목>` (type: feat, fix, refactor, chore, style, deploy, docs). GitHub Ruleset이 검증한다.
