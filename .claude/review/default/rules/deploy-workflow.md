# 배포 워크플로 안전성

## 목적

GitHub Actions, S3, CloudFront, 정적 배포 스크립트처럼 배포 경로를 바꾸는 PR에서 캐시, 무효화, secret, 트리거 조건 때문에 실제 배포가 깨지는 문제를 잡습니다.

## 관찰 가능한 신호

- workflow trigger의 `paths`가 실제 변경 앱이나 의존 패키지를 빠뜨립니다.
- build output 경로와 S3 upload 경로가 서로 맞지 않습니다.
- `cache-control` 정책과 파일명 해시 전략이 맞지 않습니다.
- entry 파일은 짧게 캐시하지만, 같은 이름으로 바뀌는 asset은 오래 캐시합니다.
- CloudFront invalidation 경로가 실제 업로드 경로나 entry 파일과 맞지 않습니다.
- secret 이름, AWS region, bucket, distribution id가 다른 workflow와 다르게 쓰입니다.
- `--delete`, `--size-only`, metadata 변경처럼 배포 결과에 영향을 주는 옵션을 근거 없이 바꿉니다.

## 게시 조건

- 변경된 workflow 라인에서 실제 배포 실패, stale asset, 잘못된 캐시, 누락된 배포 트리거로 이어질 경로가 보입니다.
- 같은 PR 안이나 주변 workflow에서 기대 경로, bucket, invalidation path를 비교할 수 있습니다.
- 수정 방향이 구체적입니다.
- 운영 영향이 단순 스타일이나 주석 차이를 넘어섭니다.

## 억제 조건

- 변경이 주석만 바꾸며 실행 경로에는 영향이 없습니다.
- workflow가 수동 실행 전용이고, 의도적으로 특정 앱만 다룹니다.
- 다른 단계에서 같은 경로를 이미 업로드하거나 무효화합니다.
- 배포 환경의 외부 설정을 추측해야만 문제를 제기할 수 있습니다.

## 나쁜 예

```yaml
on:
  push:
    paths:
      - "apps/web/**"

jobs:
  deploy:
    steps:
      - run: yarn workspace @team/web build
      - run: aws s3 sync apps/web/dist/ s3://static/app/dist/
      - run: aws cloudfront create-invalidation --paths "/web/dist/*"
```

## 좋은 예

```yaml
on:
  push:
    paths:
      - "apps/web/**"
      - "packages/ui/**"
      - "packages/api/**"
      - "yarn.lock"

jobs:
  deploy:
    steps:
      - run: yarn workspace @team/web build
      - run: aws s3 sync apps/web/dist/ s3://static/web/dist/
      - run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/web/dist/*"
```

## Verification rule

- trigger paths가 앱과 workspace 의존 패키지를 충분히 포함하는지 확인합니다.
- build output 경로, upload 경로, CDN/invalidation 경로가 같은 앱 prefix를 가리키는지 확인합니다.
- 파일명 해시가 없는 entry/asset에는 긴 immutable cache를 쓰지 않는지 확인합니다.
- metadata 변경이 필요한데 `--size-only` 같은 옵션으로 업로드가 스킵되지 않는지 확인합니다.
- secret, bucket, distribution id 이름이 기존 workflow 패턴과 일치하는지 확인합니다.

## PN 기준

공통 리뷰 정책은 [Review Policy](../../Policy.md)를 따릅니다. 아래 내용은 이 rule의 적용 예시입니다.

- `P1`: 배포가 항상 실패하거나 운영 앱이 잘못된 파일을 서빙합니다.
- `P2`: 흔한 배포에서 stale JS/CSS, 누락 asset, 잘못된 CDN 경로가 실제 사용자에게 노출됩니다.
- `P3`: 특정 앱이나 의존 패키지 변경이 배포 트리거에서 누락될 가능성은 높지만 영향 범위나 재현 조건이 일부 추론에 머뭅니다.
- `P4`: 운영 혼선을 줄이는 워크플로 명확화나 캐시 정책 보강입니다.
- `P5`: 주석, 네이밍, 문서성 질문처럼 낮은 강도의 의견입니다.
