/** 시안 `사진 등록`의 카운터가 `n/3`이다. */
export const MAX_REVIEW_PHOTO_COUNT = 3;

/**
 * 첨부한 사진 한 장.
 *
 * 업로드 전이라 서버 식별자가 없다. `previewUrl`은 `URL.createObjectURL`로 만든 값이라
 * 목록에서 빠질 때 해제해야 하므로, 파일과 URL을 한 몸으로 묶어 소유자를 분명히 한다.
 */
export type ReviewPhoto = {
  id: string;
  file: File;
  previewUrl: string;
};
