"use client";

import { useRouter } from "next/navigation";
import { useGroupDetail } from "@/api/gen/group/group.gen";
import { useJoinPreview } from "@/api/gen/group-membership/group-membership.gen";
import { clearJoinGroupIntent } from "@/shared/constants/reviewJoinGroup";
import { ROUTES } from "@/shared/constants/routes";
import { useJoinGroup } from "@/shared/hooks/useJoinGroup";

type GroupJoinAfterReviewTarget = Readonly<{
  groupId: string;
  /** 방금 완성된 리뷰. 미완성 초안이면 없고, 그때는 티켓도 없어 가입 버튼이 눌리지 않는다. */
  reviewId: string | null;
}>;

/**
 * 리뷰를 마친 뒤 원래 가입하려던 그룹으로 이어주는 흐름.
 *
 * 카드에 그릴 정보와 가입 가능 여부를 함께 받는다. 리뷰를 써서 티켓을 받았는지는 서버만 알기
 * 때문에, 화면에 들어온 시점에 다시 물어본다.
 */
export function useGroupJoinAfterReview({ groupId, reviewId }: GroupJoinAfterReviewTarget) {
  const router = useRouter();
  const detail = useGroupDetail(groupId);
  const joinPreview = useJoinPreview(groupId);
  const join = useJoinGroup(groupId);

  const joinGroup = async () => {
    // 완료 화면은 "작성한 리뷰가 자동으로 그룹에 공유돼요"라고 안내한다. 서버는 실어 보낸 것만
    // 공유하므로(H 명세 §0 경로 2) 방금 완성된 리뷰를 여기서 싣는다. 이걸 빼면 안내가 거짓이 된다.
    if (!(await join.joinGroup({ sourceReviewIds: reviewId ? [reviewId] : undefined }))) {
      return;
    }
    // 이어줄 일이 끝났다. 남겨두면 이 초안을 다시 열었을 때 또 그룹 화면이 뜬다.
    clearJoinGroupIntent();
    router.replace(ROUTES.GROUPS.DETAIL(groupId));
  };

  return {
    group: detail.data,
    isPending: detail.isPending,
    /**
     * 그룹을 못 받아 카드를 그릴 수 없는 상태. 이걸 내보내지 않으면 화면이 로딩과 실패를 구분하지
     * 못해, 조회가 끝난 뒤에도 빈 화면에 머문다.
     */
    isError: detail.isError,
    retry: () => void detail.refetch(),
    isJoinable: joinPreview.data?.joinable ?? false,
    joinGroup,
    isJoining: join.isPending,
  };
}
