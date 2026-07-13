# FF 검증 런타임 설계

이 문서는 `@mashong-ai ff검증`이 `.claude/review/frontend-fundamental` 기준 문서를 사용해 PR diff를 검증하는 방식을 정의합니다.

목표는 "Frontend Fundamentals 위반을 많이 찾기"가 아니라, 원본 기준에 근거한 신뢰 가능한 피드백만 게시하는 것입니다.

라우팅 축은 `code-quality`, `bundling`, `a11y`, `debug`입니다.

## 입력

- PR diff
- 변경 파일 목록
- 추가/수정된 line mapping
- PR 제목/본문
- 필요 시 기존 PR 요약
- `.claude/review/frontend-fundamental/index.json`
- `.claude/review/frontend-fundamental/code-quality/**/*.md`
- `.claude/review/frontend-fundamental/bundling/**/*.md`
- `.claude/review/frontend-fundamental/a11y/**/*.md`
- `.claude/review/frontend-fundamental/debug/**/*.md`

## 실행 흐름

1. Diff 전처리
   - 추가/수정된 라인만 후보로 잡습니다.
   - 삭제 라인만 있는 hunk에는 line comment를 달지 않습니다.
   - 파일 경로, import, 함수/컴포넌트 이름, 주변 hunk 문맥을 추출합니다.

2. Rule routing
   - 먼저 `index.json`의 `axes`와 변경 파일/키워드를 보고 관련 축을 고릅니다.
   - 그 다음 `rules`의 `keywords`, `signals`, `categoryPath`, `ruleType`으로 후보 rule을 고릅니다.
   - 기본 후보 수는 3-6개입니다.
   - `bundling`과 `debug` 축은 측정/맥락 의존성이 높으므로 강한 신호가 있을 때만 후보에 포함합니다.
   - `tradeoff` rule은 강한 신호가 있을 때만 후보에 포함합니다.

3. Rule document loading
   - 후보 rule의 md 파일만 로드합니다.
   - 최종 판단 근거는 항상 rule md입니다.
   - `index.json`은 검색과 라우팅용으로만 사용합니다.

4. Candidate generation
   - LLM은 후보 rule별로 가능한 지적 후보를 만듭니다.
   - 후보는 반드시 diff의 특정 추가/수정 라인에 연결되어야 합니다.
   - 원본 문서의 `관찰 가능한 신호`, `게시 조건`, `억제 조건`을 함께 인용해야 합니다.

5. Blue / Red / Arbiter 검증
   - Blue team: 게시해야 하는 이유를 주장합니다.
   - Red team: 오탐 가능성과 억제 조건을 주장합니다.
   - Arbiter: 최종적으로 `publish`, `summary_only`, `suppress` 중 하나를 결정합니다.

6. Deterministic gate
   - Arbiter 결과가 `publish`여도 코드 규칙 게이트를 통과해야 게시합니다.
   - 게이트 실패 시 `summary_only` 또는 `suppress`로 낮춥니다.

7. Output
   - 최대 5개 line comment를 게시합니다.
   - 게시하지 않은 후보는 운영 로그에 남깁니다.
   - PR 코멘트에는 검증 요약, 참고된 기준, 체크 사항, 실행 메타를 정리합니다.

## Blue / Red / Arbiter 역할

### Blue team

Blue team은 "이 후보가 FF 기준에 따라 게시될 가치가 있다"는 입장을 맡습니다.

필수 근거:

- 어떤 rule이 적용되는지
- diff의 어떤 추가/수정 라인이 근거인지
- rule md의 `게시 조건` 중 무엇을 만족하는지
- 개선 방향이 원본 FF 예시 또는 선택 기준과 어떻게 연결되는지

### Red team

Red team은 "이 후보는 오탐이거나 게시하면 안 된다"는 입장을 맡습니다.

필수 근거:

- rule md의 `억제 조건` 중 무엇에 걸리는지
- diff만으로 판단하기 부족한 맥락이 무엇인지
- 팀 컨벤션 또는 취향 문제로 보일 가능성이 있는지
- `tradeoff` rule이라면 반대 선택지도 타당한지

### Arbiter

Arbiter는 Blue와 Red를 모두 본 뒤 최종 결론을 냅니다.

결정값:

- `publish`: line comment로 게시
- `summary_only`: line comment는 달지 않고 요약에만 반영
- `suppress`: 아무 것도 게시하지 않음

Arbiter 원칙:

- 애매하면 `suppress`
- 근거가 있지만 line comment로 단정하기 약하면 `summary_only`
- `tradeoff` rule은 `bad_good` rule보다 한 단계 더 보수적으로 판단
- 원본 문서의 코드 예시와 구조적으로 유사하지 않으면 게시하지 않음
- PR diff의 추가/수정 라인에 직접 연결되지 않으면 게시하지 않음

## 출력 스키마

