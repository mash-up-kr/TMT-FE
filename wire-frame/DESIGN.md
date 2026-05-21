# Design

## Source of Truth

- Status: Draft
- Last refreshed: 2026-05-21
- Primary product surfaces: mobile-first wireframe MVP for grouping and saving places/stores
- Evidence reviewed:
  - `docs/wireframe-spec.md`: wireframe work prioritizes fast screen output, repeated components, simple interactions, and visible page movement.
  - `src/App.jsx`: current app is still close to the default Vite starter and does not yet implement the MVP flow.
  - `src/index.css`: app is already constrained to a phone-width container, so the first MVP should be mobile-first.
  - User requirement on 2026-05-21: split the MVP into first entry, main, create new group, store unregistered, store registration flow, saved list, and saved list detail; prioritize behavior over realistic final screens.

## Product Goal

The immediate goal is to make the current wireframe work as an initial MVP as quickly as possible.
This phase should prove that the user can move through the core journey, not that every screen looks final.

The app should let a tester:

1. Enter the product.
2. Reach the main screen.
3. Create a new group.
4. See the store-unregistered state.
5. Register a store through a minimal flow.
6. Open a saved list page.
7. Open a saved list detail page.

## Brand

- Personality: simple, direct, utilitarian
- Trust signals: predictable navigation, clear page titles, visible saved/empty states
- Avoid: landing-page polish, decorative hero sections, marketing copy, complicated visual effects, and product explanations that do not help the click path

## Product Goals

- Goals:
  - Establish the first usable MVP page flow.
  - Make every planned screen reachable through visible controls.
  - Validate basic user decisions with local state and placeholder data.
  - Keep the implementation easy to change after the wireframe is reviewed.
- Non-goals:
  - Backend integration
  - Authentication
  - Production search, ranking, filtering, or recommendations
  - Pixel-perfect final UI
  - Complete form validation
  - Persistent storage beyond temporary local state
- Success signals:
  - A reviewer can complete the whole flow by clicking through the UI.
  - The seven pages are represented clearly.
  - Save/submit actions visibly change the local screen state.
  - Repeated UI uses shared components.
  - No unnecessary dependencies or complex data model are introduced.

## Personas and Jobs

- Primary personas:
  - Early tester validating whether the MVP flow makes sense.
  - User organizing places/stores into saved groups.
- User jobs:
  - Start the app.
  - Create a group.
  - Understand when a store is not registered.
  - Register a store with minimum required information.
  - Revisit saved groups/items.
  - Inspect one saved item.
- Key contexts of use:
  - Phone-width wireframe review.
  - Fast product flow validation before visual refinement.

## Information Architecture

- Primary navigation: client-side page-state routing inside the React app.
- Route dependency: do not add React Router for the first MVP unless page-state routing becomes difficult to maintain.
- Core routes/screens:
  1. First Entry
  2. Main
  3. Create New Group
  4. Store Unregistered
  5. Store Registration Flow
  6. Saved List
  7. Saved List Detail
- Content hierarchy:
  - Page title
  - Current state summary
  - Main action
  - Secondary/back action
  - Repeated list or status content when needed

## Frontend Architecture

The MVP must be organized by page. Each page owns the components, simple functions, and local code that only exist for that page.

Target structure:

```text
src/
  App.jsx
  App.css
  main.jsx
  pages/
    first-entry/
      FirstEntryPage.jsx
      components/
      utils.js
    main/
      MainPage.jsx
      components/
      utils.js
    create-new-group/
      CreateNewGroupPage.jsx
      components/
      utils.js
    store-unregistered/
      StoreUnregisteredPage.jsx
      components/
      utils.js
    store-registration/
      StoreRegistrationPage.jsx
      components/
      utils.js
    saved-list/
      SavedListPage.jsx
      components/
      utils.js
    saved-list-detail/
      SavedListDetailPage.jsx
      components/
      utils.js
  shared/
    components/
      ScreenShell.jsx
      Header.jsx
      Button.jsx
      StatusCard.jsx
      ListItem.jsx
      Field.jsx
    mockData.js
```

Architecture rules:

- `App.jsx` owns only top-level page state, shared mock state, and page switching.
- `App.jsx` should not contain page layout markup beyond rendering the selected page.
- Each folder under `src/pages/` represents one MVP screen.
- Page-only components live in that page's `components/` folder.
- Page-only helper functions live in that page's `utils.js`.
- Shared components move to `src/shared/components/` only after at least two pages need them.
- Shared mock data lives in `src/shared/mockData.js`; page-specific temporary data can stay inside the page folder.
- Do not create global stores, service layers, API clients, or domain modules for this MVP.
- Do not split files only for theoretical cleanliness. Split when it protects page ownership or avoids visible duplication.
- Page folders should not import from another page folder. If two pages need the same UI or helper, move it to `src/shared/`.

