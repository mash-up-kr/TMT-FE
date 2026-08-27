import { Textarea } from "@/shared/ui/TextField";
import { GroupCreateStepHeader } from "./GroupCreateStepHeader";

type GroupDescriptionStepProps = {
  detailedDescription: string;
  onDetailedDescriptionChangeAction: (value: string) => void;
};

export function GroupDescriptionStep({
  detailedDescription,
  onDetailedDescriptionChangeAction,
}: GroupDescriptionStepProps) {
  return (
    <div className="flex flex-col gap-ds-24">
      <GroupCreateStepHeader title={"자세한 그룹\n소개를 해주시겠어요?"} required={false} />
      <Textarea
        value={detailedDescription}
        placeholder="그룹을 더 잘 알릴 수 있도록 소개를 남겨보세요"
        maxLength={200}
        rows={6}
        showCount
        counterPlacement="field"
        onChange={(event) => onDetailedDescriptionChangeAction(event.target.value)}
      />
    </div>
  );
}
