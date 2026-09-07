import { useGroupDetailSuspense } from "@/api/gen/group/group.gen";

export function useSuspenseGroupDetail(groupId: string) {
  return useGroupDetailSuspense(groupId);
}