Page ownership:

- `first-entry/`: first product entry screen and start/list navigation actions.
- `main/`: MVP hub, current group/store/list summaries, and branch navigation.
- `create-new-group/`: group form, local required-field behavior, save/cancel actions.
- `store-unregistered/`: empty state for missing store and registration entry action.
- `store-registration/`: minimal store registration form and submit/cancel behavior.
- `saved-list/`: saved list rows, empty state, and detail navigation.
- `saved-list-detail/`: selected item summary, status rows, and return/edit/register actions.

State ownership:

- Top-level state in `App.jsx`:
  - `currentPage`
  - `group`
  - `store`
  - `savedItems`
  - `selectedSavedItemId`
- Page-local state:
  - form input values
  - touched/required-field display
  - simple temporary UI state that does not need to survive navigation
- Derived display values:
  - keep inside the relevant page folder unless reused by multiple pages

Navigation contract:

- Pages receive callback props such as `onStart`, `onBack`, `onCreateGroup`, `onRegisterStore`, `onOpenSavedList`, and `onOpenSavedDetail`.
- Pages do not mutate top-level state directly.
- Pages do not know the full route map. They only call the callback for the action they expose.
- The first implementation may use string page IDs instead of a router.

## Design Principles

- Flow before fidelity: if a screen transition is important, implement it before visual polish.
- Behavior before realism: forms, lists, and saved states may use mock/local data as long as they prove the intended action.
- Reuse before variety: repeated rows, buttons, fields, and status blocks should share components.
- Simple before complete: add only the state and validation needed to make the MVP path understandable.
- Tradeoffs: choose visible, explicit navigation over hidden gestures, complex routing, or realistic business rules.

## MVP Screen Contract

### 1. First Entry

Purpose: provide the first product entry point and move the user into the MVP.

Required elements:

- Product/app name placeholder
- Short state label or one-line context
- Primary start button
- Secondary saved-list entry, if useful for testing

Primary actions:

- Start -> Main
- Saved List -> Saved List

Behavior:

- No onboarding carousel.
- No marketing-style landing page.
- This screen only needs to prove that first entry works.

### 2. Main

Purpose: act as the hub for the MVP flow.

Required elements:

- Current group summary
- Current store status
- Saved item/list summary
- Primary actions for the next major paths

Primary actions:

- Create New Group -> Create New Group
- Store Unregistered -> Store Unregistered
- Register Store -> Store Registration Flow
- Saved List -> Saved List

Behavior:

- Reflect local changes after group creation or store registration.
- Use visible status cards so the tester can understand what changed.
- Avoid dense dashboard behavior in the first MVP.

### 3. Create New Group

Purpose: allow a user to create a group and return to the main flow.

Required elements:

- Group name field
- Optional group memo/category field
- Save button
- Back/cancel button

Primary actions:

- Save -> Main
- Back/cancel -> Main

Behavior:

- Save updates local state with the group name.
- Basic required-field feedback is enough.
- Do not build advanced group settings yet.

### 4. Store Unregistered

Purpose: show the empty/unregistered store state and guide the user to registration.

Required elements:

- Empty-state title
- Short explanation that the store is not registered yet
- Register store button
- Back button

Primary actions:

- Register Store -> Store Registration Flow
- Back -> Main

Behavior:

- Treat this as a normal branch, not an error screen.
- Keep the message short and action-oriented.

### 5. Store Registration Flow

Purpose: let the user complete a minimal store registration.

Required elements:

- Step label or page title
- Store name field
- Store category or address placeholder field
- Submit/register button
- Back/cancel button

Primary actions:

- Submit -> Main
- Back/cancel -> Store Unregistered or Main

Behavior:

- Prefer one screen for the first MVP.
- Submit updates local store state.
- After submit, Main should visibly show that a store exists.
- Do not add API calls or multi-step validation yet.

### 6. Saved List

Purpose: show saved groups/items and allow navigation to detail.

Required elements:

- Page title
- Shared repeated list item component
- Empty state when no saved data exists
- Home/back button

Primary actions:

- Select list item -> Saved List Detail
- Back/home -> Main

Behavior:

- Placeholder data is acceptable.
- If a group was created locally, show it in the list when practical.
- All rows should use the same component.

### 7. Saved List Detail

Purpose: show one saved item in enough detail to verify the detail route.

Required elements:

- Item/group title
- Basic metadata rows
- Store registration status
- Back button
- Optional register/edit action

Primary actions:

- Back -> Saved List
- Register/Edit Store -> Store Registration Flow, if included

Behavior:

