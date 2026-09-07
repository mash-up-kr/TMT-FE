import { ROUTES } from "./routes";

/**
 * 리뷰 작성을 시작하게 만든 그룹.
 *
 * 티켓이 모자라 그룹 가입 대신 리뷰 작성으로 넘어온 경우에만 생긴다. 완료 화면이 이 값을 보고
 * 원래 가입하려던 그룹으로 이어준다.
 *
 * 값은 초안 하나에 묶인다. 진입 때는 그룹만 알고(`saveId: null`), 초안이 생기는 순간 그 id를
 * 붙인다. 완료 화면은 지금 초안과 id가 같을 때만 그룹 화면을 띄우므로, 마이페이지에서 다른
 * 초안을 이어 써도 이 그룹이 따라붙지 않는다. 같은 초안이면 나중에 이어 써도 그룹 화면이다.
 *
 * sessionStorage를 쓰는 이유: 첫 저장에서 흐름이 `/reviews/drafts/new`에서 `/reviews/drafts/{id}`
 * 로 옮겨가며 layout까지 새로 마운트되어 React 안의 상태로는 살아남지 못한다.
 */
const JOIN_GROUP_PARAM = "joinGroup";
const STORAGE_KEY = "review:joinGroup";

type JoinGroupIntent = Readonly<{ groupId: string; saveId: string | null }>;

/** 그룹 상세에서 새 리뷰 작성으로 보낼 때 쓴다. */
export function newReviewForGroupJoinPath(groupId: string) {
  return `${ROUTES.REVIEWS.NEW}?${JOIN_GROUP_PARAM}=${encodeURIComponent(groupId)}`;
}

/** 그룹 상세에서 쓰다 만 리뷰를 고르는 화면으로 보낼 때 쓴다. */
export function continueDraftForGroupJoinPath(groupId: string) {
  return `${ROUTES.REVIEWS.DRAFTS}?${JOIN_GROUP_PARAM}=${encodeURIComponent(groupId)}`;
}

function read(): JoinGroupIntent | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "groupId" in parsed &&
      typeof parsed.groupId === "string" &&
      "saveId" in parsed &&
      (parsed.saveId === null || typeof parsed.saveId === "string")
    ) {
      return { groupId: parsed.groupId, saveId: parsed.saveId };
    }
    return null;
  } catch {
    return null;
  }
}

function write(intent: JoinGroupIntent | null): void {
  try {
    if (intent === null) window.sessionStorage.removeItem(STORAGE_KEY);
    else window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(intent));
  } catch {
    // 시크릿 모드나 저장소 차단 환경. 그룹으로 이어주지 못할 뿐 리뷰 작성은 그대로 된다.
  }
}

/**
 * 그룹에서 들어올 수 있는 입구(새로 쓰기, 이어쓰기 선택)에 들어올 때 한 번 부른다.
 *
 * query에 그룹이 있으면 새 의도로 덮는다. 없으면 **아직 초안에 묶이지 않은** 의도만 지운다.
 * 그룹에서 들어왔다가 초안을 만들기 전에 떠난 흔적은 다음 입구에서 정리되어야 하지만, 이미
 * 초안에 묶인 의도는 그 초안에만 붙어 있어 다른 리뷰로 샐 수 없다(`readJoinGroupForSave`가
 * id로 거른다). 함께 지우면 초안이 여럿이라 선택 화면을 거친 사람만 그룹으로 못 돌아간다.
 */
export function syncJoinGroupIntent(search: string): void {
  const groupId = new URLSearchParams(search).get(JOIN_GROUP_PARAM)?.trim();

  if (groupId) {
    write({ groupId, saveId: null });
    return;
  }

  if (read()?.saveId === null) {
    write(null);
  }
}

/** 초안이 확정되는 순간 부른다. 아직 초안에 묶이지 않은 의도만 묶는다. */
export function bindJoinGroupToSave(saveId: string): void {
  const intent = read();
  if (intent !== null && intent.saveId === null) {
    write({ groupId: intent.groupId, saveId });
  }
}

/** 완료 화면에서 부른다. 이 초안에 묶인 그룹만 돌려준다. */
export function readJoinGroupForSave(saveId: string): string | null {
  const intent = read();
  return intent !== null && intent.saveId === saveId ? intent.groupId : null;
}

/** 그룹으로 이어주는 일이 끝났을 때 부른다. */
export function clearJoinGroupIntent(): void {
  write(null);
}

/**
 * 이어쓰기 선택 화면을 접고 돌아갈 곳.
 *
 * 취소는 하던 일을 접고 온 곳으로 돌아가는 것이다. 그룹에서 와서 아직 초안을 고르지 않았으면
 * (`saveId: null`) 그 그룹으로 돌려보내고 의도를 지운다. 지우지 않으면 나중에 마이페이지에서
 * 고른 초안에 이 그룹이 따라붙는다. 그 외에는 마이페이지에서 온 것이므로 마이페이지로 보내고,
 * 이미 초안에 묶인 의도는 건드리지 않는다.
 */
export function resolveContinueDraftExitPath(): string {
  const intent = read();
  if (intent !== null && intent.saveId === null) {
    write(null);
    return ROUTES.GROUPS.DETAIL(intent.groupId);
  }
  return ROUTES.PROFILE.ME_REVIEWS;
}
