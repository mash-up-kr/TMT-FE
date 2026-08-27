"use client";

import { useGroupDetailQueryState } from "../_hooks/useGroupDetailQueryState";
import { useJoinGroup } from "../_hooks/useJoinGroup";
import { useLeaveGroup } from "../_hooks/useLeaveGroup";
import { GroupDetailError, GroupDetailLoading } from "./GroupDetailFeedback";
import { GroupDetailView } from "./GroupDetailView";

type GroupDetailScreenProps = {
  groupId: string;
};

export function GroupDetailScreen({ groupId }: GroupDetailScreenProps) {
  const queryState = useGroupDetailQueryState(groupId);
  const join = useJoinGroup(groupId);
  const leave = useLeaveGroup(groupId);

  if (queryState.status === "pending") {
    return <GroupDetailLoading />;
  }

  if (queryState.status === "error") {
    return <GroupDetailError />;
  }

  return (
    <GroupDetailView
      group={queryState.group}
      reviewList={queryState.reviewList}
      joinAction={{ onJoin: join.joinGroup, isPending: join.isPending }}
      leaveAction={{ onLeaveAction: leave.leaveGroup, isPending: leave.isPending }}
    />
  );
}
