# Frontend Fundamental 리뷰 기준

이 폴더는 `@mashong-ai ff검증`에서 사용하는 Frontend Fundamentals 기반 리뷰 기준입니다.

전체 리뷰 기준은 `.claude/review/` 아래에서 관리하며, 이 폴더는 Frontend Fundamentals 원문에 근거한 리뷰만 담당합니다.

## 구조

- `index.json`: PR diff에서 관련 축과 규칙을 고르기 위한 경량 색인입니다.
- `code-quality/`: 가독성, 예측 가능성, 응집도, 결합도 기준입니다.
- `bundling/`: 코드 스플리팅, 트리 셰이킹, 번들 분석, 출력 캐시 기준입니다.
- `a11y/`: 구조, 의미, 예측 가능한 인터랙션, 대체 텍스트 기준입니다.
- `debug/`: 진단, 근본 원인 수정, 재현 자동화, 재발 방지 기준입니다.

```text
code-quality/
  rules/
    readability/
    predictability/
    cohesion/
    coupling/
bundling/
  optimization/
  output/
a11y/
  structure/
  semantic/
  predictability/
  alt-text/
debug/
  diagnose/
  reproduce/
  fix/
  prevent/
```

## 운영 원칙

- 런타임은 원본 사이트를 fetch하지 않고 이 로컬 문서만 사용합니다.
- 애매한 후보는 게시하지 않는 것을 기본값으로 둡니다.
- `index.json`의 `signals`와 `publishConditions`는 규칙 문서의 요약입니다.
- 최종 판단 근거는 항상 각 축의 md 문서입니다.
- FF 검증은 기본적으로 `P3~P5` 범위의 구조/가독성 제안을 다룹니다.
- `bundling`과 `debug`는 측정/맥락 의존성이 높으므로 기본적으로 `tradeoff` 성격을 강하게 봅니다.

## 관련 설계 문서

- 상세 설계: https://ttalkkak.atlassian.net/wiki/spaces/ttalkkak/pages/43220993
- 흐름도: https://ttalkkak.atlassian.net/wiki/spaces/ttalkkak/pages/43286532

## Rule Type

각 규칙은 `ruleType`을 가집니다.

- `bad_good`: 원본에 나쁜 예와 개선 예가 있는 규칙입니다.
- `tradeoff`: 상황에 따라 양쪽 선택지가 모두 가능한 규칙입니다.

각 규칙 문서는 `관찰 가능한 신호`, `게시 조건`, `억제 조건`을 포함해야 합니다.

## 원본 정보

```text
Code Quality: https://frontend-fundamentals.com/code-quality/code/
Bundling: https://frontend-fundamentals.com/bundling/
A11y: https://frontend-fundamentals.com/a11y/
Debug: https://frontend-fundamentals.com/debug/
초기 생성일: 2026-07-06
4축 확장일: 2026-07-09
```
