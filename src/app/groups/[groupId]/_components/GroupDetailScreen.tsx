"use client";

import { useGroupDetailQueryState } from "../_hooks/useGroupDetailQueryState";
import { useJoinGroup } from "../_hooks/useJoinGroup";
import { useLeaveGroup } from "../_hooks/useLeaveGroup";
import { GroupDetailError, GroupDetailLoading } from "./GroupDetailFeedback";
import { GroupDetailView } from "./GroupDetailView";

type GroupDetailScreenProps = {
  groupId: string;
  initialFirstReviewSheetOpen?: boolean;
};

export function GroupDetailScreen({
  groupId,
  initialFirstReviewSheetOpen,
}: GroupDetailScreenProps) {
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
      initialFirstReviewSheetOpen={initialFirstReviewSheetOpen}
      leaveAction={{ onLeaveAction: leave.leaveGroup, isPending: leave.isPending }}
    />
  );
}
