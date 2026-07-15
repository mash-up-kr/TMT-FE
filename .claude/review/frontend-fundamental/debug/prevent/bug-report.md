---
id: debug/prevent/bug-report
title: 재발 방지 기록 남기기
ruleType: tradeoff
category: 디버깅
subcategory: 재발 방지하기
source: https://frontend-fundamentals.com/debug/pages/prevent/bug-report.html
---

# 재발 방지 기록 남기기

- 기준 경로: FF › 디버깅 › 재발 방지하기 › 버그 리포트 남기기
- 원문: https://frontend-fundamentals.com/debug/pages/prevent/bug-report.html

## 원칙
해결한 버그의 상황, 원인, 해결 방법, 재발 방지 조치를 기록하면 팀의 기술 자산이 됩니다. PR 설명이나 연결 문서에 원인과 검증 방법이 남아 있으면 같은 실수를 줄일 수 있어요.

## 관찰 가능한 신호
- 장애/중요 버그 수정 PR인데 원인, 재현 조건, 검증 방법이 PR 설명에 없음
- 코드에는 workaround가 들어갔지만 왜 필요한지 기록이 없음
- 같은 문제가 재발하지 않게 할 테스트, lint, 공통 유틸 반영 여부가 불명확함

## 게시 조건
- PR이 버그/장애/회귀 수정 성격이고 재발 가능성이 있습니다.
- 코드 한 줄보다 PR 설명, 테스트, 문서 링크에 남기는 것이 더 적절합니다.
- 원인/재현/수정/검증 중 빠진 항목을 구체적으로 짚을 수 있습니다.

## 억제 조건
- 작은 UI 버그나 문구 수정처럼 리포트 비용이 과합니다.
- 이슈, Jira, Confluence, 테스트 케이스에 이미 원인과 검증이 정리되어 있습니다.
- line comment 위치가 애매하면 PR summary의 참고 항목으로만 남깁니다.
