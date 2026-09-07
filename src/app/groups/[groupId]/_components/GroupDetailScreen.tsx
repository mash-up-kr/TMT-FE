"use client";

import { useJoinGroup } from "@/shared/hooks/useJoinGroup";
import { useGroupDetailQueryState } from "../_hooks/useGroupDetailQueryState";
import { useLeaveGroup } from "../_hooks/useLeaveGroup";
import { GroupDetailView } from "./GroupDetailView";

type GroupDetailScreenProps = {
  groupId: string;
};

export function GroupDetailScreen({ groupId }: GroupDetailScreenProps) {
  const queryState = useGroupDetailQueryState(groupId);
  const join = useJoinGroup(groupId);
  const leave = useLeaveGroup(groupId);

  return (
    <GroupDetailView
      group={queryState.group}
      reviewList={queryState.reviewList}
      joinPreview={queryState.joinPreview}
      joinAction={{ onJoin: join.joinGroup, isPending: join.isPending }}
      leaveAction={{ onLeaveAction: leave.leaveGroup, isPending: leave.isPending }}
    />
  );
}
