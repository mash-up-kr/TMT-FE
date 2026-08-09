---
paths:
  - "src/**/*.tsx"
  - "src/**/*.css"
---

# Design System Rules

## Sources of truth

- Primitive 토큰 (Figma 원시값): `src/shared/styles/primitives.css`
- Semantic 토큰 (Tailwind `@theme`): `src/shared/styles/theme.css`
- 글로벌 CSS 진입점: `src/app/globals.css` — root layout에서만 import한다.
- UI primitive: `src/shared/ui/`

정확한 color, spacing, typography, radius, shadow 값은 위 파일이 정본이다. 이 문서에 값을 복제하지 않는다.

## Tokens

- 임의의 color, spacing, radius, shadow 값을 직접 쓰지 않는다. 기존 semantic 토큰으로 표현 가능한지 먼저 확인한다.
- 색은 semantic 토큰을 쓴다 (`bg-surface-primary`, `text-content-secondary`). primitive를 컴포넌트에서 직접 참조하지 않는다.
- 새 토큰은 제품 전체에서 재사용 가능한 의미가 있을 때만 추가한다. 이름은 값이 아니라 역할을 표현한다.

## `ds-` 프리픽스

디자인 스케일은 Tailwind 기본 scale을 덮지 않고 `ds-` 프리픽스로 공존한다. Figma unit = px 값이다.

- 디자인 시안의 간격·라디우스는 `ds-` 토큰만 쓴다 — `p-ds-16`, `gap-ds-8`, `rounded-ds-md`.
- Tailwind 기본 scale(`p-4`, `rounded-md`)은 디자인 값이 아닌 내부 정렬에만 쓴다.
- `ds-` 스케일에 없는 값이 필요하면 임의로 추가하지 말고 보고한다.

## Component decision order

1. 기존 primitive를 그대로 쓴다.
2. 기존 primitive를 조합한다.
3. 반복되는 요구면 기존 primitive에 variant 추가를 검토한다.
4. 기존 시스템으로 표현할 수 없을 때만 새 primitive를 만든다.

기존 primitive 목록은 이 문서가 아니라 `src/shared/ui/`를 직접 확인한다. 컴포넌트의 배치와 shared 승격은 architecture rule을 따르고, primitive는 특정 API 응답 형태나 store에 직접 의존하지 않는다.

## 구현 패턴

공용 컴포넌트는 shadcn 스타일 패턴을 표준으로 한다 — `className` 병합 허용, props forwarding. shadcn을 라이브러리로 설치하지 않고 패턴만 차용한다.

headless primitive가 필요하면 `@base-ui/react`를 쓴다. 합성은 `asChild`가 아니라 Base UI의 `render` prop으로 한다.

Tailwind 유틸리티는 축약형이 있으면 축약형을 쓴다. 임의값 문법(`[]`, `()`)은 축약형이 없을 때만 쓴다.

- 값 없는 data 속성: `data-[swiping]:` 아니라 `data-swiping:`. 값이 있으면 대괄호를 쓴다 — `data-[layout=fill]:`
- 테마 변수: `z-(--z-index-overlay)` 아니라 `z-overlay`. `@theme`에 선언한 변수는 namespace에 맞는 유틸리티가 자동 생성된다

IDE와 Biome이 이 축약을 제안하지만 편집 중에만 보이므로, 코드를 쓰는 시점에 먼저 확인한다.

## Interaction states

상호작용 UI에서는 그 흐름에 실제로 존재하는 상태를 누락하지 않는다: loading, error, empty, disabled, focus, hover, active, selected.

모든 상태를 기계적으로 추가하지 않는다. 모바일 전용이므로 hover에만 의존하는 동작을 만들지 않는다.

## Accessibility

- 상호작용 요소는 키보드로 쓸 수 있어야 한다. 의미 있는 HTML 요소를 우선한다.
- 아이콘 단독 버튼에는 접근 가능한 이름을 준다.
- focus indicator를 제거하지 않는다.
- 색만으로 상태를 전달하지 않는다.
- form control과 label의 관계를 유지한다.

## Layout

- 모바일 전용이다. 데스크탑 반응형은 구현하지 않는다.
- 앱 프레임은 `app-frame` 유틸리티(`--layout-frame-max`, 430px)를 쓴다. 넓은 화면에서는 중앙 정렬한다.
- 좌우 여백과 그리드는 `content-container` / `grid-container` 유틸리티를 쓴다. 임의 breakpoint를 추가하기 전에 기존 기준을 확인한다.
- 긴 텍스트, 오류 메시지, 빈 상태에서도 레이아웃을 확인한다.
