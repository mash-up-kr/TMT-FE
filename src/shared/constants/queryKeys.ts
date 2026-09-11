/**
 * 손으로 만든 쿼리 키. orval이 생성하지 않는 조회(무한 스크롤 등)의 키를 여기서 한 번만 정한다.
 *
 * 조회하는 훅과 무효화하는 훅이 서로 다른 계층에 있을 때, 접두사 문자열을 양쪽에 따로 적으면
 * 한쪽만 바꿔도 오류 없이 통과하고 무효화만 조용히 빠진다. 키는 한 곳에서 만들고 양쪽이 가져다
 * 쓴다. 접두사만 돌려주므로 조회 쪽은 뒤에 세부 인자를 이어 붙이고, 무효화 쪽은 이 값 그대로
 * 접두사 일치로 지운다.
 */
export function getGroupReviewsQueryKey(groupId: string) {
  return ["group-reviews", groupId] as const;
}
