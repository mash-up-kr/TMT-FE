---
id: a11y/alt-text/image-alt
title: 이미지와 아이콘에 대체 텍스트 제공하기
ruleType: bad_good
category: 접근성
subcategory: 시각 정보 보완
source: https://frontend-fundamentals.com/a11y/alt-text/image-alt.html
---

# 이미지와 아이콘에 대체 텍스트 제공하기

- 기준 경로: FF › 접근성 › 시각 정보 보완 › 이미지와 아이콘에 대체 텍스트 제공하기
- 원문: https://frontend-fundamentals.com/a11y/alt-text/image-alt.html

## 원칙
이미지나 아이콘이 정보를 전달한다면 대체 텍스트가 필요하고, 장식용이라면 빈 대체 텍스트로 보조 기술이 불필요한 정보를 읽지 않게 해야 합니다. 텍스트와 함께 있는 아이콘은 중복 설명을 피하는 편이 좋습니다.

## 관찰 가능한 신호
- `<img>` 또는 image component가 alt 없이 추가됨
- 아이콘만 있는 버튼에서 아이콘 alt도 비어 있고 버튼 label도 없음
- 텍스트 옆 장식 아이콘에 "아이콘", "이미지" 같은 중복 alt를 넣음

## 게시 조건
- 이미지가 의미나 기능을 전달하지만 accessible text가 없습니다.
- 장식 이미지인데 보조 기술이 불필요한 설명을 읽게 됩니다.
- 주변 텍스트와의 관계를 보고 적절한 alt 또는 빈 alt를 제안할 수 있습니다.

## 억제 조건
- framework image component가 alt를 필수로 요구하고 실제 prop이 다른 곳에서 주입됩니다.
- CSS background image나 purely decorative asset이라 DOM 접근성 판단이 어렵습니다.
- 이미지 의미를 PR diff만으로 알 수 없어 구체적인 alt를 제안할 수 없습니다.
