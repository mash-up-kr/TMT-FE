# Review Policy

이 문서는 `mashong-ai` PR 리뷰 기준의 공통 정책 원본입니다.

정책성 판단은 이 파일을 먼저 따르고, 각 rule 문서는 이 정책을 구체 사례에 적용한 문서로 봅니다.

## 관리 원칙

`.claude/review/**`가 현재 리뷰 기준의 정본입니다.

- `docs/`에 같은 내용을 복제하지 않습니다.
- `.claude` 루트에는 임시 문서나 세션 산출물을 두지 않습니다.
- 개인 세션 메모리는 `.Codex/**`에 둡니다.
- 런타임과 사람이 같은 문서를 보도록 유지합니다.
- 공통 정책은 이 `Policy.md`에 모읍니다.
- 각 rule 문서의 정책성 문구는 이 파일과 충돌하면 안 됩니다.

## 정본 위치

현재 정본은 `ttalkkak-web/.claude/review/**`입니다.

- kid-o의 `~/kid-o/apps/ttalkkak-review-bot/review/**`는 운영 fallback 사본입니다.
- 정책 변경은 먼저 `ttalkkak-web/.claude/review/**`에 반영하고, 그 다음 kid-o fallback에 동기화합니다.
- 나중에 `ttalkkak-review-bot`을 별도 repo로 분리하면, 그 repo의 `review/**`를 정본으로 옮기고 제품 repo는 config 참조와 override만 둡니다.

## 리뷰 모델

일반 리뷰는 PR의 의도와 변경 표면을 먼저 이해한 뒤, 프론트엔드 리뷰 관점을 선택해 후보를 생성합니다.

```text
PR 의도 이해
→ 변경 표면과 diff chunk 분리
→ frontend reviewer 후보 생성
→ Red / Blue / Arbiter 검증
→ deterministic evidence gate
→ editor 최종 정리
→ 작업 요약과 line comment 출력
```

`default/rules/*.md`는 후보를 설명하고 검증하는 기준입니다. 문서에 직접 대응되는 `ruleId`가 없는 후보도 `lensId`와 `lensName`으로 다룰 수 있지만, 공개 게시 기준은 동일하게 적용합니다.

Frontend Fundamental 리뷰는 `.claude/review/frontend-fundamental/**`의 원문 기반 기준만 사용합니다.

## 판단 원칙

- `index.json`은 라우팅과 후보 rule 선택을 위한 메타데이터입니다.
- 실제 판단 근거는 각 rule 문서입니다.
- AI가 감으로 판단하지 않도록 각 rule은 게시 조건과 억제 조건을 함께 가져야 합니다.
- 일반 리뷰는 `P1~P5`, Frontend Fundamental 리뷰는 기본적으로 `P3~P5` 중심으로 사용합니다.
- 같은 라인에 일반 리뷰와 Frontend Fundamental 리뷰가 동시에 걸리면, 런타임 리스크가 있는 일반 리뷰를 우선합니다.
- 공개 코멘트는 증거가 있는 항목만 남기고, 판단 과정은 필요할 때 접힌 영역으로 제공합니다.

## PN 기준

팀의 상위 기준은 Confluence `[Github] Pn Rule에 대하여` 문서를 따릅니다.

- Confluence: https://ttalkkak.atlassian.net/wiki/spaces/ttalkkak/pages/6815932/Github+Pn+Rule
- 이 섹션은 위 기준을 코드 리뷰 자동화 관점으로 옮긴 운영 원본입니다.
- 각 rule 문서의 `PN 기준`은 이 공통 정의를 해당 rule에 적용한 예시입니다.

## P1

머지 전 반드시 수정해야 하는 결함입니다.

사용 기준:

- 서비스 중단, 데이터 손상, 결제/권한/보안 사고가 직접 보입니다.
- 현실적인 사용자 경로에서 즉시 재현 가능하고 영향이 큽니다.
- 작성자가 반영하지 않으려면 리뷰어를 설득할 수 있는 강한 근거가 필요합니다.