```json
{
  "decision": "publish | summary_only | suppress",
  "axis": "code-quality | bundling | a11y | debug",
  "ruleId": "readability/context-reducing/submit-button",
  "ruleType": "bad_good | tradeoff",
  "title": "이 PR에서 관찰된 체크 사항 제목",
  "file": "src/example.tsx",
  "line": 42,
  "priority": "P3 | P4 | P5",
  "confidence": 0.0,
  "evidence": {
    "diffSnippet": "...",
    "observedSignal": "...",
    "publishCondition": "...",
    "suppressConditionChecked": "..."
  },
  "blue": "게시해야 하는 핵심 이유",
  "red": "오탐 또는 억제 가능성",
  "arbiter": "최종 판단 이유",
  "comment": "게시할 코멘트 본문",
  "suggestedFix": "구체적인 코드 기반 제안 수정안. 없으면 빈 문자열",
  "safeSuggestion": false
}
```

## Deterministic gate

아래 조건을 모두 통과해야 line comment를 게시합니다.

- `decision`이 `publish`
- `line`이 PR diff의 추가/수정 라인
- `ruleId`가 `index.json`에 존재
- `axis`가 `index.json`에 존재하고 rule의 축과 일치
- 해당 rule md 파일이 존재
- `confidence >= 0.72`
- 같은 파일/라인에 이미 더 강한 후보가 없음
- 같은 rule로 게시되는 코멘트가 2개 이하
- 전체 게시 코멘트가 5개 이하
- `comment`가 구체적인 코드 근거와 개선 방향을 포함
- `comment`가 단정적 비난이 아니라 제안형 문장

추가로 `tradeoff` rule은 아래 조건을 더 요구합니다.

- `confidence >= 0.82`
- Red team이 제시한 반대 선택지를 Arbiter가 명시적으로 반박
- "이 선택도 가능하지만" 수준이면 `summary_only`로 낮춤

추가로 `bundling` rule은 아래 조건을 더 요구합니다.

- package.json, bundler config, import 위치 중 하나 이상을 근거로 삼음
- 번들 크기나 초기 로딩 영향이 추측뿐이면 `summary_only`로 낮춤
- 측정 명령이나 분석 방법을 구체적으로 제안할 수 있어야 함

추가로 `debug` rule은 아래 조건을 더 요구합니다.

- PR이 bugfix, regression, hotfix, incident, failing test 수정 성격임
- 원인/재현/검증 중 어떤 축이 비어 있는지 특정할 수 있음
- 단순 코드 취향 지적으로 보이면 `suppress`

## 댓글 작성 원칙

댓글은 짧고 구체적으로 작성합니다.

포함할 것:

- 문제가 되는 코드 구조
- 적용한 FF 기준
- 왜 이 PR 맥락에서 의미 있는지
- 가능한 개선 방향

피할 것:

- 원본 문서 장문 인용
- "항상", "반드시" 같은 과한 단정
- 코드 전체 재작성 제안
- 팀 컨벤션으로 보일 수 있는 취향 지적

예시:

```text
이 분기는 viewer/admin에서 실행되는 UI와 effect가 한 컴포넌트 안에 함께 있어 읽는 사람이 두 흐름을 동시에 따라가야 합니다.
FF의 "같이 실행되지 않는 코드 분리하기" 기준으로 보면, 각 분기를 `ViewerSubmitButton` / `AdminSubmitButton`처럼 나누면 분기별 책임이 더 선명해질 수 있습니다.
```

## 운영 로그

게시 여부와 관계없이 후보 판단은 로그로 남깁니다.

필드:

- PR 번호
- commit SHA
- ruleId
- decision
- confidence
- file/line
- blue summary
- red summary
- arbiter summary
- gate failure reason
- published comment id

로그 목적:

- 오탐 분석
- rule md 개선
- routing 개선
- confidence threshold 조정

## 추가 고려 원칙

Latent.Space의 "How to Kill the Code Review" 글에서 얻은 방향을 FF 검증에도 반영합니다.

- 사람의 역할은 모든 코드를 읽는 것이 아니라, 기준과 수락 조건을 앞단에서 정하는 것입니다.
- LLM에게 "맞게 판단했는지"만 묻지 않고, 검증 가능한 산출물을 남기게 합니다.
- 신뢰는 단일 리뷰어가 아니라 여러 층의 필터로 만듭니다.
- Blue / Red / Arbiter는 LLM의 자기검증이 아니라 역할을 분리한 adversarial verification으로 다룹니다.
- deterministic gate는 의견이 아니라 사실 기반 pass/fail 필터여야 합니다.
- FF 검증은 PR 승인 게이트가 아니라, 관찰 가능한 기준에 따라 좋은 피드백을 남기는 보조 레이어입니다.
- 운영 로그는 "리뷰 결과"가 아니라 다음 rule, routing, threshold를 개선하는 관찰 데이터입니다.

## 운영 경계

- 원본 FF 사이트는 런타임에서 fetch하지 않습니다.
- 모든 FF 문서를 매 요청마다 통째로 주입하지 않습니다.
- confidence가 낮거나 diff 라인 근거가 약한 후보는 line comment로 게시하지 않습니다.
- `tradeoff` rule은 반대 선택지가 타당하면 요약 또는 운영 로그로 낮춥니다.
- 측정이 필요한 bundling/debug 항목은 추측만으로 단정하지 않습니다.
