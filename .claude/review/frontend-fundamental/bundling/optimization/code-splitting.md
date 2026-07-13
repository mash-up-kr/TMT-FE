---
id: bundling/optimization/code-splitting
title: 필요한 시점에 코드 불러오기
ruleType: tradeoff
category: 번들링
subcategory: 번들 최적화
source: https://frontend-fundamentals.com/bundling/deep-dive/optimization/code-splitting.html
---

# 필요한 시점에 코드 불러오기

- 기준 경로: FF › 번들링 › 번들 최적화 › 코드 스플리팅
- 원문: https://frontend-fundamentals.com/bundling/deep-dive/optimization/code-splitting.html

## 원칙
초기 화면에 필요하지 않은 큰 기능, 페이지, 라이브러리를 처음부터 함께 로드하면 초기 로딩 비용이 커질 수 있어요. 사용자가 실제로 접근하는 시점에 불러와도 되는 코드는 동적 import, 라우트 단위 lazy loading 같은 방식으로 나눌 수 있습니다.

## 관찰 가능한 신호
- 관리자/리포트/차트/에디터처럼 일부 사용자나 일부 화면에서만 쓰는 큰 모듈을 앱 진입점에서 정적 import함
- route, modal, wizard, tab처럼 늦게 열리는 UI의 구현 전체가 초기 번들에 포함됨
- 새 dependency가 크거나 브라우저 전용인데, 최초 렌더 경로와 직접 관계가 낮음

## 게시 조건
- 추가/수정된 import가 초기 렌더 경로에 있고, 해당 기능은 사용자 행동이나 특정 route 이후에만 필요합니다.
- 동적 import나 framework의 lazy loading 기능으로 분리해도 사용자 흐름이 자연스럽습니다.
- package.json 또는 변경 코드상 이미 lazy loading을 지원하는 프레임워크/번들러를 사용합니다.

## 억제 조건
- 공통 레이아웃, 인증, 라우팅, 핵심 상태처럼 초기 실행에 반드시 필요한 코드입니다.
- 모듈이 작거나, 분리 비용이 더 크거나, SSR/edge/runtime 제약 때문에 lazy loading이 부적절합니다.
- 번들 크기 근거 없이 단순히 "나눌 수 있다" 수준이면 line comment 대신 summary_only로 낮춥니다.