리뷰 강도:

- Request Changes에 가깝습니다.
- `evidenceLevel 3`이 필요합니다.

## P2

적극 고려해야 하는 결함입니다.

사용 기준:

- 실제 사용자 경로의 특정 입력/상태에서 기능이 깨집니다.
- 잘못된 상태가 저장되거나 다른 화면/캐시/서버 상태로 전파됩니다.
- 주요 행동이 실패하거나 실패 응답이 성공 흐름으로 섞입니다.

리뷰 강도:

- 작성자가 지금 반영하거나, 반영하지 않는 이유와 후속 계획을 남기는 것이 자연스럽습니다.
- Request Changes 또는 Comment가 될 수 있습니다.
- `evidenceLevel 3`이 필요합니다.

## P3

웬만하면 반영하는 결함 후보입니다.

사용 기준:

- 실제 문제가 될 가능성은 높습니다.
- 다만 영향이 보조 UI, 제한된 입력, 특정 타이밍, 일부 추론 맥락에 머뭅니다.
- 수정 방향이 명확하고 비용이 작으면 고치는 편이 좋습니다.

리뷰 강도:

- Comment에 가깝습니다.
- 작성자가 반영하지 않아도 P2처럼 강한 해명 압박을 주지는 않습니다.
- `evidenceLevel >= 2`이고 수정 방향이 명확해야 합니다.

## P4

선택적 개선입니다.

사용 기준:

- 안정성, 가독성, 운영성을 조금 더 좋게 만들 수 있습니다.
- 현재 PR에서 반드시 고쳐야 할 결함이라고 보기는 어렵습니다.
- 반영해도 좋고 넘어가도 됩니다.

리뷰 강도:

- Approve 가능한 제안입니다.
- `evidenceLevel >= 2`이면 공개 라인 코멘트로 남길 수 있습니다.

## P5

사소하지만 구체적 근거가 있는 의견이나 질문입니다.

사용 기준:

- 문구, 네이밍, 작은 질문, 취향에 가까운 의견입니다.
- 코드 결함보다는 대화 유도에 가깝습니다.

리뷰 강도:

- 기본적으로 공개 라인 코멘트는 자제합니다.
- 남긴다면 매우 짧고 질문형이어야 합니다.

## P2 / P3 분기 기준

P2와 P3는 "문제가 있나?"가 아니라 "작성자에게 어느 정도 대응을 요구해야 하나?"로 나눕니다.

- `P2`: 작성자가 지금 반영하거나 못 하면 이유/계획을 남겨야 할 정도의 주요 사용자 영향이 있습니다.
- `P3`: 실제 결함 가능성은 높지만 영향 범위가 제한적이거나 제품 맥락에 따라 심각도가 달라집니다.

예시:

- 실패 응답이 체크아웃 성공 흐름, 저장 완료 상태, 캐시 성공 데이터로 섞이면 `P2`입니다.
- 평균 가격, 보조 문구, 제한된 표시값이 특정 경계값에서 잘못 보이면 보통 `P3`입니다.
- 같은 `NaN`이라도 결제 금액이나 주문 가능 여부 판단에 쓰이면 `P2`, 보조 요약 표시값이면 `P3`입니다.

## Evidence Level과의 관계

PN은 영향 강도이고, `evidenceLevel`은 근거 강도입니다.

- 높은 PN을 쓰려면 높은 evidence가 필요합니다.
- 근거가 약하면 문제 자체가 그럴듯해도 PN을 낮추거나 suppress합니다.
- `confidence`는 AI 내부 참고값이고, 공개 게시 여부는 `evidenceLevel`을 우선합니다.

## 출력 표현

리뷰 코멘트는 팀이 바로 읽을 수 있는 표현만 사용합니다.

