import type { CursorPageUserRankingResponse } from "@/api/gen/_model/cursorPageUserRankingResponse.gen";
import { hasText } from "@/shared/utils/hasText";
import type { RankRow } from "../_model/rank";

/**
 * 순위를 세운다. 전 유저 대상이고 리뷰 0건인 사람도 포함한다.
 *
 * 정렬은 서버 것(화면이 고른 `sort` 축 내림차순, 같으면 userId 내림차순)을 그대로 쓴다. 순서를
 * 건드리지 않으므로 페이지를 이어 받아도 앞 순위가 바뀌지 않는다. 첫 항목이 1위다.
 *
 * 두 번째 지표 `sharedReviewCount`는 그룹에 공유한 리뷰 수다 (TMT-438). 사진이 비어 오면
 * `null`로 고쳐 화면이 기본 아바타를 그리게 한다.
 */
export function toRankRows(pages: readonly CursorPageUserRankingResponse[]): RankRow[] {
  return pages
    .flatMap((page) => page.items)
    .map((item, index) => ({
      rank: index + 1,
      userId: item.userId,
      nickname: item.nickname,
      profileImageUrl: hasText(item.profileImageUrl) ? item.profileImageUrl : null,
      reviewCount: item.reviewCount,
      sharedReviewCount: item.sharedReviewCount,
    }));
}
