import { useQueryClient } from "@tanstack/react-query";
import { getGroupDetailQueryKey } from "@/api/gen/group/group.gen";
import { useJoin } from "@/api/gen/group-membership/group-membership.gen";

export function useJoinGroup(groupId: string) {
  const queryClient = useQueryClient();
  const join = useJoin();

  async function joinGroup(): Promise<boolean> {
    try {
      await join.mutateAsync({ groupId });
      void queryClient.invalidateQueries({ queryKey: getGroupDetailQueryKey(groupId) });

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
