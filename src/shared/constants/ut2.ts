/**
 * ⚠️ UT2 대비 임시 코드다. UT2가 끝나면 `shared/utils/clarity.ts` 계열과 함께 지운다.
 *
 * UT2 스크립트의 세부 스텝을 Clarity 커스텀 태그 값으로 옮긴 정본이다.
 * 정의 문서: [UT2] Clarity 태그 정의 · 스크립트: [UT 2차 계획] §5
 *
 * 값은 `<스텝번호>_<화면>` 형태다. 정의 문서는 스텝 번호와 snake_case 이름을 각각 다른
 * 절에 적어 두었는데, 번호만 쓰면 대시보드에서 의미가 안 읽히고 이름만 쓰면 관찰 기록
 * 시트와 대조할 때 정렬이 안 된다. 둘을 합쳐 양쪽을 모두 만족시킨다.
 *
 * 스크립트의 1-7·2-8은 화면 전환이 없는 진행자 질문이라 심을 시점이 없어 제외한다.
 */

export const UT2_STEP_TAG_KEY = "ut2_step";
export const UT2_PARTICIPANT_TAG_KEY = "participant";
export const UT2_TASK_TAG_KEY = "task";

export const UT2_STEPS = {
  /** 매장 검색 후 사진·태그·별점을 공란으로 통과 (티켓 캡션 최초 노출) */
  REVIEW_WRITE_SKIP: "1-1_review_write_skip",
  /** 홈 캐러셀에서 매칭 그룹 카드 첫 노출 */
  HOME_CAROUSEL_VIEW: "1-2_home_carousel_view",
  /** 캐러셀을 스크롤하며 후보 카드 비교 */
  HOME_CAROUSEL_COMPARE: "1-3_home_carousel_compare",
  /** 그룹 탭 진입 */
  GROUP_TAB_ENTRY: "1-4_group_tab_entry",
  /** 그룹 탭에서 검색·필터로 추가 탐색 */
  GROUP_TAB_FILTER: "1-5_group_tab_filter",
  /** 가입할 그룹 최종 선택 */
  GROUP_SELECT_FINAL: "1-6_group_select_final",
  /** 그룹 상세 진입 */
  GROUP_DETAIL_ENTER: "2-1_group_detail_enter",
  /** 그룹 안의 가게로 진입해 상세 확인 */
  GROUP_STORE_LIST: "2-2_group_store_list",
  /** 티켓 부족 바텀시트 노출 */
  TICKET_INSUFFICIENT_SHEET: "2-3_ticket_insufficient_sheet",
  /** 이어서 작성 확인 바텀시트 — 아직 화면이 없어 찍히지 않는다 */
  REVIEW_CONTINUE_CONFIRM: "2-4_review_continue_confirm",
  /** 리뷰 이어쓰기 (캡션 재노출) — 진입 경로가 없어 찍히지 않는다 */
  REVIEW_CONTINUE_WRITING: "2-5_review_continue_writing",
  /** 리뷰 작성 완료·티켓 획득 */
  REVIEW_COMPLETE: "2-6_review_complete",
  /** 그룹 가입 완료 */
  GROUP_JOIN_COMPLETE: "2-7_group_join_complete",
} as const;

export type Ut2Step = (typeof UT2_STEPS)[keyof typeof UT2_STEPS];
