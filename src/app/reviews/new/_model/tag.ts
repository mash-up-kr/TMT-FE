export type ReviewTag = {
  id: string;
  label: string;
};

/**
 * 태그 한 묶음. 두 그룹의 구조가 같아 렌더를 한 벌로 처리하려고 데이터로 둔다.
 *
 * 아직 서버 태그가 없어 `id`는 로컬 식별자다. API가 붙으면 이 값이 서버 id로 바뀐다.
 */
export type ReviewTagGroup = {
  id: string;
  label: string;
  /** 라벨 뒤에 흐리게 붙는 보조 문구. 시안에서 색이 달라 별도 조각이다. */
  hint: string;
  tags: readonly ReviewTag[];
};
