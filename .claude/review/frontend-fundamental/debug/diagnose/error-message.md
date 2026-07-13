---
id: debug/diagnose/error-message
title: 에러 메시지로 원인 좁히기
ruleType: tradeoff
category: 디버깅
subcategory: 진단하기
source: https://frontend-fundamentals.com/debug/pages/diagnose/error-message.html
---

# 에러 메시지로 원인 좁히기

- 기준 경로: FF › 디버깅 › 진단하기 › 에러 메시지로 원인 좁히기
- 원문: https://frontend-fundamentals.com/debug/pages/diagnose/error-message.html

## 원칙
에러 메시지는 문제 범위를 좁히는 첫 단서입니다. 메시지의 종류와 발생 맥락을 보고 문법, 타입, 참조, 네트워크, 모듈 시스템 중 어디를 먼저 확인해야 하는지 코드에서 드러나야 합니다.

## 관찰 가능한 신호
- `TypeError`, `SyntaxError`, `ReferenceError`, `Failed to fetch` 등 명확한 에러 신호가 있는데 PR 수정이 메시지의 원인을 확인하지 않습니다.
- `fetch`나 JSON 파싱 실패에서 HTTP 응답 실패와 네트워크 실패를 같은 흐름으로 처리합니다.
- nullable 값, API 응답 shape, `await` 누락, 모듈 import 설정처럼 에러 메시지가 가리키는 확인 지점이 코드에서 검증되지 않습니다.

## 게시 조건
- diff에서 에러 메시지와 직접 연결되는 실패 가능성을 코드 위치로 짚을 수 있습니다.
- 메시지 종류에 따라 먼저 확인할 조건이 명확합니다. 예: `res.ok`, `Array.isArray`, nullable guard, `await`, 모듈 타입 설정.
- 제안이 추측성 로그 추가가 아니라 원인 범위를 좁히는 검증 코드나 테스트로 이어집니다.

## 억제 조건
- PR에 실제 에러 메시지나 실패 증상이 없고 가능성만 넓게 상상해야 합니다.
- 이미 상위 유틸, query client, error boundary, schema parser에서 같은 검증을 보장합니다.
- 컴파일러, 린터, 타입 시스템이 같은 문제를 이미 확실히 막고 있습니다.
