import type { ReviewCardData } from "@/shared/model/review";
import type { GroupDetailViewData } from "../_model/groupDetail";
import groupCover from "./assets/group-cover.png";
import reviewCoffee from "./assets/review-coffee.png";
import reviewSushi from "./assets/review-sushi.png";

const GROUP_DETAIL_PAGE_FIXTURES: Record<string, GroupDetailViewData> = {
  group_1: {
    name: "성수 커피 탐험대",
    oneLineDescription: "조용히 커피 맛에 집중하는 사람들",
    description: "아직 뚫리지 않은 느좋 카페들을 다 모아보고 싶어요. 좋은 데 있으면 공유합시더.",
    coverImageUrl: groupCover.src,
    imageUrl: groupCover.src,
    memberCount: 33,
    reviewCount: 20,
    placeCount: 16,
    tags: ["카페", "성수", "성수1가"],
    matchedSavedPlaceCount: 7,
    availableTicketCount: 1,
    isJoinable: true,
    isOwner: false,
    isMember: false,
  },
  group_2: {
    name: "나는야 초밥왕",
    oneLineDescription: "회전 초밥부터 오마카세까지",
    description: "맛있는 초밥을 찾아다니는 사람들과 새로운 가게를 함께 발견해요.",
    coverImageUrl: null,
    imageUrl: null,
    memberCount: 24,
    reviewCount: 18,
    placeCount: 12,
    tags: ["일식", "서울 전체"],
    matchedSavedPlaceCount: 4,
    availableTicketCount: 1,
    isJoinable: true,
    isOwner: false,
    isMember: false,
  },
};

export const GROUP_DETAIL_PAGE_REVIEWS: ReviewCardData[] = [
  {
    id: "review_1",
    authorNickname: "하아얀",
    authorProfileImageUrl: null,
    rating: 4.5,
    distanceMeters: 500,
    photoUrls: [reviewCoffee.src],
    pros: "분위기가 좋아요",
    cons: "가격이 좀 나가고 웨이팅이 많아요",
    content:
      "맛도 있고 분위기도 좋아요. 대신 가격은 좀 나가는 것 같고 웨이팅이 많을 수도 있어요. 그래도 한 번쯤은 가볼 만해요.",
    contentLength: 67,
    tags: [
      { id: "atmosphere", label: "분위기" },
      { id: "price", label: "가격" },
      { id: "waiting", label: "웨이팅" },
    ],
    place: { id: "store_1", name: "온화 커피 성수", regionName: "성수동" },
  },
  {
    id: "review_2",
    authorNickname: "하아얀",
    authorProfileImageUrl: null,
    rating: 4.5,
    distanceMeters: 700,
    photoUrls: [reviewSushi.src],
    pros: "분위기가 좋아요",
    cons: "가격이 좀 나가고 웨이팅이 많아요",
    content:
      "맛도 있고 분위기도 좋아요. 대신 가격은 좀 나가는 것 같고 웨이팅이 많을 수도 있어요. 그래도 한 번쯤은 가볼 만해요.",
    contentLength: 67,
    tags: [
      { id: "atmosphere", label: "분위기가 좋아요" },
      { id: "waiting", label: "웨이팅이 많아요" },
    ],
    place: { id: "store_2", name: "이자카야 고쿄 강남 신논현점", regionName: "역삼동" },
  },
  {
    id: "review_3",
    authorNickname: "하아얀",
    authorProfileImageUrl: null,
    rating: 4.5,
    distanceMeters: 700,
    photoUrls: [reviewSushi.src],
    pros: "분위기가 좋아요",
    cons: "가격이 좀 나가고 웨이팅이 많아요",
    content:
      "맛도 있고 분위기도 좋아요. 대신 가격은 좀 나가는 것 같고 웨이팅이 많을 수도 있어요. 그래도 한 번쯤은 가볼 만해요.",
    contentLength: 67,
    tags: [
      { id: "atmosphere", label: "분위기가 좋아요" },
      { id: "waiting", label: "웨이팅이 많아요" },
    ],
    place: { id: "store_3", name: "이자카야 고쿄 강남 신논현점", regionName: "역삼동" },
  },
];

export function getGroupDetailPageFixture(groupId: string): GroupDetailViewData | undefined {
  return GROUP_DETAIL_PAGE_FIXTURES[groupId];
}

export function requireGroupDetailPageFixture(groupId: string): GroupDetailViewData {
  const fixture = getGroupDetailPageFixture(groupId);

  if (!fixture) {
    throw new Error(`그룹 상세 fixture를 찾을 수 없습니다: ${groupId}`);
  }

  return fixture;
}
