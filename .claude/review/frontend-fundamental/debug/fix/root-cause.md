---
id: debug/fix/root-cause
title: 증상이 아니라 근본 원인 수정하기
ruleType: tradeoff
category: 디버깅
subcategory: 수정하기
source: https://frontend-fundamentals.com/debug/pages/fix/correct.html
---

# 증상이 아니라 근본 원인 수정하기

- 기준 경로: FF › 디버깅 › 수정하기 › 근본 원인 수정하기
- 원문: https://frontend-fundamentals.com/debug/pages/fix/correct.html

## 원칙
겉으로 보이는 예외나 경고만 숨기면 같은 문제가 다시 발생할 수 있어요. 실제 원인이 데이터 계약, 상태 흐름, 이벤트 순서, 라이프사이클 중 어디에 있는지 보고 그 지점을 수정해야 합니다.

## 관찰 가능한 신호
- `try/catch`, optional chaining, fallback 값만 추가하고 잘못된 데이터 흐름은 그대로 둠
- race, stale state, null 데이터 원인을 해결하지 않고 에러만 무시함
- 실패 케이스를 로깅하거나 테스트하지 않고 UI만 조용히 숨김

## 게시 조건
- PR 설명이나 diff상 특정 버그 수정인데, 수정이 증상 억제에만 머물러 있습니다.
- 근본 원인으로 보이는 데이터 계약, lifecycle, state transition을 코드에서 지적할 수 있습니다.
- 더 직접적인 수정 위치나 검증 방법을 제안할 수 있습니다.

## 억제 조건
- 실제로는 방어 코딩 자체가 요구사항입니다. 예: 외부 API 불안정성, nullable contract.
- 원인 분석에 필요한 로그, 재현 조건, 주변 코드가 없어 추측 비중이 큽니다.
- 빠른 hotfix PR이라면 line comment보다 summary_only로 낮춥니다.
