"use client";

/**
 * 홈 화면 상태 확인용 임시 페이지. 팀 공유를 위해 브랜치에만 올려두고 머지 전에 삭제한다.
 *
 * 상태 전환 버튼은 프레임 밖(데스크탑 여백)에 fixed로 띄운다. 흐름에 참여하지 않아 화면을
 * 밀지 않고, 프레임을 덮지도 않는다. 화면 CSS는 루트 레이아웃의 app-frame을 그대로 타므로
 * 실제 페이지와 같다 — 문서는 스크롤되지 않고 프레임 안쪽 영역만 스크롤한다.
 */

import { useState } from "react";
import imageDummy from "@/shared/assets/dummy-image.png";
import { AppShell } from "@/shared/components/AppShell/AppShell";
import type { CurrentPosition } from "@/shared/hooks/useCurrentPosition";
import { cn } from "@/shared/utils/cn";
import { HomeView } from "../../_components/HomeView";
import type { FeedReview, HomeRecommendedGroup, HomeSummary } from "../../_model/home";

/**
 * 좁은 화면에서는 좌상단에 겹쳐 두고, 프레임보다 넓은 화면에서는 프레임 왼쪽 여백으로 보낸다.
 * 215 = --layout-frame-max(430)의 절반. 미디어쿼리와 마찬가지로 var를 쓸 수 없어 값으로 둔다.
 */
const SWITCHER = [
  "fixed top-ds-12 left-ds-12 z-overlay flex w-[168px] flex-col gap-ds-4",
  "min-[431px]:left-auto min-[431px]:right-[calc(50%_+_215px_+_var(--spacing-ds-16))]",
].join(" ");

const GRANTED: CurrentPosition = { status: "granted", latitude: 37.5445, longitude: 126.9506 };
const BROKEN_IMAGE_URL = "/image-not-found.png";

/** mock 서버가 미가입 유저(user 9)에게 실제로 내려주는 값. */
const RECOMMENDED: HomeRecommendedGroup[] = [
  {
    id: "group_3",
    name: "혜인표 맛집",
    description: "동작 확인용",
    imageUrl: "https://picsum.photos/seed/tmt-g3/656/818",
    memberCount: 1,
    reviewCount: 2,
    placeCount: 2,
    matchedCount: 0,
  },
  {
    id: "group_1",
    name: "나는야 초밥왕",
    description: "회전 초밥부터 오마카세까지",
    imageUrl: null,
    memberCount: 1,
    reviewCount: 0,
    placeCount: 0,
    matchedCount: 0,
  },
  {
    id: "group_2",
    name: "성수 커피 탐험대",
    description: "조용히 커피 맛에 집중하는 사람들",
    imageUrl: "https://picsum.photos/seed/tmt-g2/656/818",
    memberCount: 57,
    reviewCount: 32,
    placeCount: 28,
    matchedCount: 7,
  },
];

const REVIEW: FeedReview = {
  id: "review_1",
  authorNickname: "하아얀",
  authorProfileImageUrl: null,
  rating: 5,
  distanceMeters: 505,
  photoUrls: [imageDummy.src],
  pros: "분위기가 좋아요",
  cons: "가격이 좀 나가고 웨이팅이 많아요",
  content: "맛도 있고 분위기도 좋아요. 원두도 종류가 많았어요",
  tags: [
    { id: "tag_alone", label: "혼자" },
    { id: "tag_tasty", label: "음식이 맛있어요" },
  ],
  place: { id: "place_2", name: "오즈 커피", regionName: "마포구 도화동", isFavorite: false },
};

const NOT_JOINED: HomeSummary = {
  nickname: "하아얀",
  myGroups: [],
  recommendedGroups: RECOMMENDED,
};

const JOINED: HomeSummary = {
  nickname: "하아얀",
  myGroups: [
    { id: "group_3", name: "혜인표 맛집", imageUrl: null },
    { id: "group_2", name: "성수 커피 탐험대", imageUrl: null },
  ],
  recommendedGroups: [],
};

