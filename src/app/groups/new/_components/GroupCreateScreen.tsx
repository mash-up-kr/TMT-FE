"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { ScreenLayout } from "@/shared/components/ScreenLayout";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { CancelIcon, ChevronLeftIcon } from "@/shared/ui/Icons";
import { Progress } from "@/shared/ui/Progress";
import { GROUP_CREATE_STEPS } from "../_constants/groupCreate";
import { useGroupCreateDraft } from "../_hooks/useGroupCreateDraft";
import type {
  GroupCreateDraft,
  GroupCreateInitialState,
  GroupCreateStep,
  GroupCreateSubmission,
  GroupCreateTagSheet,
  GroupTagOptionsState,
} from "../_model/groupCreate";
import { GroupBasicInfoStep } from "./GroupBasicInfoStep";
import { GroupDescriptionStep } from "./GroupDescriptionStep";
import { GroupImageStep } from "./GroupImageStep";
import { GroupTagSelectionStep } from "./GroupTagSelectionStep";

const GROUP_CREATE_STEP_COUNT = GROUP_CREATE_STEPS.length;

type GroupCreateScreenProps = {
  tagOptionsState: GroupTagOptionsState;
  isCreating: boolean;
  onCreateAction: (submission: GroupCreateSubmission) => void;
  onRetryTagOptionsAction: () => void;
  initialState?: GroupCreateInitialState;
};

export function GroupCreateScreen({
  tagOptionsState,
  isCreating,
  onCreateAction,
  onRetryTagOptionsAction,
  initialState,
}: GroupCreateScreenProps) {
  const router = useRouter();
  const [step, setStep] = useState<GroupCreateStep>(initialState?.step ?? "basicInfo");
  const { draft, updateDraft, groupImage, selectGroupImage, removeGroupImage } =
    useGroupCreateDraft(initialState?.draft);
  const stepIndex = GROUP_CREATE_STEPS.indexOf(step);
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === GROUP_CREATE_STEP_COUNT - 1;

  const handleBack = () => {
    if (isFirstStep) {
      router.back();
      return;
    }

    const previousStep = GROUP_CREATE_STEPS[stepIndex - 1];

    if (previousStep) {
      setStep(previousStep);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canContinue(step, draft) || isCreating) {
      return;
    }

    if (!isLastStep) {
      const nextStep = GROUP_CREATE_STEPS[stepIndex + 1];

      if (nextStep) {
        setStep(nextStep);
      }
      return;
    }

    onCreateAction({ draft, groupImageFile: groupImage?.file });
  };

  return (
    <ScreenLayout
      bodyScrollable={false}
      header={
        <GNB
          title="새 그룹 만들기"
          left={
            !isFirstStep ? (
              <IconButton className="p-ds-2" aria-label="이전 단계로" onClick={handleBack}>
                <ChevronLeftIcon />
              </IconButton>
            ) : undefined
          }
          right={
            <IconButton
              className="p-ds-2"
              aria-label="그룹 만들기 닫기"
              onClick={() => router.back()}
            >
              <CancelIcon thick />
            </IconButton>
          }
        />
      }
    >
      <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
        <div className="content-container shrink-0 pt-ds-20">
          <Progress
            value={stepIndex}
            max={GROUP_CREATE_STEP_COUNT}
            aria-label={`그룹 만들기 ${GROUP_CREATE_STEP_COUNT}단계 중 ${stepIndex}단계 완료`}
          />
        </div>

        <main className="content-container min-h-0 flex-1 overflow-y-auto pt-ds-32 pb-ds-20">
          <GroupCreateStepContent
            step={step}
            draft={draft}
            tagOptionsState={tagOptionsState}
            initialOpenTagSheet={initialState?.openTagSheet}
            groupImagePreviewUrl={groupImage?.previewUrl}
            onDraftChangeAction={updateDraft}
            onGroupImageSelectAction={selectGroupImage}
            onGroupImageRemoveAction={removeGroupImage}
            onRetryTagOptionsAction={onRetryTagOptionsAction}
          />
        </main>

        <div className="shrink-0 bg-surface-primary px-ds-20 pt-ds-12 pb-ds-32">
          <ButtonStack>
            <Button
              type="submit"
              disabled={!canContinue(step, draft)}
              loading={isLastStep && isCreating}
            >
              {isLastStep ? "그룹 만들기" : "다음"}
            </Button>
          </ButtonStack>
        </div>
      </form>
    </ScreenLayout>
  );
}

type GroupCreateStepContentProps = {
  step: GroupCreateStep;
  draft: GroupCreateDraft;
  tagOptionsState: GroupTagOptionsState;
  initialOpenTagSheet?: GroupCreateTagSheet;
  groupImagePreviewUrl?: string;
  onDraftChangeAction: (patch: Partial<GroupCreateDraft>) => void;
  onGroupImageSelectAction: (file: File) => void;
  onGroupImageRemoveAction: () => void;
  onRetryTagOptionsAction: () => void;
};

function GroupCreateStepContent({
  step,
  draft,
  tagOptionsState,
  initialOpenTagSheet,
  groupImagePreviewUrl,
  onDraftChangeAction,
  onGroupImageSelectAction,
  onGroupImageRemoveAction,
  onRetryTagOptionsAction,
}: GroupCreateStepContentProps) {
  if (step === "basicInfo") {
    return (
      <GroupBasicInfoStep
        groupName={draft.groupName}
        summaryDescription={draft.summaryDescription}
        onGroupNameChangeAction={(value) => onDraftChangeAction({ groupName: value })}
        onSummaryDescriptionChangeAction={(value) =>
          onDraftChangeAction({ summaryDescription: value })
        }
      />
    );
  }

  if (step === "tags") {
    return (
      <GroupTagSelectionStep
        tagOptionsState={tagOptionsState}
        initialOpenSheet={initialOpenTagSheet}
        selection={{ foodCategoryId: draft.foodCategoryId, regionIds: draft.regionIds }}
        onSelectionChangeAction={onDraftChangeAction}
        onRetryTagOptionsAction={onRetryTagOptionsAction}
      />
    );
  }

  if (step === "image") {
    return (
      <GroupImageStep
        groupName={draft.groupName}
        previewUrl={groupImagePreviewUrl}
        onImageSelectAction={onGroupImageSelectAction}
        onImageRemoveAction={onGroupImageRemoveAction}
      />
    );
  }

  return (
    <GroupDescriptionStep
      detailedDescription={draft.detailedDescription ?? ""}
      onDetailedDescriptionChangeAction={(value) =>
        onDraftChangeAction({ detailedDescription: value })
      }
    />
  );
}

function canContinue(step: GroupCreateStep, draft: GroupCreateDraft) {
  if (step === "basicInfo") {
    return Boolean(draft.groupName.trim() && draft.summaryDescription.trim());
  }

  if (step === "tags") {
    return Boolean(draft.foodCategoryId && draft.regionIds.length > 0);
  }

  return true;
}
