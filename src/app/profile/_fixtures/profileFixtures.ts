/** 화면 모델이 아니라 계약 응답 모양으로 둔다. 생성 client가 나오면 이 폴더를 지운다. */

import dummy from "@/shared/assets/dummy.png";
import dummyImage from "@/shared/assets/dummy-image.png";
import dummyProfile from "@/shared/assets/dummy-profile.png";
import type {
  CursorPage,
  MeResponse,
  ProfileFavoriteResponse,
  ProfileGroupResponse,
  ProfileReviewResponse,
  TicketHistoryResponse,
  UserResponse,
} from "./contract";

const page = <T>(items: T[]): CursorPage<T> => ({ items, nextCursor: null, hasNext: false });

export const ME: MeResponse = {
  userId: "user_1",
  nickname: "조용한 미식가",
  email: "ayanha@gmail.com",
  profileImageUrl: dummyProfile.src,
  availableTicketCount: 4,
  reviewCount: 12,
  joinedGroupCount: 3,
  favoritePlaceCount: 4,
};

export const OTHER_USER: UserResponse = {
  userId: "user_7",
  nickname: "매운맛 탐험가",
  profileImageUrl: null,
  reviewCount: 8,
  joinedGroupCount: 4,
  favoritePlaceCount: 4,
};

const PLACE_NAMES = ["델리스피자", "한판승부", "성수당", "오즈 커피"] as const;
const CATEGORIES = ["양식", "한식", "디저트", null] as const;

function reviews(count: number, withSaveId: boolean): ProfileReviewResponse[] {
  return Array.from({ length: count }, (_, index) => ({
    reviewId: `review_${index + 1}`,
    ...(withSaveId ? { saveId: `save_${index + 1}` } : {}),
    thumbnailUrl: dummyImage.src,
    place: {
      placeId: `place_${(index % PLACE_NAMES.length) + 1}`,
      name: PLACE_NAMES[index % PLACE_NAMES.length],
      categoryName: CATEGORIES[index % CATEGORIES.length],
    },
    createdAt: `2026-08-${String(20 - index).padStart(2, "0")}T09:11:03.412Z`,
  }));
}

export const MY_REVIEWS = page(reviews(6, true));
export const OTHER_REVIEWS = page(reviews(4, false));

const GROUP_SEEDS = [
  { name: "성수 커피 탐험대", description: "조용히 커피 맛에 집중하는 사람들", matched: 7 },
  { name: "마포 점심 원정대", description: "회사 근처 점심 맛집만 모읍니다", matched: 3 },
  { name: "주말 빵지순례", description: "빵 하나로 하루를 채우는 모임", matched: 0 },
  { name: "야식 연구회", description: "밤에만 열리는 맛집을 찾습니다", matched: 12 },
] as const;

function groups(count: number): ProfileGroupResponse[] {
  return GROUP_SEEDS.slice(0, count).map((seed, index) => ({
    groupId: `group_${index + 1}`,
    name: seed.name,
    oneLineDescription: seed.description,
    coverImageUrl: index === 2 ? null : dummy.src,
    memberCount: 12 + index * 7,
    reviewCount: 30 + index * 5,
    placeCount: 8 + index,
    matchedSavedPlaceCount: seed.matched,
  }));
}

export const MY_GROUPS = page(groups(3));
export const OTHER_GROUPS = page(groups(4));

function favorites(count: number, viewerFavorited: boolean): ProfileFavoriteResponse[] {
  return Array.from({ length: count }, (_, index) => ({
    placeId: `place_${index + 1}`,
    name: PLACE_NAMES[index % PLACE_NAMES.length],
    roadAddress: "서울 마포구 도화동 200-14",
    regionName: "마포구 도화동",
    categoryName: CATEGORIES[index % CATEGORIES.length],
    averageRating: 4.2,
    reviewCount: 18 + index,
    thumbnailUrl: index === 1 ? null : dummyImage.src,
    distanceMeters: null,
    isFavorite: viewerFavorited ? true : index % 2 === 0,
  }));
}

export const MY_FAVORITES = page(favorites(4, true));
export const OTHER_FAVORITES = page(favorites(4, false));

/** 출처 세 갈래(매장·그룹·없음)를 모두 담는다. */
export const MY_TICKETS: TicketHistoryResponse = {
  availableCount: 4,
  ...page([
    {
      entryId: "tkh_1",
      type: "SAVE_IN_PROGRESS" as const,
      amount: null,
      saveId: "save_7",
      place: { placeId: "place_2", name: "한판승부", roadAddress: "서울 은평구 갈현동 403-38" },
      group: null,
      occurredAt: "2026-08-19T09:11:03.412Z",
    },
    {
      entryId: "tkh_2",
      type: "REVIEW_REWARD" as const,
      amount: 1,
      saveId: "save_6",
      place: { placeId: "place_1", name: "델리스피자", roadAddress: "서울 마포구 도화동 200-14" },
      group: null,
      occurredAt: "2026-08-18T09:11:03.412Z",
    },
    {
      entryId: "tkh_3",
      type: "GROUP_JOIN" as const,
      amount: -1,
      saveId: null,
      place: null,
      group: { groupId: "group_1", name: "성수 커피 탐험대" },
      occurredAt: "2026-08-17T09:11:03.412Z",
    },
    {
      entryId: "tkh_4",
      type: "REVIEW_DELETE_REVOKE" as const,
      amount: -1,
      saveId: null,
      place: { placeId: "place_3", name: "성수당", roadAddress: "서울 성동구 성수동 12-3" },
      group: null,
      occurredAt: "2026-08-16T09:11:03.412Z",
    },
    {
      entryId: "tkh_5",
      type: "SIGNUP_REWARD" as const,
      amount: 1,
      saveId: null,
      place: null,
      group: null,
      occurredAt: "2026-08-15T09:11:03.412Z",
    },
  ]),
};

export const EMPTY_PAGE = page([]);

export const EMPTY_TICKETS: TicketHistoryResponse = { availableCount: 0, ...page([]) };