- Do not implement deep editing.
- This page only needs to prove that a selected saved item can open and return.

## Visual Language

- Color: neutral base with one clear primary action color.
- Typography: system font, readable mobile sizes, short headings.
- Spacing/layout rhythm: consistent vertical spacing and fixed screen padding.
- Shape/radius/elevation: restrained cards/panels only for grouping actions or status.
- Motion: none required for the first MVP.
- Imagery/iconography: optional; use icons only when they clarify an action.

## Components

- Existing components to reuse: none meaningful yet; the current UI is starter code.
- New/changed components:
  - `ScreenShell`: common phone-width screen layout.
  - `Header`: title and optional back action.
  - `PrimaryButton`: main action.
  - `SecondaryButton`: lower-priority action.
  - `StatusCard`: current state, empty state, or result summary.
  - `ListItem`: repeated saved-list row.
  - `Field`: label and input pair.
- Variants and states:
  - Button: primary, secondary, disabled.
  - Status card: default, empty, success/created.
  - List item: default, selected/openable.
- Token/component ownership:
  - Keep styles local in CSS for now.
  - Do not introduce a design-system layer before the MVP flow stabilizes.

## Accessibility

- Target standard: basic accessible HTML behavior for the MVP.
- Keyboard/focus behavior:
  - Use real `button` elements for click actions.
  - Preserve visible focus states.
  - Inputs must be reachable by keyboard.
- Contrast/readability:
  - Text must be readable on the mobile-width screen.
  - Disabled states should remain legible.
- Screen-reader semantics:
  - Inputs need visible labels.
  - Page titles should be semantic headings.
  - Clickable list rows should be buttons or contain buttons.
- Reduced motion and sensory considerations:
  - Avoid motion in the first MVP unless it directly clarifies a state transition.

## Responsive Behavior

- Supported breakpoints/devices: mobile-first phone-width container.
- Layout adaptations:
  - Desktop can center the same mobile app frame.
  - Do not create a separate desktop layout for this MVP.
- Touch/hover differences:
  - Prioritize touch-size buttons and readable labels.
  - Hover states are optional; focus states are required.

## Interaction States

- Loading: not required unless a fake transition is intentionally added.
- Empty: required for Store Unregistered and empty Saved List.
- Error: basic required-field feedback only.
- Success: created group and registered store should be reflected on Main.
- Disabled: use for submit buttons when required input is empty.
- Offline/slow network: not applicable because this phase has no backend.

## Content Voice

- Tone: short, direct, operational.
- Terminology:
  - Use "group" consistently for the collection concept.
  - Use "store" consistently for the registered place/business concept.
  - Use "saved list" for the list page.
- Microcopy rules:
  - Prefer action labels: "Start", "Create group", "Register store", "View saved list", "Back".
  - Avoid explaining features inside the UI unless the text is needed to complete the flow.

## Implementation Constraints

- Framework/styling system: React + Vite with plain CSS.
- File architecture:
  - Organize implementation by page under `src/pages/`.
  - Keep each page's private components and simple helpers inside that page folder.
  - Put only genuinely shared UI in `src/shared/components/`.
- State:
  - Use local React state for current page, created group, registered store, and selected saved item.
  - No external state-management library for the first MVP.
- Routing:
  - Use page-state routing first.
  - Add a routing library only after the flow needs URL-level routes.
- Data:
  - Inline mock data is acceptable.
  - Local state changes should be enough to prove behavior.
- Validation:
  - Only validate required fields needed to make save/submit behavior clear.
- Performance:
  - Keep the app lightweight.
  - Avoid new dependencies unless they remove real complexity.
- Compatibility:
  - Support current local Vite development in modern browsers.
- Test/screenshot expectations:
  - After implementation, run lint/build.
  - Use a browser smoke check if the visual flow changes significantly.

## MVP Acceptance Criteria

- First Entry, Main, Create New Group, Store Unregistered, Store Registration Flow, Saved List, and Saved List Detail all exist as reachable screens.
- First Entry can navigate to Main.
- Main can navigate to every major branch.
- Create New Group can save a group name and return to Main.
- Store Unregistered can navigate to Store Registration Flow.
- Store Registration Flow can submit a minimal store and return to Main.
- Saved List can open a Saved List Detail page.
- Saved List Detail can return to Saved List.
- Repeated saved rows use one shared component.
- The implementation avoids backend calls, unnecessary libraries, and complex business logic.

## Open Questions

- [ ] What exact product/app name should appear on First Entry?
- [ ] Are saved list items primarily groups, stores, or a mixed list?
- [ ] After store registration, should the user always return to Main, or sometimes land on Saved List Detail?
- [ ] Should local state reset on refresh, or should a later MVP use browser storage?
