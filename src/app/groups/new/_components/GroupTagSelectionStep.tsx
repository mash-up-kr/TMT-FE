"use client";

import { useState } from "react";
import { FilterOption } from "@/app/groups/_components/FilterOption";
import type { GroupTagOption } from "@/app/groups/_model/groupTag";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { Chip } from "@/shared/ui/Chip";
import { IconButton } from "@/shared/ui/IconButton";
import { CancelIcon, ChevronDownIcon, LoadingIcon, RefreshIcon } from "@/shared/ui/Icons";
import type {
  GroupCreateTagSheet,
  GroupTagOptionsState,
  GroupTagOptionsStatus,
  GroupTagSelection,
} from "../_model/groupCreate";
import { GroupCreateStepHeader } from "./GroupCreateStepHeader";

type GroupTagSelectionStepProps = {
  tagOptionsState: GroupTagOptionsState;
  initialOpenSheet?: GroupCreateTagSheet;
  selection: GroupTagSelection;
  onSelectionChangeAction: (selection: GroupTagSelection) => void;
  onRetryTagOptionsAction: () => void;
};

export function GroupTagSelectionStep({
  tagOptionsState,
  initialOpenSheet,
  selection,
  onSelectionChangeAction,
  onRetryTagOptionsAction,
}: GroupTagSelectionStepProps) {
  const { options: tagOptions, status: tagOptionsStatus } = tagOptionsState;
  const { foodCategoryId, regionIds } = selection;
  const [categorySheetOpen, setCategorySheetOpen] = useState(initialOpenSheet === "category");
  const [regionSheetOpen, setRegionSheetOpen] = useState(initialOpenSheet === "region");
  const [pendingCategoryId, setPendingCategoryId] = useState(foodCategoryId);
  const [pendingRegionIds, setPendingRegionIds] = useState<string[]>([...regionIds]);

  const selectedCategory = tagOptions.categories.find((option) => option.id === foodCategoryId);
  const selectedRegions = tagOptions.regions.filter((option) => regionIds.includes(option.id));

  const openCategorySheet = () => {
    setPendingCategoryId(foodCategoryId);
    setCategorySheetOpen(true);
  };
  const openRegionSheet = () => {
    setPendingRegionIds([...regionIds]);
    setRegionSheetOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-ds-24">
        <GroupCreateStepHeader title={"그룹 카테고리를\n선택해주세요."} required />

        <div className="flex flex-col gap-ds-24">
          <TagSelectField
            label="음식 카테고리 선택"
            value={selectedCategory?.label}
            placeholder="카테고리"
            onClickAction={openCategorySheet}
          />
          <TagSelectField
            label="지역 선택"
            value={selectedRegions.map((option) => option.label).join(", ")}
            placeholder="지역"
            onClickAction={openRegionSheet}
          />
        </div>
      </div>

      <BottomSheet
        open={categorySheetOpen}
        onOpenChange={setCategorySheetOpen}
        title="음식 카테고리"
        right={
          <IconButton aria-label="음식 카테고리 초기화" onClick={() => setPendingCategoryId("")}>
            <RefreshIcon />
          </IconButton>
        }
        footer={
          <ButtonStack>
            <Button
              disabled={!pendingCategoryId}
              onClick={() => {
                onSelectionChangeAction({ ...selection, foodCategoryId: pendingCategoryId });
                setCategorySheetOpen(false);
              }}
            >
              선택완료
            </Button>
          </ButtonStack>
        }
      >
        <TagOptionsContent
          status={tagOptionsStatus}
          options={tagOptions.categories}
          selectedIds={[pendingCategoryId]}
          onSelectAction={setPendingCategoryId}
          onRetryAction={onRetryTagOptionsAction}
        />
      </BottomSheet>

      <BottomSheet
        open={regionSheetOpen}
        onOpenChange={setRegionSheetOpen}
        title="지역"
        right={
          <IconButton aria-label="지역 초기화" onClick={() => setPendingRegionIds([])}>
            <RefreshIcon />
          </IconButton>
        }
        footer={
          <ButtonStack>
            <Button
              disabled={pendingRegionIds.length === 0}
              onClick={() => {
                onSelectionChangeAction({ ...selection, regionIds: pendingRegionIds });
                setRegionSheetOpen(false);
              }}
            >
              선택완료
            </Button>
          </ButtonStack>
        }
      >
        {pendingRegionIds.length > 0 ? (
          <div className="mb-ds-12 flex flex-wrap gap-ds-8">
            {tagOptions.regions
              .filter((option) => pendingRegionIds.includes(option.id))
              .map((option) => (
                <Chip
                  key={option.id}
                  selected
                  rightIcon={<CancelIcon thick size={16} />}
                  onClick={() =>
                    setPendingRegionIds((current) =>
                      current.filter((regionId) => regionId !== option.id),
                    )
                  }
                >
                  {option.label}
                </Chip>
              ))}
          </div>
        ) : null}

        <TagOptionsContent
          status={tagOptionsStatus}
          options={tagOptions.regions}
          selectedIds={pendingRegionIds}
          onSelectAction={(id) =>
            setPendingRegionIds((current) =>
              current.includes(id)
                ? current.filter((regionId) => regionId !== id)
                : [...current, id],
            )
          }
          onRetryAction={onRetryTagOptionsAction}
        />
      </BottomSheet>
    </>
  );
}

type TagSelectFieldProps = {
  label: string;
  value?: string;
  placeholder: string;
  onClickAction: () => void;
};

function TagSelectField({ label, value, placeholder, onClickAction }: TagSelectFieldProps) {
  return (
    <div className="flex flex-col gap-ds-12">
      <span className="text-body-lg-medium text-content-primary">{label}</span>
      <button
        type="button"
        aria-label={`${label}: ${value || placeholder}`}
        onClick={onClickAction}
        className="flex min-h-ds-48 w-full items-center gap-ds-12 rounded-ds-md border-sm border-stroke-field bg-surface-primary px-ds-16 py-ds-12 text-left outline-none focus-visible:border-stroke-field-pressed"
      >
        <span
          className={`min-w-0 flex-1 truncate text-body-lg-medium ${
            value ? "text-content-primary" : "text-content-tertiary opacity-70"
          }`}
        >
          {value || placeholder}
        </span>
        <ChevronDownIcon className="shrink-0 text-icon-secondary" />
      </button>
    </div>
  );
}

type TagOptionsContentProps = {
  status: GroupTagOptionsStatus;
  options: readonly GroupTagOption[];
  selectedIds: readonly string[];
  onSelectAction: (id: string) => void;
  onRetryAction: () => void;
};

function TagOptionsContent({
  status,
  options,
  selectedIds,
  onSelectAction,
  onRetryAction,
}: TagOptionsContentProps) {
  if (status === "pending") {
    return (
      <div className="flex items-center justify-center py-ds-40">
        <LoadingIcon className="animate-spin text-icon-tertiary" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center gap-ds-12 py-ds-40">
        <p className="text-body-md-regular text-content-secondary">
          선택 항목을 불러오지 못했어요.
        </p>
        <Button size="sm" variant="tertiary" onClick={onRetryAction}>
          다시 시도
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {options.map((option) => (
        <FilterOption
          key={option.id}
          label={option.label}
          selected={selectedIds.includes(option.id)}
          onClick={() => onSelectAction(option.id)}
        />
      ))}
    </div>
  );
}
