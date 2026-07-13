---
id: a11y/predictability/fake-button
title: 역할과 동작이 일치하는 요소 사용하기
ruleType: bad_good
category: 접근성
subcategory: 예측 가능성
source: https://frontend-fundamentals.com/a11y/predictability/fake-button.html
---

# 역할과 동작이 일치하는 요소 사용하기

- 기준 경로: FF › 접근성 › 예측 가능성 › 버튼의 역할과 동작이 일치하게 만들기
- 원문: https://frontend-fundamentals.com/a11y/predictability/fake-button.html

## 원칙
사용자가 보는 역할과 실제 DOM 역할, 키보드 동작은 일치해야 합니다. 클릭 가능한 div/span을 버튼처럼 쓰거나 이동 동작을 button으로 처리하면 키보드와 보조 기술 사용자에게 예측하기 어려운 UI가 됩니다.

## 관찰 가능한 신호
- `<div>` 또는 `<span>`에 onClick만 붙여 버튼처럼 사용함
- 링크 이동을 `<button>` onClick + router push로만 처리함
- `role="button"`을 쓰지만 keyboard handler, tabIndex, disabled 처리 등이 빠짐

## 게시 조건
- 추가/수정된 코드에서 시각적/행동상 버튼 또는 링크인데 semantic element가 맞지 않습니다.
- `<button>`, `<a>`, framework Link 등 더 적절한 요소로 바꿀 수 있습니다.
- 키보드 접근, 기본 동작, 보조 기술 전달 측면의 개선이 구체적입니다.

## 억제 조건
- 디자인 시스템 컴포넌트가 내부적으로 적절한 semantic element를 렌더합니다.
- pointer-only 장식 요소이며 실제 상호작용이 아닙니다.
- 복잡한 composite widget이라 ARIA pattern 전체 맥락 없이는 한 줄로 판단하기 어렵습니다.
