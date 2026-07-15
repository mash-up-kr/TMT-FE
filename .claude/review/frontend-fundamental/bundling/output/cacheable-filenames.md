---
id: bundling/output/cacheable-filenames
title: 캐시 가능한 출력 파일명 사용하기
ruleType: bad_good
category: 번들링
subcategory: 출력
source: https://frontend-fundamentals.com/bundling/deep-dive/bundling-process/output.html
---

# 캐시 가능한 출력 파일명 사용하기

- 기준 경로: FF › 번들링 › 출력 › 캐시 가능한 파일명
- 원문: https://frontend-fundamentals.com/bundling/deep-dive/bundling-process/output.html

## 원칙
프로덕션 번들의 파일명이 고정되어 있으면 내용이 바뀌어도 브라우저나 CDN이 오래된 파일을 계속 사용할 수 있어요. 내용 기반 hash를 포함한 파일명과 정리된 출력 디렉토리는 배포 안정성과 캐시 효율에 중요합니다.

## 관찰 가능한 신호
- production output filename이 `bundle.js`, `main.js`, `app.css`처럼 고정되어 있음
- chunk filename이나 asset filename에 content hash가 없음
- 빌드 출력 디렉토리를 정리하지 않아 오래된 asset이 계속 남을 수 있음

## 게시 조건
- 변경된 bundler 설정이 프로덕션 빌드 출력에 영향을 줍니다.
- 고정 파일명 때문에 브라우저/CDN 캐시가 새 배포를 놓칠 가능성이 있습니다.
- content hash, clean output, manifest 등으로 수정 방향을 명확히 제안할 수 있습니다.

## 억제 조건
- dev server 전용 설정입니다.
- framework가 내부적으로 hash 파일명과 asset manifest를 이미 처리합니다.
- 서버 캐시 정책이나 배포 파이프라인 맥락 없이는 판단이 불충분합니다.
