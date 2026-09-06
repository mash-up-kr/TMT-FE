"use client";

import { useRouter } from "next/navigation";
import { useGroupDetail } from "@/api/gen/group/group.gen";
import { useJoinPreview } from "@/api/gen/group-membership/group-membership.gen";
import { clearJoinGroupIntent } from "@/shared/constants/reviewJoinGroup";
import { ROUTES } from "@/shared/constants/routes";
import { useJoinGroup } from "@/shared/hooks/useJoinGroup";

/**
 * 리뷰를 마친 뒤 원래 가입하려던 그룹으로 이어주는 흐름.
 *
 * 카드에 그릴 정보와 가입 가능 여부를 함께 받는다. 리뷰를 써서 티켓을 받았는지는 서버만 알기
 * 때문에, 화면에 들어온 시점에 다시 물어본다.
 */
export function useGroupJoinAfterReview(groupId: string) {
  const router = useRouter();
  const detail = useGroupDetail(groupId);
  const joinPreview = useJoinPreview(groupId);
  const join = useJoinGroup(groupId);

  const joinGroup = async () => {
    if (!(await join.joinGroup())) {
      return;
    }
    // 이어줄 일이 끝났다. 남겨두면 이 초안을 다시 열었을 때 또 그룹 화면이 뜬다.
    clearJoinGroupIntent();
    router.replace(ROUTES.GROUPS.DETAIL(groupId));
  };

  return {
    group: detail.data,
    isPending: detail.isPending,
    isJoinable: joinPreview.data?.joinable ?? false,
    joinGroup,
    isJoining: join.isPending,
  };
}
