# Review Criteria

이 폴더는 `mashong-ai`가 PR 리뷰에서 사용할 판단 기준을 관리합니다.

## 문서 구성

- `README.md`: 전체 구조와 문서 위치만 설명합니다.
- `Policy.md`: 리뷰 운영 정책의 공통 원본입니다. PN 기준, 출력 표현, 문서 관리, rule 추가 절차, 운영 로그 사용 방식을 관리합니다.
- `default/`: 일반 코드 리뷰 기준입니다. 런타임 안전성, API 계약, 에러 처리, 빈 상태, React 상태/effect, 보안 기초, 배포 워크플로처럼 실제 결함과 운영 리스크를 다룹니다.
- `frontend-fundamental/`: Frontend Fundamentals 기반 기준입니다. code-quality, bundling, a11y, debug 축의 구조/품질 리뷰를 다룹니다.

## 운영 기준

정책성 판단은 `Policy.md`를 먼저 봅니다.

- PN 기준을 바꿀 때도 `Policy.md`를 먼저 수정합니다.
- 리뷰 출력 표현과 문서 관리 방식도 `Policy.md`를 따릅니다.
- 각 rule 문서의 `PN 기준`은 `Policy.md`의 적용 예시입니다.
