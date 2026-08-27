import { IconButton } from "@/shared/ui/IconButton";
import { CancelIcon } from "@/shared/ui/Icons";
import { TextField } from "@/shared/ui/TextField";
import { GroupCreateStepHeader } from "./GroupCreateStepHeader";

type GroupBasicInfoStepProps = {
  groupName: string;
  summaryDescription: string;
  onGroupNameChangeAction: (value: string) => void;
  onSummaryDescriptionChangeAction: (value: string) => void;
};

export function GroupBasicInfoStep({
  groupName,
  summaryDescription,
  onGroupNameChangeAction,
  onSummaryDescriptionChangeAction,
}: GroupBasicInfoStepProps) {
  return (
    <div className="flex flex-col gap-ds-24">
      <GroupCreateStepHeader title={"어떤 그룹을\n만드시겠어요?"} required />

      <div className="flex flex-col gap-ds-24">
        <TextField
          label="그룹 이름"
          aria-required="true"
          value={groupName}
          placeholder="그룹 이름을 입력해주세요"
          trailing={
            groupName ? (
              <IconButton aria-label="그룹 이름 지우기" onClick={() => onGroupNameChangeAction("")}>
                <CancelIcon />
              </IconButton>
            ) : undefined
          }
          onChange={(event) => onGroupNameChangeAction(event.target.value)}
        />
        <TextField
          label="그룹 한줄 소개"
          aria-required="true"
          value={summaryDescription}
          placeholder="어떤 그룹인지 간단히 소개해주세요."
          trailing={
            summaryDescription ? (
              <IconButton
                aria-label="그룹 한줄 소개 지우기"
                onClick={() => onSummaryDescriptionChangeAction("")}
              >
                <CancelIcon />
              </IconButton>
            ) : undefined
          }
          onChange={(event) => onSummaryDescriptionChangeAction(event.target.value)}
        />
      </div>
    </div>
  );
}
