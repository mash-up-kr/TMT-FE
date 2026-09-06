import { useQueryClient } from "@tanstack/react-query";
import { getGroupDetailQueryKey, getListGroupsQueryKey } from "@/api/gen/group/group.gen";
import { useJoin } from "@/api/gen/group-membership/group-membership.gen";
import { getHomeQueryKey } from "@/api/gen/home/home.gen";
import { toast } from "@/shared/ui/Toast";

const JOIN_SUCCESS_MESSAGE = "그룹 가입이 완료되었어요.";
const JOIN_FAILED_MESSAGE = "그룹 가입에 실패했어요. 다시 시도해 주세요.";

/**
 * 그룹 가입. 그룹 상세의 가입 시트와 리뷰 완료 화면의 가입 버튼이 함께 쓴다.
 *
 * 가입 뒤 지워야 할 캐시와 안내 문구를 여기 한 곳에 둔다. 호출부마다 따로 적으면 한쪽만 고치는
 * 실수가 오류 없이 통과한다. 실제로 리뷰 쪽에 상세 캐시 정리가 빠진 채 빌드가 통과한 적이 있다.
 *
 * 가입 결과가 보이는 곳(상세·홈·그룹 목록)을 모두 다시 받은 뒤에 돌려주므로, 돌려받은 시점에
 * 어느 화면으로 가도 가입 전 화면이 남지 않는다. 성공 여부만 돌려주고 그다음 할 일(시트 닫기,
 * 그룹으로 이동)은 호출부가 정한다.
 */
export function useJoinGroup(groupId: string) {
  const queryClient = useQueryClient();
  const join = useJoin();

  async function joinGroup(): Promise<boolean> {
    try {
      await join.mutateAsync({ groupId });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getGroupDetailQueryKey(groupId) }),
        queryClient.invalidateQueries({ queryKey: getHomeQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getListGroupsQueryKey() }),
      ]);
      toast.success(JOIN_SUCCESS_MESSAGE);
      return true;
    } catch {
      toast.error(JOIN_FAILED_MESSAGE);
      return false;
    }
  }

  return { joinGroup, isPending: join.isPending };
}
