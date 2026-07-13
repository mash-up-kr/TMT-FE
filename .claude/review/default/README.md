# Default Code Review Criteria

이 폴더는 `mashong-ai` 일반 코드 리뷰의 기본 판단 기준입니다.

목표는 "많이 지적하기"가 아니라, PR 작성자가 실제로 고칠 가치가 있는 결함 후보만 남기는 것입니다.

## 성격

이 기준은 일반 코드 리뷰가 참고하는 기본 위험 범주입니다.

런타임은 rule 목록을 그대로 순회하지 않고, PR 의도와 변경 표면을 먼저 이해한 뒤 필요한 관점을 선택합니다.

- PR title/body, 변경 파일, package.json, diff chunk를 함께 봅니다.
- 문서화된 rule은 판단 근거와 PN 보정에 사용합니다.
- 문서에 딱 맞지 않아도 프론트엔드 PR에서 의미 있는 후보는 `lensId`와 `lensName`으로 다룰 수 있습니다.
- 공개 코멘트는 verifier와 evidence gate를 통과해야 합니다.

## 구조

- `index.json`: diff에서 관련 rule을 고르기 위한 경량 색인입니다.
- `rules/`: 실제 판단 근거가 되는 rule 문서입니다.
- `../Policy.md`: 일반 리뷰 공통 정책의 원본입니다.

## Rule Pool

- `runtime-safety`: null/undefined, 빈 배열, 안전하지 않은 속성 접근 같은 런타임 크래시를 다룹니다.
- `logic-correctness`: 조건 반전, 상태 전이, 성공/실패 분기 불일치를 다룹니다.
- `api-contract`: API 응답 형태와 외부 데이터 계약 검증을 다룹니다.
- `error-handling`: 요청 실패, 파싱 실패, 실패 상태 누락을 다룹니다.
- `empty-state`: 빈 상태, 0, NaN, 경계값 처리를 다룹니다.
- `react-state-effect`: React 상태, effect, memoization, cleanup 결함을 다룹니다.
- `async-concurrency`: race condition, 중복 제출, stale response, abort/cancel 누락을 다룹니다.
- `cache-consistency`: query invalidation, query key, optimistic rollback, stale cache를 다룹니다.
- `security-basic`: 민감정보 노출, XSS, open redirect, 권한 판단 오류를 다룹니다.
- `deploy-workflow`: GitHub Actions, S3/CloudFront, cache-control, invalidation 같은 배포 워크플로 리스크를 다룹니다.

## Runtime Flow

일반 리뷰는 아래 흐름으로 동작합니다.

```text
PR 의도 이해
→ 변경 표면과 diff chunk 분리
→ frontend reviewer 후보 생성
→ Red / Blue / Arbiter 검증
→ deterministic evidence gate
→ editor 최종 정리
→ 작업 요약과 line comment 출력
```

작업 요약은 line comment보다 먼저 생성합니다. line comment 준비가 오래 걸리면 요약에 진행 중 상태를 표시하고, 리뷰가 끝난 뒤 같은 요약 코멘트를 최종 결과로 갱신합니다.

## Runtime Mode

`index.json`의 각 rule은 런타임 적용 방식을 가집니다.

- `active`: 공개 후보가 될 수 있습니다.
- `strict_active`: 직접 증거가 강할 때만 공개 후보가 될 수 있습니다.

## Evidence Level

`confidence`는 AI의 내부 참고값입니다. 공개 게시 여부와 PN 판단은 `evidenceLevel`을 우선합니다.

- `3`: 추가/수정 라인, 트리거 입력, 사용자 영향, 수정 방향이 모두 직접 보입니다.
- `2`: 추가/수정 라인과 영향은 보이지만 일부 맥락은 추론합니다.
- `1`: 의심은 되지만 주변 맥락이 부족합니다.

초기 공개 게시 정책은 아래를 따릅니다.

- `P1/P2`: `evidenceLevel 3`이 필요합니다.
- `P3`: `evidenceLevel >= 2`이고 수정 방향이 명확해야 합니다.
- `P4/P5`: `evidenceLevel >= 2`이면 공개 라인 코멘트로 게시할 수 있습니다.

## PN 기준

공통 정책은 `../Policy.md`를 따릅니다. 아래 내용은 default 리뷰에서 자주 쓰는 PN 요약입니다.

- `P1`: 머지 전 반드시 수정해야 하는 결함입니다. 서비스에 중대한 오류, 데이터 손상, 보안 사고가 직접 보일 때만 사용합니다.
- `P2`: 적극 고려해야 하는 결함입니다. 실제 사용자 경로의 특정 입력/상태에서 기능이 깨지거나, 잘못된 상태가 저장·전파되거나, 주요 행동이 실패합니다. 반영하지 않으려면 사유나 후속 계획이 필요합니다.
- `P3`: 웬만하면 반영하는 결함 후보입니다. 실제 문제가 될 가능성은 높지만 영향이 보조 UI, 제한된 입력, 특정 타이밍, 일부 추론 맥락에 머뭅니다. 수정 권장은 맞지만 Request Changes에 가까운 압박은 과합니다.
- `P4`: 선택적 개선입니다. 반영해도 좋고 넘어가도 됩니다.
- `P5`: 사소하지만 구체적 근거가 있는 의견이나 질문입니다.

### P2 / P3 분기 기준

- `P2`는 "문제가 있나?"가 아니라 "작성자가 지금 반영하거나 못 하면 이유/계획을 남겨야 하나?"를 기준으로 판단합니다.
- `P2`는 현실적인 재현 경로와 주요 사용자 영향이 diff 또는 주변 코드에서 직접 보여야 합니다.
- `P3`는 실제 결함 가능성이 높아도 영향 범위가 제한적이거나, 상위 계약/제품 맥락에 따라 심각도가 달라질 때 사용합니다.
- 예: 실패 응답이 저장/체크아웃 성공 흐름으로 섞이면 `P2`, 보조 표시값이 특정 경계값에서 잘못 보이면 보통 `P3`입니다.

## Rollout Guardrails

- rule은 고정 체크리스트가 아니라 리뷰 관점 선택을 돕는 기준입니다.
- 공개 라인 코멘트는 기본 최대 20개입니다.
- verifier는 명확한 오탐을 제거하되, 직접 증거가 있는 후보는 삭제보다 priority/evidenceLevel 보정을 우선합니다.
- 런타임 공개 게시 전에는 deterministic evidence gate를 통과해야 합니다.
- 사용자가 반박하거나 오탐으로 확인한 항목은 false-positive bucket으로 기록합니다.

## False Positive Buckets

오탐으로 확인된 항목은 아래 분류로 기록해 rule을 줄이거나 정교화합니다.

- `framework_handles_it`: 프레임워크나 공통 레이어가 이미 처리합니다.
- `typed_contract_exists`: 타입/스키마 계약이 이미 보장합니다.
- `intentional`: 제품 의도상 허용된 동작입니다.
- `not_user_path`: 실제 사용자 경로가 아닙니다.
- `style_only`: 결함이 아니라 취향/스타일 의견입니다.
- `insufficient_context`: 공개 코멘트로 남길 근거가 부족합니다.

## Rule 작성 원칙

각 rule은 아래 항목을 포함합니다.

- 목적
- 관찰 가능한 신호
- 게시 조건
- 억제 조건
- 나쁜 예
- 좋은 예
- Verification rule
- PN 기준
