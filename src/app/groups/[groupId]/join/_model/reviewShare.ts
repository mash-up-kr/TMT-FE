/** 공유 선택 목록의 한 줄. 체크할 리뷰를 알아보는 데 필요한 것만 담는다. */
export type ReviewShareItem = Readonly<{
  reviewId: string;
  placeName: string;
  /** 리뷰의 첫 사진. 사진 없는 리뷰는 없다 (C4-1·R11) — 서버가 대체 이미지를 채우지 않는다. */
  thumbnailUrl: string | null;
  contentPreview: string;
}>;
