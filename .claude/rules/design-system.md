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

`src/shared/ui/`에는 현재 `AppFrame`과 `icons/`만 있다. Button 등 공용 primitive도 Storybook도 없다. 즉 아직 검색할 기존 primitive가 거의 없으므로, 처음 만드는 컴포넌트를 `shared/ui/`에 바로 두지 말고 architecture rule의 승격 규칙(두 곳 이상)을 따른다.

## Component boundaries

- `shared/ui/`는 도메인 데이터를 받지 않는다. 도메인 의미가 있으면 라우트의 `_components/`에 둔다.
- primitive는 특정 API 응답 형태나 store에 직접 의존하지 않는다.

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
