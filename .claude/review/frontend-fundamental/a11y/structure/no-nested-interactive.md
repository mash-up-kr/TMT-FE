---
id: a11y/structure/no-nested-interactive
title: 인터랙티브 요소 안에 인터랙티브 요소 넣지 않기
ruleType: bad_good
category: 접근성
subcategory: 구조
source: https://frontend-fundamentals.com/a11y/structure/button-inside-button.html
---

# 인터랙티브 요소 안에 인터랙티브 요소 넣지 않기

- 기준 경로: FF › 접근성 › 구조 › 버튼 안에 버튼 넣지 않기
- 원문: https://frontend-fundamentals.com/a11y/structure/button-inside-button.html

## 원칙
버튼, 링크 같은 상호작용 요소 안에 또 다른 상호작용 요소가 들어가면 키보드 탐색, 스크린 리더 읽기, 이벤트 처리 순서가 혼란스러워질 수 있어요. 하나의 상호작용 표면은 하나의 역할만 갖도록 구조를 나누는 편이 안전합니다.

## 관찰 가능한 신호
- `<button>` 안에 `<button>`, `<a>`, input, custom interactive component가 들어감
- `<a>` 안에 버튼 컴포넌트를 넣거나 카드 전체 click 영역 안에 별도 버튼을 넣음
- 부모와 자식 모두 onClick/onKeyDown/role button/link를 가짐

## 게시 조건
- 추가/수정된 JSX에서 중첩된 interactive content가 직접 보입니다.
- 중첩을 풀어도 동일한 UI 의도를 유지할 수 있습니다. 예: Button as link, 분리된 sibling action.
- 키보드 포커스나 스크린 리더 역할이 애매해지는 문제가 설명 가능합니다.

## 억제 조건
- 내부 컴포넌트가 실제로는 interactive DOM을 렌더하지 않는 것이 명확합니다.
- 외부 컨테이너는 layout만 담당하고 클릭/role/tabIndex가 없습니다.
- 디자인 시스템의 asChild/as 패턴으로 단일 interactive DOM만 렌더링합니다.
