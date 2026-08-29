"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getHomeQueryKey } from "@/api/gen/home/home.gen";
import { getMeQueryKey, getMyTicketsQueryKey } from "@/api/gen/profile/profile.gen";
import { useReviewFormConfig } from "@/api/gen/review-write/review-write.gen";
import { createSave, updateSave } from "@/api/gen/save/save.gen";
import { getTmtApiErrorTitle, TmtApiError } from "@/api/mutator";
import { toast } from "@/shared/ui/Toast";
import type { ReviewSaveResult } from "../_model/save";
import { useReviewDraft } from "../_stores/ReviewDraftProvider";
import { toReviewSaveResult, toSaveRequest } from "../_utils/reviewApiMappers";
import { isReviewStoreComplete } from "../_utils/reviewStore";
import { ReviewPhotoUploadError, uploadReviewPhoto } from "../_utils/uploadReviewPhoto";

const SAVE_FAILED_MESSAGE = "리뷰를 저장하지 못했어요. 다시 시도해 주세요.";
const NOT_READY_MESSAGE = "리뷰 정보를 아직 불러오는 중이에요. 잠시 후 다시 시도해 주세요.";
const JOIN_PREVIEW_PATH_SUFFIX = "/join-preview";

function getSubmitErrorMessage(error: unknown): string {
  if (error instanceof ReviewPhotoUploadError) {
    return error.message;
  }

  if (error instanceof TmtApiError) {
    return getTmtApiErrorTitle(error) ?? SAVE_FAILED_MESSAGE;
  }

  return error instanceof Error && !(error instanceof TypeError)
    ? error.message
    : SAVE_FAILED_MESSAGE;
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  const draft = useReviewDraft();
  const formConfig = useReviewFormConfig();

  const mutation = useMutation({
    mutationFn: async (): Promise<ReviewSaveResult> => {
      if (!isReviewStoreComplete(draft.store) || formConfig.data === undefined) {
        throw new Error(NOT_READY_MESSAGE);
      }

      const photoAssetIds = await Promise.all(
        draft.photos.map((photo) => uploadReviewPhoto(photo.file)),
      );
      const input = {
        store: draft.store,
        photoAssetIds,
        selectedTagIds: draft.selectedTagIds,
        rating: draft.rating,
        reviewText: draft.reviewText,
        formConfig: formConfig.data,
      };
      const response =
        draft.saveId === null
          ? await createSave(toSaveRequest(input, "create"))
          : await updateSave(draft.saveId, toSaveRequest(input, "update"));

      return toReviewSaveResult(response);
    },
    onSuccess: (result) => {
      draft.setSaveResult(result);

      void queryClient.invalidateQueries({ queryKey: getHomeQueryKey() });
      void queryClient.invalidateQueries({ queryKey: getMeQueryKey() });
      void queryClient.invalidateQueries({ queryKey: getMyTicketsQueryKey() });
      void queryClient.invalidateQueries({
        predicate: (query) =>
          typeof query.queryKey[0] === "string" &&
          query.queryKey[0].endsWith(JOIN_PREVIEW_PATH_SUFFIX),
      });
    },
    onError: (error) => {
      toast.error(getSubmitErrorMessage(error));
    },
  });

  async function submit(): Promise<boolean> {
    if (mutation.isPending) {
      return false;
    }

    try {
      await mutation.mutateAsync();
      return true;
    } catch {
      return false;
    }
  }

  return {
    submit,
    isPending: mutation.isPending,
    isReady: formConfig.data !== undefined,
  };
}
