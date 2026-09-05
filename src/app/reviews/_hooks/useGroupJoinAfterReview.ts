"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  getGroupDetailQueryKey,
  getListGroupsQueryKey,
  useGroupDetail,
} from "@/api/gen/group/group.gen";
import { useJoin, useJoinPreview } from "@/api/gen/group-membership/group-membership.gen";
import { getHomeQueryKey } from "@/api/gen/home/home.gen";
import { clearJoinGroupIntent } from "@/shared/constants/reviewJoinGroup";
import { ROUTES } from "@/shared/constants/routes";
import { toast } from "@/shared/ui/Toast";

const JOIN_SUCCESS_MESSAGE = "그룹 가입이 완료되었어요.";
const JOIN_FAILED_MESSAGE = "그룹 가입에 실패했어요. 다시 시도해 주세요.";

/**
 * 리뷰를 마친 뒤 원래 가입하려던 그룹으로 이어주는 흐름.
 *
 * 카드에 그릴 정보와 가입 가능 여부를 함께 받는다. 리뷰를 써서 티켓을 받았는지는 서버만 알기
 * 때문에, 화면에 들어온 시점에 다시 물어본다.
 */
export function useGroupJoinAfterReview(groupId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const detail = useGroupDetail(groupId);
  const joinPreview = useJoinPreview(groupId);
  const join = useJoin();

  const joinGroup = async () => {
    try {
      await join.mutateAsync({ groupId });
      // 이어줄 일이 끝났다. 남겨두면 이 초안을 다시 열었을 때 또 그룹 화면이 뜬다.
      clearJoinGroupIntent();
      // 가입한 그룹으로 곧장 이동하므로 상세는 기다렸다 넘어간다. 던져두고 가면 staleTime
      // 안에서는 재조회가 없어 가입 전 화면(가입 게이트)이 그대로 보인다.
      await queryClient.invalidateQueries({ queryKey: getGroupDetailQueryKey(groupId) });
      void queryClient.invalidateQueries({ queryKey: getHomeQueryKey() });
      void queryClient.invalidateQueries({ queryKey: getListGroupsQueryKey() });
      toast.success(JOIN_SUCCESS_MESSAGE);
      router.replace(ROUTES.GROUPS.DETAIL(groupId));
    } catch {
      toast.error(JOIN_FAILED_MESSAGE);
    }
  };

  return {
    group: detail.data,
    isPending: detail.isPending,
    isJoinable: joinPreview.data?.joinable ?? false,
    joinGroup,
    isJoining: join.isPending,
  };
}
