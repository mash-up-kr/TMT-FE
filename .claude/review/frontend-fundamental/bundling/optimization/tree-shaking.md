---
id: bundling/optimization/tree-shaking
title: 제거 가능한 코드 구조 유지하기
ruleType: tradeoff
category: 번들링
subcategory: 번들 최적화
source: https://frontend-fundamentals.com/bundling/deep-dive/optimization/tree-shaking.html
---

# 제거 가능한 코드 구조 유지하기

- 기준 경로: FF › 번들링 › 번들 최적화 › 트리 셰이킹
- 원문: https://frontend-fundamentals.com/bundling/deep-dive/optimization/tree-shaking.html

## 원칙
트리 셰이킹은 빌드 타임에 사용하지 않는 코드를 제거하는 최적화예요. 번들러가 의존성을 정적으로 분석할 수 있도록 ESM import/export를 유지하고, 부수 효과가 큰 모듈을 진입점에서 무심코 실행하지 않는 것이 중요합니다.

## 관찰 가능한 신호
- 필요한 함수 하나 때문에 라이브러리 전체 또는 namespace import를 추가함
- `require`, 동적 경로 import, barrel 파일을 통해 실제 사용 범위가 불분명해짐
- import만 해도 전역 상태, polyfill, 스타일, analytics 같은 부수 효과가 실행되는 모듈을 추가함

## 게시 조건
- 추가된 import 방식 때문에 실제 사용하지 않는 코드가 번들에 남을 가능성이 높습니다.
- 더 좁은 named import, ESM entry, 직접 경로 import 등으로 의존 범위를 줄일 수 있습니다.
- package.json의 module type, bundler, dependency 형태를 봤을 때 정적 분석 이점이 있습니다.

## 억제 조건
- 해당 라이브러리가 이미 tree-shaking 친화적인 entry를 제공하고 현재 import도 그 방식을 따릅니다.
- CommonJS만 제공되는 라이브러리라 코드 한 줄 수정으로 개선하기 어렵습니다.
- 부수 효과가 필요한 import입니다. 예: 전역 CSS, polyfill, runtime initialization.
