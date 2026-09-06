import { useQueryClient } from "@tanstack/react-query";
import { getGroupDetailQueryKey, getListGroupsQueryKey } from "@/api/gen/group/group.gen";
import { useJoin } from "@/api/gen/group-membership/group-membership.gen";
import { getHomeQueryKey } from "@/api/gen/home/home.gen";
import { getMeQueryKey, getMyTicketsQueryKey } from "@/api/gen/profile/profile.gen";
import { UT2_STEPS } from "@/shared/constants/ut2";
import { setUt2Step } from "@/shared/hooks/useUt2Step";
import { toast } from "@/shared/ui/Toast";

const JOIN_SUCCESS_MESSAGE = "그룹 가입이 완료되었어요.";
const JOIN_FAILED_MESSAGE = "그룹 가입에 실패했어요. 다시 시도해 주세요.";

/** 가입 팝업이 쓰는 티켓 정보. 그룹마다 키가 달라 경로 끝으로 찾는다. */
const JOIN_PREVIEW_PATH_SUFFIX = "/join-preview";

type JoinGroupOptions = Readonly<{
  /**
   * 가입과 함께 이 그룹에 공유할 내 리뷰.
   *
   * 서버는 여기 실린 것만 같은 트랜잭션에서 공유하고, 비어 있으면 공유 없이 가입만 한다
   * (API 명세 H §2-2). "자동 공유"는 서버가 알아서 하는 게 아니라 화면이 대신 실어 보내는 것이다.
   */
  sourceReviewIds?: readonly string[];
}>;

/**
 * 그룹 가입. 그룹 상세의 가입 시트, 리뷰 공유 선택 화면, 리뷰 완료 화면이 함께 쓴다.
 *
 * 가입 뒤 지워야 할 캐시와 안내 문구를 여기 한 곳에 둔다. 호출부마다 따로 적으면 한쪽만 고치는
 * 실수가 오류 없이 통과한다. 실제로 리뷰 쪽에 상세 캐시 정리가 빠진 채 빌드가 통과한 적이 있다.
 *
 * **가입은 티켓 1장을 쓴다.** 그래서 그룹이 보이는 곳(상세·홈·목록)만이 아니라 티켓 수가 보이는
 * 곳(마이페이지·티켓 내역·다른 그룹의 가입 팝업)도 함께 지운다. 빠뜨리면 티켓을 다 쓴 뒤에도
 * 다른 그룹 팝업이 `가입하기`로 떠서, 눌러야 실패하는 화면이 된다.
 *
 * 가입 결과가 보이는 곳을 모두 다시 받은 뒤에 돌려주므로, 돌려받은 시점에 어느 화면으로 가도
 * 가입 전 화면이 남지 않는다. 성공 여부만 돌려주고 그다음 할 일(시트 닫기, 그룹으로 이동)은
 * 호출부가 정한다.
 */
export function useJoinGroup(groupId: string) {
  const queryClient = useQueryClient();
  const join = useJoin();

  async function joinGroup({ sourceReviewIds }: JoinGroupOptions = {}): Promise<boolean> {
    try {
      await join.mutateAsync({
        groupId,
        data: sourceReviewIds?.length ? { sourceReviewIds: [...sourceReviewIds] } : {},
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getGroupDetailQueryKey(groupId) }),
        queryClient.invalidateQueries({ queryKey: getHomeQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getListGroupsQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getMeQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getMyTicketsQueryKey() }),
        queryClient.invalidateQueries({
          predicate: (query) =>
            typeof query.queryKey[0] === "string" &&
            query.queryKey[0].endsWith(JOIN_PREVIEW_PATH_SUFFIX),
        }),
      ]);
      // ⚠️ UT2 임시 계측. 가입 경로가 셋이라 각 화면이 아니라 여기서 한 번만 남긴다.
      setUt2Step(UT2_STEPS.GROUP_JOIN_COMPLETE);
      toast.success(JOIN_SUCCESS_MESSAGE);
      return true;
    } catch {
      toast.error(JOIN_FAILED_MESSAGE);
      return false;
    }
  }

  return { joinGroup, isPending: join.isPending };
}
