---
id: a11y/semantic/required-label
title: 인터랙티브 요소에 이름 붙이기
ruleType: bad_good
category: 접근성
subcategory: 의미
source: https://frontend-fundamentals.com/a11y/semantic/required-label.html
---

# 인터랙티브 요소에 이름 붙이기

- 기준 경로: FF › 접근성 › 의미 › 인터랙티브 요소에 이름 붙이기
- 원문: https://frontend-fundamentals.com/a11y/semantic/required-label.html

## 원칙
입력 필드, 버튼, 선택 상자 같은 인터랙티브 요소에는 사용자가 목적을 이해할 수 있는 접근 가능한 이름이 필요합니다. 시각적 placeholder만 있거나 아이콘만 있는 버튼은 보조 기술 사용자에게 목적이 전달되지 않을 수 있어요.

## 관찰 가능한 신호
- `<input>`, `<select>`, `<textarea>`가 label, aria-label, aria-labelledby 없이 추가됨
- 아이콘 버튼에 텍스트, aria-label, title, 숨김 label이 없음
- placeholder만으로 입력 목적을 전달함

## 게시 조건
- 추가/수정된 interactive element의 accessible name이 코드상 확인되지 않습니다.
- label, aria-label, aria-labelledby, 버튼 텍스트 등으로 목적을 명확히 할 수 있습니다.
- 시각적 텍스트가 있더라도 DOM에서 연결되지 않아 보조 기술이 읽기 어렵습니다.

## 억제 조건
- 디자인 시스템 컴포넌트가 필수 label prop을 내부에서 accessible name으로 연결합니다.
- 주변 코드에 `aria-labelledby` 대상이 명확히 있습니다.
- 장식용 아이콘처럼 interactive element가 아니거나, 부모 버튼의 텍스트로 이름이 이미 충분합니다.
