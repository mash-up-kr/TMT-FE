import { GroupTagFields } from "@/app/groups/_components/GroupTagFields";
import type {
  GroupCreateTagSheet,
  GroupTagOptionsState,
  GroupTagSelection,
} from "../_model/groupCreate";
import { GroupCreateStepHeader } from "./GroupCreateStepHeader";

type GroupTagSelectionStepProps = Readonly<{
  tagOptionsState: GroupTagOptionsState;
  initialOpenSheet?: GroupCreateTagSheet;
  selection: GroupTagSelection;
  onSelectionChangeAction: (selection: GroupTagSelection) => void;
  onRetryTagOptionsAction: () => void;
}>;

export function GroupTagSelectionStep({
  tagOptionsState,
  initialOpenSheet,
  selection,
  onSelectionChangeAction,
  onRetryTagOptionsAction,
}: GroupTagSelectionStepProps) {
  return (
    <div className="flex flex-col gap-ds-24">
      <GroupCreateStepHeader title={"그룹 카테고리를\n선택해주세요."} required />
      <GroupTagFields
        tagOptionsState={tagOptionsState}
        initialOpenSheet={initialOpenSheet}
        selection={selection}
        categoryLabel="음식 카테고리 선택"
        categoryPlaceholder="카테고리"
        regionLabel="지역 선택"
        regionPlaceholder="지역"
        onSelectionChangeAction={onSelectionChangeAction}
        onRetryTagOptionsAction={onRetryTagOptionsAction}
      />
    </div>
  );
}
