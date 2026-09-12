import type { CursorPageUserRankingResponse } from "@/api/gen/_model/cursorPageUserRankingResponse.gen";
import { hasText } from "@/shared/utils/hasText";
import type { RankRow } from "../_model/rank";

/**
 * 그룹을 만든 사람 중에서 리뷰 수 순위를 세운다.
 *
 * 정렬은 서버 것(리뷰 수 내림차순)을 그대로 쓴다. 서버에 "그룹 소유자만" 조건이 없어 여기서
 * 거르는데, 소유 그룹의 `memberCount`는 생성자 본인을 포함해(D3) 하나라도 만들었으면 1 이상이고
 * 없으면 0이다. 거르기만 하고 순서는 건드리지 않으므로 페이지를 이어 받아도 앞 순위가 바뀌지
 * 않는다. 첫 항목이 1위다.
 *
 * 사진이 비어 오면 `null`로 고쳐 화면이 기본 아바타를 그리게 한다.
 */
export function toRankRows(pages: readonly CursorPageUserRankingResponse[]): RankRow[] {
  return pages
    .flatMap((page) => page.items)
    .filter((item) => item.memberCount > 0)
    .map((item, index) => ({
      rank: index + 1,
      userId: item.userId,
      nickname: item.nickname,
      profileImageUrl: hasText(item.profileImageUrl) ? item.profileImageUrl : null,
      reviewCount: item.reviewCount,
      memberCount: item.memberCount,
    }));
}
