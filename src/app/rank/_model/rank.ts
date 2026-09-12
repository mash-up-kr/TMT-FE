/** 랭킹 한 줄. 순위는 서버가 주지 않아 정렬된 목록의 위치에서 센다. */
export type RankRow = Readonly<{
  rank: number;
  userId: string;
  nickname: string;
  profileImageUrl: string | null;
  reviewCount: number;
  memberCount: number;
}>;
