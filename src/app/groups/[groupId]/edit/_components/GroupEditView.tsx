"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { GroupTagFields } from "@/app/groups/_components/GroupTagFields";
import type { GroupTagOptionsState } from "@/app/groups/_model/groupTag";
import { GROUP_IMAGE_ACCEPT, getGroupImageValidationError } from "@/app/groups/_utils/groupImage";
import groupFallbackImage from "@/shared/assets/dummy.png";
import { ScreenLayout } from "@/shared/components/ScreenLayout";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { CancelIcon, ChevronLeftIcon, TrashIcon } from "@/shared/ui/Icons";
import { ImagePicker } from "@/shared/ui/ImagePicker";
import { Textarea, TextField } from "@/shared/ui/TextField";
import { toast } from "@/shared/ui/Toast";
import type {
  GroupDeleteAction,
  GroupEditFormData,
  GroupEditSaveResult,
} from "../_model/groupEdit";
import { GroupDeleteModal } from "./GroupDeleteModal";

type GroupEditViewProps = Readonly<{
  groupId: string;
  initialForm: GroupEditFormData;
  tagOptionsState: GroupTagOptionsState;
  isSaving: boolean;
  deleteAction: GroupDeleteAction;
  initialDeleteModalOpen?: boolean;
  onSaveAction: (form: GroupEditFormData, groupImageFile?: File) => Promise<GroupEditSaveResult>;
  onRetryTagOptionsAction: () => void;
}>;

type SelectedGroupImage = Readonly<{
  file: File;
  previewUrl: string;
}>;

export function GroupEditView({
  groupId,
  initialForm,
  tagOptionsState,
  isSaving,
  deleteAction,
  initialDeleteModalOpen = false,
  onSaveAction,
  onRetryTagOptionsAction,
}: GroupEditViewProps) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [selectedImage, setSelectedImage] = useState<SelectedGroupImage>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(initialDeleteModalOpen);
  const detailPath = ROUTES.GROUPS.DETAIL(groupId);
  const canSave = Boolean(
    form.groupName.trim() &&
      form.summaryDescription.trim() &&
      form.foodCategoryId &&
      form.regionIds.length > 0,
  );

  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage.previewUrl);
      }
    };
  }, [selectedImage]);

  const handleImageSelect = (file: File) => {
    const validationError = getGroupImageValidationError(file);
    if (validationError) {
      toast.error(validationError);
    } else {
      setSelectedImage({ file, previewUrl: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSave || isSaving) return;

    const saveResult = await onSaveAction(form, selectedImage?.file);

    if (saveResult.success) {
      toast.success("그룹 정보가 수정되었어요.");
      router.replace(detailPath);
    } else {
      toast.error(saveResult.errorTitle ?? "그룹 정보를 수정하지 못했어요. 다시 시도해 주세요.");
    }
  };

  const handleDelete = async () => {
    const result = await deleteAction.onDeleteAction();

    if (result.success) {
      setIsDeleteModalOpen(false);
      toast.success("그룹 삭제가 완료되었어요.");
      router.replace(ROUTES.GROUPS.ROOT);
    } else {
      toast.error(result.errorTitle ?? "그룹을 삭제하지 못했어요. 다시 시도해 주세요.");
    }

    return result;
  };

  return (
    <ScreenLayout
      bodyScrollable={false}
      header={
        <GNB
          title="그룹 편집"
          left={
            <IconButton aria-label="뒤로 가기" onClick={() => router.back()}>
              <ChevronLeftIcon size={28} />
            </IconButton>
          }
          right={
            <div className="flex items-center gap-ds-16">
              <IconButton aria-label="그룹 삭제" onClick={() => setIsDeleteModalOpen(true)}>
                <TrashIcon size={28} />
              </IconButton>
              <IconButton aria-label="그룹 편집 닫기" onClick={() => router.replace(detailPath)}>
                <CancelIcon thick size={28} />
              </IconButton>
            </div>
          }
        />
      }
    >
      <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
        <main className="content-container flex min-h-0 flex-1 flex-col gap-ds-20 overflow-y-auto pt-ds-20 pb-ds-20">
          <div className="flex flex-col gap-ds-12">
            <p className="text-body-lg-medium text-content-primary">대표 이미지</p>
            <ImagePicker
              label="그룹 대표 이미지"
              src={selectedImage?.previewUrl ?? form.imageUrl}
              fallbackSrc={groupFallbackImage}
              accept={GROUP_IMAGE_ACCEPT}
              onSelect={handleImageSelect}
            />
          </div>

          <TextField
            required
            label="그룹 이름"
            value={form.groupName}
            onChange={(event) =>
              setForm((current) => ({ ...current, groupName: event.target.value }))
            }
          />
          <TextField
            required
            label="카페 한줄 소개"
            value={form.summaryDescription}
            onChange={(event) =>
              setForm((current) => ({ ...current, summaryDescription: event.target.value }))
            }
          />
          <GroupTagFields
            tagOptionsState={tagOptionsState}
            selection={{ foodCategoryId: form.foodCategoryId, regionIds: form.regionIds }}
            categoryLabel="카테고리 태그"
            categoryPlaceholder="카테고리"
            regionLabel="지역 태그"
            regionPlaceholder="지역"
            onSelectionChangeAction={(selection) =>
              setForm((current) => ({ ...current, ...selection }))
            }
            onRetryTagOptionsAction={onRetryTagOptionsAction}
          />
          <Textarea
            label="그룹 소개"
            value={form.detailedDescription}
            maxLength={200}
            rows={6}
            showCount
            counterPlacement="field"
            onChange={(event) =>
              setForm((current) => ({ ...current, detailedDescription: event.target.value }))
            }
          />
        </main>

        <div className="shrink-0 bg-surface-primary px-ds-20 pt-ds-12 pb-ds-32">
          <ButtonStack>
            <Button type="submit" disabled={!canSave} loading={isSaving}>
              저장하기
            </Button>
          </ButtonStack>
        </div>
      </form>

      <GroupDeleteModal
        open={isDeleteModalOpen}
        onOpenChangeAction={setIsDeleteModalOpen}
        deleteAction={{ ...deleteAction, onDeleteAction: handleDelete }}
      />
    </ScreenLayout>
  );
}
