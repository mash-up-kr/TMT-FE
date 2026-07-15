---
id: bundling/optimization/bundle-analysis
title: 번들 영향 확인하기
ruleType: tradeoff
category: 번들링
subcategory: 번들 최적화
source: https://frontend-fundamentals.com/bundling/deep-dive/optimization/bundle-analyzer.html
---

# 번들 영향 확인하기

- 기준 경로: FF › 번들링 › 번들 최적화 › 번들 분석
- 원문: https://frontend-fundamentals.com/bundling/deep-dive/optimization/bundle-analyzer.html

## 원칙
큰 의존성이나 번들 설정 변경은 추측만으로 판단하기 어렵습니다. 번들 분석 결과를 통해 어떤 모듈이 용량을 차지하는지 확인하고 개선 방향을 정하는 편이 안전합니다.

## 관찰 가능한 신호
- 새 UI/차트/에디터/날짜/지도 라이브러리를 추가함
- 번들러 설정, alias, chunk, output, sideEffects 설정을 바꿈
- 성능 목적의 변경인데 측정 결과나 분석 근거가 PR 설명에 없음

## 게시 조건
- PR diff만으로 번들 영향이 클 가능성이 보이고, 확인 명령이나 분석 결과가 함께 없습니다.
- repo에 bundle analyzer, stats, build size check 같은 도구가 이미 있거나 쉽게 실행할 수 있습니다.
- line comment가 특정 dependency/import/config 라인에 직접 연결됩니다.

## 억제 조건
- lockfile만 바뀌었거나 dependency 영향이 작고 명확합니다.
- 이미 PR 설명, CI, Lighthouse, bundle report 등으로 영향이 확인되어 있습니다.
- 구체적인 측정 방법 없이 막연히 "번들을 확인하세요"만 말할 수 있으면 summary_only로 낮춥니다.
