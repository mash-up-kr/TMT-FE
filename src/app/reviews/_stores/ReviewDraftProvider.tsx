"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "@/shared/ui/Toast";
import {
  MAX_REVIEW_PHOTO_COUNT,
  MAX_REVIEW_PHOTO_SIZE_BYTES,
  REVIEW_PHOTO_CONTENT_TYPES,
} from "../_constants/review";
import type { ReviewDraftSnapshot } from "../_model/draft";
import type { ReviewPhoto } from "../_model/photo";
import type { ReviewSaveResult } from "../_model/save";
import type { ReviewStore } from "../_model/store";

type ReviewDraftContextValue = {
  store: ReviewStore | null;
  setStore: (store: ReviewStore | null) => void;
  photos: readonly ReviewPhoto[];
  addPhotos: (files: readonly File[]) => void;
  removePhoto: (id: string) => void;
  setPhotoAssetId: (id: string, assetId: string) => void;
  attachedPhotoCount: number;
  setAttachedPhotoCount: (count: number) => void;
  selectedTagIds: ReadonlySet<string>;
  toggleTag: (id: string) => void;
  rating: number;
  setRating: (rating: number) => void;
  reviewText: string;
  setReviewText: (text: string) => void;
  saveResult: ReviewSaveResult | null;
  setSaveResult: (result: ReviewSaveResult | null) => void;
};

const NON_IMAGE_MESSAGE = "JPG, PNG, WEBP 형식의 이미지만 업로드할 수 있어요";
const OVERSIZE_MESSAGE = "5MB 이하 사진만 업로드할 수 있어요";
const ALLOWED_PHOTO_TYPES = new Set<string>(REVIEW_PHOTO_CONTENT_TYPES);

const ReviewDraftContext = createContext<ReviewDraftContextValue | null>(null);

/**
 * `initialDraft`는 마운트 때 한 번만 읽는다. 재조회로 값이 바뀌어도 편집 중인 입력을 덮지 않기
 * 위해서다. 다른 초안을 열면 라우트가 갈려 새로 마운트되므로 그때 다시 읽힌다.
 */
export function ReviewDraftProvider({
  initialDraft,
  children,
}: Readonly<{ initialDraft?: ReviewDraftSnapshot; children: ReactNode }>) {
  const [store, setStore] = useState<ReviewStore | null>(initialDraft?.store ?? null);
  const [photos, setPhotos] = useState<readonly ReviewPhoto[]>([]);
  const [attachedPhotoCount, setAttachedPhotoCount] = useState(0);
  const [selectedTagIds, setSelectedTagIds] = useState<ReadonlySet<string>>(
    () => new Set(initialDraft?.selectedTagIds),
  );
  const [rating, setRating] = useState(initialDraft?.rating ?? 0);
  const [reviewText, setReviewText] = useState(initialDraft?.reviewText ?? "");
  const [saveResult, setSaveResult] = useState<ReviewSaveResult | null>(null);

  // cleanup과 addPhotos/removePhoto가 updater 밖에서 최신 목록을 읽기 위한 ref.
  // updater 안에서 URL을 만들거나 해제하면 React가 updater를 다시 돌릴 때 중복 생성·해제된다.
  const photosRef = useRef(photos);
  photosRef.current = photos;

  useEffect(() => {
    return () => {
      for (const photo of photosRef.current) {
        URL.revokeObjectURL(photo.previewUrl);
      }
    };
  }, []);

  const addPhotos = useCallback((files: readonly File[]) => {
    const images = files.filter((file) => ALLOWED_PHOTO_TYPES.has(file.type));
    const withinSizeLimit = images.filter((file) => file.size <= MAX_REVIEW_PHOTO_SIZE_BYTES);

    if (images.length < files.length) {
      toast.error(NON_IMAGE_MESSAGE);
    }

    if (withinSizeLimit.length < images.length) {
      toast.error(OVERSIZE_MESSAGE);
    }

    const room = Math.max(0, MAX_REVIEW_PHOTO_COUNT - photosRef.current.length);
    const accepted = withinSizeLimit.slice(0, room);

    if (accepted.length === 0) {
      return;
    }

    // updater는 재실행될 수 있으므로 object URL은 밖에서 한 번만 만든다.
    const added = accepted.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      assetId: null,
    }));

    setPhotos((current) => [...current, ...added]);
  }, []);

  const removePhoto = useCallback((id: string) => {
    const removed = photosRef.current.find((photo) => photo.id === id);

    if (removed === undefined) {
      return;
    }

    URL.revokeObjectURL(removed.previewUrl);

    setPhotos((current) => current.filter((photo) => photo.id !== id));
  }, []);

  const setPhotoAssetId = useCallback((id: string, assetId: string) => {
    setPhotos((current) =>
      current.map((photo) => (photo.id === id ? { ...photo, assetId } : photo)),
    );
  }, []);

  const toggleTag = useCallback((id: string) => {
    setSelectedTagIds((current) => {
      const next = new Set(current);

      if (!next.delete(id)) {
        next.add(id);
      }

      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      store,
      setStore,
      photos,
      addPhotos,
      removePhoto,
      setPhotoAssetId,
      attachedPhotoCount,
      setAttachedPhotoCount,
      selectedTagIds,
      toggleTag,
      rating,
      setRating,
      reviewText,
      setReviewText,
      saveResult,
      setSaveResult,
    }),
    [
      store,
      photos,
      addPhotos,
      removePhoto,
      setPhotoAssetId,
      attachedPhotoCount,
      selectedTagIds,
      toggleTag,
      rating,
      reviewText,
      saveResult,
    ],
  );

  return <ReviewDraftContext.Provider value={value}>{children}</ReviewDraftContext.Provider>;
}

export function useReviewDraft() {
  const value = useContext(ReviewDraftContext);

  if (value === null) {
    throw new Error("useReviewDraft는 ReviewDraftProvider 안에서만 쓸 수 있다.");
  }

  return value;
}
