"use client";

import { useGroupEdit } from "../_hooks/useGroupEdit";
import type { GroupDeleteResult } from "../_model/groupEdit";
import { GroupEditError, GroupEditForbidden, GroupEditLoading } from "./GroupEditFeedback";
import { GroupEditView } from "./GroupEditView";

const DELETE_API_UNAVAILABLE_MESSAGE = "그룹 삭제 API가 아직 준비되지 않았어요.";

type GroupEditScreenProps = Readonly<{
  groupId: string;
}>;

export function GroupEditScreen({ groupId }: GroupEditScreenProps) {
  const edit = useGroupEdit(groupId);

  if (edit.status === "pending") {
    return <GroupEditLoading />;
  }

  if (edit.status === "error" || !edit.form) {
    return <GroupEditError />;
  }

  if (!edit.isOwner) {
    return <GroupEditForbidden />;
  }

  const handleDelete = async (): Promise<GroupDeleteResult> => ({
    success: false,
    errorTitle: DELETE_API_UNAVAILABLE_MESSAGE,
  });

  return (
    <GroupEditView
      groupId={groupId}
      initialForm={edit.form}
      tagOptionsState={edit.tagOptionsState}
      isSaving={edit.isSaving}
      deleteAction={{ onDeleteAction: handleDelete, isPending: false }}
      onSaveAction={edit.saveGroup}
      onRetryTagOptionsAction={edit.retryTagOptions}
    />
  );
}
