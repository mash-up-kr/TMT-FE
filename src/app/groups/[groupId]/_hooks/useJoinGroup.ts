import { useQueryClient } from "@tanstack/react-query";
import { getGroupDetailQueryKey, getListGroupsQueryKey } from "@/api/gen/group/group.gen";
import { useJoin } from "@/api/gen/group-membership/group-membership.gen";
import { getHomeQueryKey } from "@/api/gen/home/home.gen";

export function useJoinGroup(groupId: string) {
  const queryClient = useQueryClient();
  const join = useJoin();

  async function joinGroup(): Promise<boolean> {
    try {
      await join.mutateAsync({ groupId });
      void queryClient.invalidateQueries({ queryKey: getGroupDetailQueryKey(groupId) });
      void queryClient.invalidateQueries({ queryKey: getHomeQueryKey() });
      void queryClient.invalidateQueries({ queryKey: getListGroupsQueryKey() });

      return true;
    } catch {
      return false;
    }
  }

  return {
    joinGroup,
    isPending: join.isPending,
  };
}
