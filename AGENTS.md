# TMT-FE — Agent Instructions

이 파일은 Codex 등 `CLAUDE.md`를 자동 로드하지 않는 에이전트용 진입점이다. 작업 규약의 정본은 `CLAUDE.md`이며, 이 파일에 내용을 복제하지 않는다. 두 파일이 다르면 `CLAUDE.md`를 따른다.

## 시작 절차

1. `CLAUDE.md`를 먼저 읽는다. 프로젝트 정의, 정식 명령어, 공통 작업 규약, repository facts가 있다.
2. 아래 routing 조건에 해당하면, 파일을 열거나 계획을 세우기 전에 해당 rule을 읽는다.

## Rule routing (수동)

`CLAUDE.md`의 Context routing 절에 나오는 "rule이 자동으로 붙는다"는 Claude Code 전용 동작(`paths` frontmatter)이다. 이 환경에는 자동 첨부가 없으므로 아래 표대로 직접 읽는다.

- `src/**/*.{ts,tsx,css}`를 다루는 작업: `.claude/rules/architecture.md`
- `src/**/*.{ts,tsx}`를 다루는 작업: `.claude/rules/conventions.md` 추가로 읽는다.
- UI·스타일 작업 (`src/**/*.tsx`, `src/**/*.css`): `.claude/rules/design-system.md` 추가로 읽는다.

rule 파일 상단의 `paths:` frontmatter는 이 환경에서는 무시하고, 위 조건 판단에만 참고한다.
