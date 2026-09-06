# Next Suspense Error Boundaries Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cookie-identified server prefetch, hydrated Suspense screens, route loading/error fallbacks, and common partial-query feedback for home, place detail, and group detail.

**Architecture:** The root query provider owns the browser client and reset boundary. Server pages prefetch the three critical queries with a request-scoped QueryClient and cookie-derived request header, then hydrate the client cache. Critical screens use Orval suspense hooks; all optional/conditional/infinite data remains a normal query inside its own fallback.

**Tech Stack:** Next.js 16 App Router, React 19, TanStack Query 5, Orval, TypeScript, Tailwind v4, Biome.

**Spec:** `docs/superpowers/specs/2026-09-05-next-suspense-error-boundaries-design.md`

## Global Constraints

- Base branch is `feat/#215-bottomnav-app-shell`; `AppChrome` remains a root-layout sibling of route children.
- Do not add dependencies or a test runner.
- Never edit `src/api/gen/**` manually; regenerate with Orval.
- Core server data uses cookie-derived `X-User-Id`; partial and mutation flows keep their current client behavior.
- Validate every task with its relevant type/build command; run `pnpm verify` at the end.

---

### Task 1: Query and mock-user foundation

**Files:**
- Modify: `orval.config.ts`, `src/api/mutator.ts`, `src/shared/providers/QueryProvider.tsx`, `.claude/rules/architecture.md`
- Create: `src/shared/providers/serverQuery.ts`, `src/shared/ui/Skeleton.tsx`, `src/shared/ui/RetryNotice.tsx`
- Modify: `src/app/profile/_components/ProfileQueryFallback.tsx`, `src/app/preview/ut2/page.tsx`

- [ ] Enable generated React Query suspense hooks and run `pnpm exec orval`.
- [ ] Move the mock user selector from localStorage to the named cookie while preserving its explicit-header override contract.
- [ ] Add request-scoped server query/client helpers with `retry: false` and a cookie-derived `X-User-Id` request header.
- [ ] Add the reset boundary around the existing browser QueryClient and create the two minimal shared feedback primitives.
- [ ] Migrate the existing profile fallback to the primitives without changing its visible states.
- [ ] Update architecture rules with server-query import and ownership constraints.
- [ ] Run `pnpm check && pnpm typecheck`.

### Task 2: App-level boundary files

**Files:**
- Create: `src/app/loading.tsx`, `src/app/error.tsx`, `src/app/global-error.tsx`

- [ ] Add the generic full-body loading fallback that leaves root `AppChrome` mounted.
- [ ] Add the client route error fallback: reset query errors before calling Next boundary reset; show home navigation only when the bottom navigation is absent.
- [ ] Add the standalone global error document with reload and home controls.
- [ ] Run `pnpm check && pnpm typecheck`.

### Task 3: Home prefetch and Suspense screen

**Files:**
- Modify: `src/app/(home)/page.tsx`, `src/app/(home)/_hooks/useHomeSummary.ts`, `src/app/(home)/_components/HomeScreen.tsx`
- Create: `src/app/(home)/loading.tsx`, `src/app/(home)/_components/HomeHeader.tsx`, `src/app/(home)/_components/HomeSkeleton.tsx`

- [ ] Prefetch the home query on the server and hydrate it into the screen.
- [ ] Replace the core home query with the generated suspense hook and remove its pending/error branches.
- [ ] Move the static home header into a shared route-private component used by both screen and loading fallback.
- [ ] Add the home skeleton and convert home feed failure to `RetryNotice` while keeping it a standard query.
- [ ] Run `pnpm check && pnpm typecheck`.

### Task 4: Place detail prefetch and Suspense screen

**Files:**
- Modify: `src/app/places/[placeId]/page.tsx`, `src/app/places/[placeId]/_hooks/usePlaceDetail.ts`, `src/app/places/[placeId]/_components/PlaceDetailScreen.tsx`
- Create: `src/app/places/[placeId]/loading.tsx`, `src/app/places/[placeId]/_components/PlaceDetailSkeleton.tsx`

- [ ] Prefetch and hydrate place detail server-side with the cookie request init.
- [ ] Switch the core place-detail hook to its generated suspense hook and remove the full-screen pending/error conditional.
- [ ] Add a static-header skeleton fallback without a favorite action; keep reviews as a standard query with `RetryNotice`.
- [ ] Run `pnpm check && pnpm typecheck`.

### Task 5: Group detail prefetch and partial query states

**Files:**
- Modify: `src/app/groups/[groupId]/page.tsx`, `src/app/groups/[groupId]/_hooks/useGroupDetailQueryState.ts`, `src/app/groups/[groupId]/_model/groupDetail.ts`, `src/app/groups/[groupId]/_components/GroupDetailScreen.tsx`, `src/app/groups/[groupId]/_components/GroupDetailView.tsx`, `src/app/groups/[groupId]/_components/GroupDetailFeedback.tsx`
- Create: `src/app/groups/[groupId]/loading.tsx`, `src/app/groups/[groupId]/_hooks/useSuspenseGroupDetail.ts`

- [ ] Prefetch and hydrate the critical group detail.
- [ ] Isolate it in a suspense hook; retain review pagination and join preview as ordinary conditional queries.
- [ ] Model review list pending/error explicitly and render a local skeleton/retry notice without replacing group identity or actions.
- [ ] Move the existing group spinner to the route loading fallback and delete obsolete full-screen group error UI.
- [ ] Run `pnpm check && pnpm typecheck`.

### Task 6: End-to-end verification

**Files:**
- Modify if needed: `docs/superpowers/specs/2026-09-05-next-suspense-error-boundaries-design.md`

- [ ] Run `pnpm verify`.
- [ ] Check the production build reports home, place detail, and group detail as dynamic routes.
- [ ] Run development scenarios for cookie user switching, core query failure/retry, partial query failure, and root navigation visibility.
- [ ] Record any spec correction required by observed behavior.
