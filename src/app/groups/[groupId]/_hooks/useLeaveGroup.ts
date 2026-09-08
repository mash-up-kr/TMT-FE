import { useQueryClient } from "@tanstack/react-query";
import { getGroupDetailQueryKey, getListGroupsQueryKey } from "@/api/gen/group/group.gen";
import { useLeave } from "@/api/gen/group-membership/group-membership.gen";
import { getFeedQueryKey, getHomeQueryKey } from "@/api/gen/home/home.gen";
import type { GroupLeaveResult } from "../_model/groupDetail";
import { getGroupLeaveErrorTitle } from "../_utils/groupLeaveError";

export function useLeaveGroup(groupId: string) {
  const queryClient = useQueryClient();
  const leave = useLeave();

  async function leaveGroup(): Promise<GroupLeaveResult> {
    try {
      await leave.mutateAsync({ groupId });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getGroupDetailQueryKey(groupId) }),
        queryClient.invalidateQueries({ queryKey: getListGroupsQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getHomeQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getFeedQueryKey() }),
      ]);

      return { success: true };
    } catch (error) {
      return { success: false, errorTitle: getGroupLeaveErrorTitle(error) };
    }
  }

  return {
    leaveGroup,
    isPending: leave.isPending,
  };
}