- 일반 리뷰와 FF 검증 모두 `🔴 P1`, `🟠 P2`, `🟡 P3`, `🟢 P4`, `⚪ P5` 형식을 사용합니다.
- FF 검증의 PR 코멘트 섹션명은 `체크 사항`을 사용합니다.
- 내부 단계명이나 후보 상태명은 사용자-facing 문구로 직접 노출하지 않습니다.
- 판단 과정은 `📑 판단근거` 토글 안에 Red / Blue / Arbiter 관점으로 정리합니다.
- 작업 요약은 line comment보다 먼저 생성하고, line comment 준비 중이면 요약에 진행 중 상태를 표시합니다.

## 정책 변경 절차

팀 PN 정책이나 리뷰 출력 정책이 바뀌면 아래 순서로 수정합니다.

1. Confluence 원문 변경 내용을 확인합니다.
2. 이 파일을 먼저 수정합니다.
3. `default/README.md`와 `frontend-fundamental/README.md`의 요약 기준을 맞춥니다.
4. 각 rule 문서의 rule-specific 예시가 새 기준과 충돌하는지 확인합니다.
5. `review-planner`, `frontend-reviewer`, `review-verifier`, `editor` prompt의 정책 문구를 함께 확인합니다.
6. kid-o 런타임 fallback인 `~/kid-o/apps/ttalkkak-review-bot/review/**`와 prompt 사본을 동기화합니다.
7. synthetic PR 또는 최근 실제 PR 하나로 출력과 P2/P3 분기가 의도대로 나오는지 확인합니다.

상세 파이프라인 설계 변경은 Confluence 상세 설계 문서에 기록합니다.

- 상세 설계: https://ttalkkak.atlassian.net/wiki/spaces/ttalkkak/pages/43220993
- 흐름도: https://ttalkkak.atlassian.net/wiki/spaces/ttalkkak/pages/43286532

## Rule 문서 추가 절차

새 일반 리뷰 rule을 추가할 때는 아래를 함께 수정합니다.

1. `default/rules/{rule-id}.md`
2. `default/index.json`
3. 필요하면 `review-planner` 또는 `frontend-reviewer` prompt
4. 필요하면 `review-verifier` 또는 `editor` prompt
5. bot runtime의 review 문서 검증과 typecheck

Rule 문서에는 최소한 아래 섹션이 있어야 합니다.

- 목적
- 관찰 가능한 신호
- 게시 조건
- 억제 조건
- 나쁜 예
- 좋은 예
- Verification rule
- PN 기준

## 점검

문서 일관성 검사는 bot runtime의 review 문서 검증 스크립트로 수행합니다.

이 제품 repo에는 봇 실행 스크립트를 두지 않고, `.claude/review/**` 기준 문서만 둡니다.

## 운영 로그 사용

`logs/rule-observations.jsonl`은 자동 문서 수정의 입력이 아니라 판단 보조 데이터입니다.

운영 루프는 아래 순서를 따릅니다.

1. `rule-observations-report.ts`로 반복되는 오탐/누락/게시 제한 패턴을 확인합니다.
2. 리포트의 `Maintenance Actions`를 보고 어떤 rule, index, prompt를 검토할지 정합니다.
3. 문서 또는 prompt 수정안은 사람이 검토합니다.
4. 승인된 내용만 rule 문서, index, prompt에 반영합니다.
5. bot runtime의 문서 검증과 typecheck를 통과한 뒤 운영 fallback에 동기화합니다.

주요 해석 기준:

- `false_positive_tuning_candidate`: 억제 조건 또는 verifier Red 관점을 보강할 후보입니다.
- `positive_example_candidate`: rule 문서의 좋은 예나 게시 조건에 반영할 후보입니다.
- `publish_limit_candidate`: `maxPublishComments`, 우선순위 정렬, PR 요약 grouping을 검토할 후보입니다.
- `publish_or_suppress_condition_review`: 게시 조건과 억제 조건의 경계를 정리할 후보입니다.
- `rule_replacement_candidate`: 두 rule의 책임 경계가 겹치는지 확인할 후보입니다.
