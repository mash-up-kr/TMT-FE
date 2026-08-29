"use client";

import { useIsMutating, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { ReviewFormConfigResponse } from "@/api/gen/_model/reviewFormConfigResponse.gen";
import type { SaveDetailResponse } from "@/api/gen/_model/saveDetailResponse.gen";
import { getFeedQueryKey, getHomeQueryKey } from "@/api/gen/home/home.gen";
import { getNearbyReviewsQueryKey } from "@/api/gen/nearby/nearby.gen";
import { getPlaceReviewsQueryKey } from "@/api/gen/place-detail/place-detail.gen";
import {
  getMeQueryKey,
  getMyReviewsQueryKey,
  getMyTicketsQueryKey,
} from "@/api/gen/profile/profile.gen";
import { useReviewFormConfig } from "@/api/gen/review-write/review-write.gen";
import {
  getGetSaveQueryKey,
  getListSavesQueryKey,
  getSave,
  useCreateSave,
  useUpdateSave,
} from "@/api/gen/save/save.gen";
import { getTmtApiErrorTitle, TmtApiError } from "@/api/mutator";
import { ROUTES } from "@/shared/constants/routes";
import { toast } from "@/shared/ui/Toast";
import {
  draftReviewBasePath,
  REVIEW_FLOW_EXIT_PATH,
  type ReviewStepSegment,
  reviewCompletePath,
  reviewStepPath,
} from "../_constants/steps";
import { useReviewDraft } from "../_stores/ReviewDraftProvider";
import { useReviewFlowBase, useReviewFlowSaveId } from "../_stores/ReviewFlowBaseProvider";
import {
  ReviewSaveMappingError,
  toCreateSaveRequest,
  toReviewSaveResult,
  toUpdateSaveRequest,
} from "../_utils/reviewApiMappers";
import { ReviewPhotoUploadError, uploadReviewPhoto } from "../_utils/uploadReviewPhoto";

const EMPTY_TAG_CONFIG: Pick<ReviewFormConfigResponse, "companionTags" | "positivePointTags"> = {
  companionTags: [],
  positivePointTags: [],
};

const JOIN_PREVIEW_PATH_SUFFIX = "/join-preview";

const SAVE_FAILED_MESSAGE = "리뷰를 저장하지 못했어요. 다시 시도해 주세요";
const PHOTO_DRAFT_MESSAGE = "사진이 있는 리뷰는 아직 이어 쓸 수 없어요";
const STALE_SAVE_CODES = new Set(["SAVE_ALREADY_REVIEWED", "SAVE_NOT_FOUND"]);
const REVIEW_SAVE_MUTATION_KEY = ["reviewSaveFlow"] as const;

class ReviewSaveRedirect extends Error {}

function isStaleSaveError(error: unknown) {
  return (
    error instanceof TmtApiError &&
    typeof error.body === "object" &&
    error.body !== null &&
    "code" in error.body &&
    typeof error.body.code === "string" &&
    STALE_SAVE_CODES.has(error.body.code)
  );
}

export function useReviewSave() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const basePath = useReviewFlowBase();
  const saveId = useReviewFlowSaveId();
  const {
    store,
    photos,
    setPhotoAssetId,
    attachedPhotoCount,
    setAttachedPhotoCount,
    selectedTagIds,
    rating,
    reviewText,
    setSaveResult,
  } = useReviewDraft();
  const formConfig = useReviewFormConfig();
  const createSave = useCreateSave();
  const updateSave = useUpdateSave();
  const saveFlow = useMutation({
    mutationKey: REVIEW_SAVE_MUTATION_KEY,
    mutationFn: (action: () => Promise<void>) => action(),
  });
  const activeSaveMutations = useIsMutating({
    mutationKey: REVIEW_SAVE_MUTATION_KEY,
  });

  const snapshot = {
    store,
    selectedTagIds: [...selectedTagIds],
    rating,
    reviewText,
  };

  const resolveTagConfig = async () => {
    if (formConfig.data !== undefined) {
      return formConfig.data;
    }

    if (selectedTagIds.size === 0) {
      return EMPTY_TAG_CONFIG;
    }

    const result = await formConfig.refetch();

    if (result.data === undefined) {
      throw new ReviewSaveMappingError("태그 정보를 불러온 뒤 다시 시도해 주세요");
    }

    return result.data;
  };

  const invalidateDraftList = () => {
    void queryClient.invalidateQueries({ queryKey: getListSavesQueryKey() });
  };

  const invalidateCompletedReviewQueries = (placeId: string) => {
    void queryClient.invalidateQueries({ queryKey: getListSavesQueryKey() });
    void queryClient.invalidateQueries({ queryKey: getMyReviewsQueryKey() });
    void queryClient.invalidateQueries({ queryKey: getMyTicketsQueryKey() });
    void queryClient.invalidateQueries({ queryKey: getMeQueryKey() });
    void queryClient.invalidateQueries({ queryKey: getHomeQueryKey() });
    void queryClient.invalidateQueries({ queryKey: getFeedQueryKey() });
    void queryClient.invalidateQueries({ queryKey: getNearbyReviewsQueryKey() });
    void queryClient.invalidateQueries({ queryKey: getPlaceReviewsQueryKey(placeId) });
    void queryClient.invalidateQueries({
      predicate: (query) =>
        typeof query.queryKey[0] === "string" &&
        query.queryKey[0].endsWith(JOIN_PREVIEW_PATH_SUFFIX),
    });
  };

  const resolvePhotoAssetIds = async () => {
    const results = await Promise.allSettled(
      photos.map(async (photo) => {
        if (photo.assetId !== null) {
          return photo.assetId;
        }

        const assetId = await uploadReviewPhoto(photo.file);
        setPhotoAssetId(photo.id, assetId);
        return assetId;
      }),
    );
    const failure = results.find((result) => result.status === "rejected");

    if (failure?.status === "rejected") {
      throw failure.reason;
    }

    return results.flatMap((result) => (result.status === "fulfilled" ? [result.value] : []));
  };

  const persist = async (includePhotos = false) => {
    const config = await resolveTagConfig();

    if (saveId !== null) {
      // ponytail: API에 version/ETag가 없어 GET-PUT 사이는 원자적이지 않다.
      // 백엔드가 조건부 갱신을 제공하면 이 사전 확인을 If-Match로 교체한다.
      const latestSave = await getSave(saveId);

      if (latestSave.reviewId !== null && latestSave.reviewId !== undefined) {
        queryClient.setQueryData(getGetSaveQueryKey(saveId), latestSave);
        router.replace(reviewCompletePath(draftReviewBasePath(saveId)));
        throw new ReviewSaveRedirect();
      }

      if (latestSave.photos.length !== attachedPhotoCount) {
        throw new ReviewSaveMappingError(PHOTO_DRAFT_MESSAGE);
      }
    }

    const photoAssetIds =
      includePhotos || attachedPhotoCount > 0 ? await resolvePhotoAssetIds() : undefined;
    const result =
      saveId === null
        ? await createSave.mutateAsync({
            data: toCreateSaveRequest(snapshot, config, photoAssetIds),
          })
        : await updateSave.mutateAsync({
            saveId,
            data: toUpdateSaveRequest(snapshot, config, photoAssetIds),
          });

    if (saveId !== null && photoAssetIds !== undefined) {
      setAttachedPhotoCount(photoAssetIds.length);
    }

    if (result.reviewId === null || result.reviewId === undefined) {
      invalidateDraftList();
    } else {
      queryClient.setQueryData<SaveDetailResponse>(getGetSaveQueryKey(result.saveId), (current) =>
        current === undefined ? current : { ...current, reviewId: result.reviewId },
      );
      setSaveResult(toReviewSaveResult(result));
      invalidateCompletedReviewQueries(result.placeId);
    }

    return result;
  };

  const run = async (action: () => Promise<void>) => {
    if (queryClient.isMutating({ mutationKey: REVIEW_SAVE_MUTATION_KEY }) > 0) {
      return;
    }

    try {
      await saveFlow.mutateAsync(action);
    } catch (error) {
      if (error instanceof ReviewSaveRedirect) {
        return;
      }

      if (isStaleSaveError(error) && saveId !== null) {
        queryClient.removeQueries({ queryKey: getGetSaveQueryKey(saveId) });
        void queryClient.invalidateQueries({ queryKey: getListSavesQueryKey() });
        toast.error(getTmtApiErrorTitle(error) ?? SAVE_FAILED_MESSAGE);
        router.replace(ROUTES.REVIEWS.CONTINUE);
        return;
      }

      toast.error(
        getTmtApiErrorTitle(error) ??
          (error instanceof ReviewSaveMappingError || error instanceof ReviewPhotoUploadError
            ? error.message
            : SAVE_FAILED_MESSAGE),
      );
    }
  };

  const goToResult = (result: Awaited<ReturnType<typeof persist>>, nextStep: ReviewStepSegment) => {
    const nextBasePath = draftReviewBasePath(result.saveId);

    if (result.reviewId !== null && result.reviewId !== undefined) {
      router.replace(reviewCompletePath(nextBasePath));
      return;
    }

    const nextPath = reviewStepPath(nextBasePath, nextStep);
    if (saveId === null || basePath !== nextBasePath) {
      router.replace(nextPath);
    } else {
      router.push(nextPath);
    }
  };

  return {
    isPending: activeSaveMutations > 0,
    // ponytail: 상세 응답이 assetId를 돌려주지 않아 새 사진은 완료 시점에만 처음 붙인다.
    // 백엔드가 assetId를 제공하면 체크포인트와 재진입에서도 사진을 복원한다.
    saveAndGo: (nextStep: ReviewStepSegment) =>
      run(async () => goToResult(await persist(), nextStep)),
    complete: () =>
      run(async () => {
        const result = await persist(photos.length > 0);
        router.replace(reviewCompletePath(draftReviewBasePath(result.saveId)));
      }),
    saveAndExit: () =>
      run(async () => {
        if (store !== null) {
          const result = await persist();

          if (result.reviewId !== null && result.reviewId !== undefined) {
            router.replace(reviewCompletePath(draftReviewBasePath(result.saveId)));
            return;
          }
        }
        router.replace(REVIEW_FLOW_EXIT_PATH);
      }),
  };
}
