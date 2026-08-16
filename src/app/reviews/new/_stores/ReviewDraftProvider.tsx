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
import { MAX_REVIEW_PHOTO_COUNT, type ReviewPhoto } from "../_model/photo";
import type { ReviewStore } from "../_model/store";

type ReviewDraftContextValue = {
  store: ReviewStore | null;
  setStore: (store: ReviewStore | null) => void;
  photos: readonly ReviewPhoto[];
  /** 남은 자리만큼만 받아들인다. 넘치는 파일은 조용히 버린다. */
  addPhotos: (files: readonly File[]) => void;
  removePhoto: (id: string) => void;
  /** 선택한 태그 id. 그룹을 가리지 않고 한 집합에 모은다 — 상한도 최소 개수도 없다. */
  selectedTagIds: ReadonlySet<string>;
  toggleTag: (id: string) => void;
  /** 0은 미선택. 시안은 5점 척도다. */
  rating: number;
  setRating: (rating: number) => void;
  reviewText: string;
  setReviewText: (text: string) => void;
};

const ReviewDraftContext = createContext<ReviewDraftContextValue | null>(null);

/**
 * 단계 라우트가 갈려도 layout은 리마운트되지 않는다. 초안을 여기에 두면
 * 뒤로가기로 이전 단계에 돌아가도 입력이 남는다(시안 주석 요구사항).
 *
 * 사진의 미리보기 URL도 여기서 만들고 해제한다. 목록의 소유자와 URL의 소유자가 갈리면
 * 어느 쪽이 해제할 차례인지 알 수 없어진다.
 */
export function ReviewDraftProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [store, setStore] = useState<ReviewStore | null>(null);
  const [photos, setPhotos] = useState<readonly ReviewPhoto[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<ReadonlySet<string>>(() => new Set());
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // 언마운트 시점에 남아 있는 URL을 해제하려면 최신 목록을 알아야 한다.
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
    setPhotos((current) => {
      const room = MAX_REVIEW_PHOTO_COUNT - current.length;

      if (room <= 0) {
        return current;
      }

      const added = files.slice(0, room).map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      return [...current, ...added];
    });
  }, []);

  const removePhoto = useCallback((id: string) => {
    setPhotos((current) => {
      const removed = current.find((photo) => photo.id === id);

      if (removed === undefined) {
        return current;
      }

      URL.revokeObjectURL(removed.previewUrl);

      return current.filter((photo) => photo.id !== id);
    });
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
      selectedTagIds,
      toggleTag,
      rating,
      setRating,
      reviewText,
      setReviewText,
    }),
    [store, photos, addPhotos, removePhoto, selectedTagIds, toggleTag, rating, reviewText],
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