type Scenario = {
  key: string;
  label: string;
  hideNav: boolean;
  props: Parameters<typeof HomeView>[0];
};

const SCENARIOS: Scenario[] = [
  {
    key: "not-joined",
    label: "미가입 · 추천 3",
    hideNav: false,
    props: {
      summary: NOT_JOINED,
      position: GRANTED,
      feedIsPending: false,
      feedIsError: false,
      reviews: undefined,
    },
  },
  {
    key: "not-joined-empty",
    label: "미가입 · 추천 0",
    hideNav: false,
    props: {
      summary: { ...NOT_JOINED, recommendedGroups: [] },
      position: GRANTED,
      feedIsPending: false,
      feedIsError: false,
      reviews: undefined,
    },
  },
  {
    key: "fallback-group-card",
    label: "fallback · 추천 그룹",
    hideNav: false,
    props: {
      summary: {
        ...NOT_JOINED,
        recommendedGroups: RECOMMENDED.map((group) => ({ ...group, imageUrl: BROKEN_IMAGE_URL })),
      },
      position: GRANTED,
      feedIsPending: false,
      feedIsError: false,
      reviews: undefined,
    },
  },
  {
    key: "feed",
    label: "가입 · 피드 3",
    hideNav: true,
    props: {
      summary: JOINED,
      position: GRANTED,
      feedIsPending: false,
      feedIsError: false,
      reviews: [
        REVIEW,
        { ...REVIEW, id: "review_2", photoUrls: [], pros: null, cons: null, rating: 3 },
        { ...REVIEW, id: "review_3", distanceMeters: 1240, tags: [] },
      ],
    },
  },
  {
    key: "fallback-feed",
    label: "fallback · 피드",
    hideNav: true,
    props: {
      summary: {
        ...JOINED,
        myGroups: JOINED.myGroups.map((group) => ({ ...group, imageUrl: BROKEN_IMAGE_URL })),
      },
      position: GRANTED,
      feedIsPending: false,
      feedIsError: false,
      reviews: [
        {
          ...REVIEW,
          authorProfileImageUrl: BROKEN_IMAGE_URL,
          photoUrls: [BROKEN_IMAGE_URL],
        },
      ],
    },
  },
  {
    key: "feed-empty",
    label: "가입 · 게시물 0",
    hideNav: false,
    props: {
      summary: JOINED,
      position: GRANTED,
      feedIsPending: false,
      feedIsError: false,
      reviews: [],
    },
  },
  {
    key: "feed-pending",
    label: "가입 · 로딩",
    hideNav: false,
    props: {
      summary: JOINED,
      position: GRANTED,
      feedIsPending: true,
      feedIsError: false,
      reviews: undefined,
    },
  },
  {
    key: "feed-error",
    label: "가입 · 에러",
    hideNav: false,
    props: {
      summary: JOINED,
      position: GRANTED,
      feedIsPending: false,
      feedIsError: true,
      reviews: undefined,
    },
  },
  {
    key: "no-location",
    label: "가입 · 위치 거부",
    hideNav: false,
    props: {
      summary: JOINED,
      position: { status: "unavailable" },
      feedIsPending: false,
      feedIsError: false,
      reviews: undefined,
    },
  },
];

export default function HomePreview() {
  const [key, setKey] = useState(SCENARIOS[0].key);
  const scenario = SCENARIOS.find((item) => item.key === key) ?? SCENARIOS[0];

  return (
    <>
      <AppShell tab="home" hideNav={scenario.hideNav}>
        <HomeView {...scenario.props} />
      </AppShell>

      <nav aria-label="프리뷰 상태" className={SWITCHER}>
        {SCENARIOS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setKey(item.key)}
            className={cn(
              "rounded-ds-xs px-ds-8 py-ds-4 text-left text-body-sm-medium",
              item.key === scenario.key
                ? "bg-surface-inverse text-content-interactive-inverse"
                : "bg-surface-primary text-content-secondary",
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </>
  );
}
