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
import { MAX_REVIEW_PHOTO_COUNT, MAX_REVIEW_PHOTO_SIZE_BYTES } from "../_constants/review";
import type { ReviewDraftSnapshot } from "../_model/draft";
import type { ReviewPhoto } from "../_model/photo";
import type { ReviewStore } from "../_model/store";

type ReviewDraftContextValue = {
  store: ReviewStore | null;
  setStore: (store: ReviewStore | null) => void;
  photos: readonly ReviewPhoto[];
  /**
   * 형식·용량 때문에 거른 파일은 이유별로 토스트를 띄운다.
   *
   * 개수 상한은 남은 자리보다 많이 넘어올 때를 위한 방어선이다. 입력이 한 번에 한 장만 받게 된 뒤로
   * UI에서는 닿지 않지만, 상한을 지키는 책임은 목록을 소유한 여기에 남겨 둔다.
   */
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

const NON_IMAGE_MESSAGE = "이미지 파일만 업로드할 수 있어요";
const OVERSIZE_MESSAGE = "5MB 이하 사진만 업로드할 수 있어요";

const ReviewDraftContext = createContext<ReviewDraftContextValue | null>(null);

/**
 * 단계 라우트가 갈려도 layout은 리마운트되지 않는다. 초안을 여기에 두면
 * 뒤로가기로 이전 단계에 돌아가도 입력이 남는다(시안 주석 요구사항).
 *
 * 사진의 미리보기 URL도 여기서 만들고 해제한다. 목록의 소유자와 URL의 소유자가 갈리면
 * 어느 쪽이 해제할 차례인지 알 수 없어진다.
 *
 * `initialDraft`는 마운트 시점에 한 번만 읽는다. 이후 값이 바뀌어도 편집 중인 내용을 덮지
 * 않는다 — 이어쓰기에서 재조회가 일어나도 사용자가 방금 고친 입력이 되돌아가면 안 된다.
 * 다른 초안을 열면 라우트가 갈려 Provider가 새로 마운트되므로 초기값도 다시 읽힌다.
 */
export function ReviewDraftProvider({
  initialDraft,
  children,
}: Readonly<{ initialDraft?: ReviewDraftSnapshot; children: ReactNode }>) {
  const [store, setStore] = useState<ReviewStore | null>(initialDraft?.store ?? null);
  const [photos, setPhotos] = useState<readonly ReviewPhoto[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<ReadonlySet<string>>(
    () => new Set(initialDraft?.selectedTagIds),
  );
  const [rating, setRating] = useState(initialDraft?.rating ?? 0);
  const [reviewText, setReviewText] = useState(initialDraft?.reviewText ?? "");

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
    // `accept="image/*"`는 파일 선택창의 힌트일 뿐이라 형식과 용량을 여기서 다시 본다.
    const images = files.filter((file) => file.type.startsWith("image/"));
    const withinSizeLimit = images.filter((file) => file.size <= MAX_REVIEW_PHOTO_SIZE_BYTES);

    // 거른 이유마다 사용자가 취할 행동이 달라서 안내를 합치지 않는다.
    // 형식이 틀린 파일에 용량을 말하면 줄여도 해결되지 않는 길로 안내하게 된다.
    if (images.length < files.length) {
      toast.error(NON_IMAGE_MESSAGE);
    }

    if (withinSizeLimit.length < images.length) {
      toast.error(OVERSIZE_MESSAGE);
    }

    // 음수면 slice가 뒤에서 잘라 오히려 파일을 통과시키므로 0으로 막는다.
    const room = Math.max(0, MAX_REVIEW_PHOTO_COUNT - photosRef.current.length);
    const accepted = withinSizeLimit.slice(0, room);

    if (accepted.length === 0) {
      return;
    }

    // URL은 updater 밖에서 만든다. React는 updater를 여러 번 부를 수 있어서 안에서 만들면
    // 버려지는 URL이 생기고, 목록에 남지 않은 그 URL은 아무도 해제하지 못한다.
    const added = accepted.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setPhotos((current) => [...current, ...added]);
  }, []);

  const removePhoto = useCallback((id: string) => {
    const removed = photosRef.current.find((photo) => photo.id === id);

    if (removed === undefined) {
      return;
    }

    // addPhotos와 같은 이유로 해제도 updater 밖에서 한 번만 한다.
    URL.revokeObjectURL(removed.previewUrl);

    setPhotos((current) => current.filter((photo) => photo.id !== id));
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
