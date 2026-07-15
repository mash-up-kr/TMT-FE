---
id: debug/reproduce/automated-reproduction
title: 반복 재현을 자동화하기
ruleType: tradeoff
category: 디버깅
subcategory: 재현하기
source: https://frontend-fundamentals.com/debug/pages/reproduce/repeat.html
---

# 반복 재현을 자동화하기

- 기준 경로: FF › 디버깅 › 재현하기 › 반복적인 재현 과정을 자동화하기
- 원문: https://frontend-fundamentals.com/debug/pages/reproduce/repeat.html

## 원칙
버그는 재현 가능해야 빠르게 수정하고 회귀를 막을 수 있어요. 동일한 문제가 다시 생길 수 있는 조건이라면 단순 수동 확인보다 테스트나 작은 재현 fixture로 남기는 편이 안전합니다.

## 관찰 가능한 신호
- 버그 수정 PR인데 관련 테스트, fixture, story, reproduction case가 없음
- 경계값, 비동기 순서, 입력 조합처럼 재발 가능성이 높은 조건을 수정함
- 기존 테스트 인프라가 있는데 새 케이스가 추가되지 않음

## 게시 조건
- 수정한 버그가 같은 조건에서 반복 재현 가능한 성격입니다.
- repo에 unit/e2e/storybook/msw 등 적절한 검증 수단이 이미 있습니다.
- 어떤 케이스를 추가하면 되는지 구체적으로 제안할 수 있습니다.

## 억제 조건
- 문구/스타일/일회성 설정처럼 자동화 비용이 효과보다 큽니다.
- 테스트 인프라가 없거나 PR 범위를 크게 넘는 준비가 필요합니다.
- 이미 수동 재현 영상, QA 체크리스트, 별도 테스트 PR이 연결되어 있습니다.
