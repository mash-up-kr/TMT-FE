"use client";

import { useState } from "react";
import dummyImage from "@/shared/assets/dummy-image.png";
import { ROUTES } from "@/shared/constants/routes";
import { BottomNav } from "@/shared/ui/BottomNav";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { BlankIcon, ChevronLeftIcon } from "@/shared/ui/Icons";
import { cn } from "@/shared/utils/cn";
import { FavoriteList } from "../../profile/_components/FavoriteList";
import { GroupList } from "../../profile/_components/GroupList";
import { PlaceRecommendationCard } from "../../profile/_components/PlaceRecommendationCard";
import { ProfileBody } from "../../profile/_components/ProfileBody";
import { TicketCard } from "../../profile/_components/TicketCard";
import { TicketHistoryList } from "../../profile/_components/TicketHistoryList";
import type {
  ProfileFavoriteItem,
  ProfileGroupItem,
  ProfileIdentityModel,
  ProfileTicketHistoryItem,
} from "../../profile/_model/profile";

type ProfilePreviewState =
  | "groups"
  | "groups-empty"
  | "favorites"
  | "favorites-empty"
  | "tickets"
  | "tickets-empty";

const SCENARIOS: readonly { key: ProfilePreviewState; label: string }[] = [
  { key: "groups", label: "그룹" },
  { key: "groups-empty", label: "그룹 · 빈 상태" },
  { key: "favorites", label: "좋아요" },
  { key: "favorites-empty", label: "좋아요 · 빈 상태" },
  { key: "tickets", label: "티켓" },
  { key: "tickets-empty", label: "티켓 · 빈 상태" },
];

const PROFILE: ProfileIdentityModel = {
  nickname: "하아얀",
  email: "hayaan@example.com",
  profileImageUrl: dummyImage.src,
};

const COUNTS = { reviews: 12, groups: 2, favorites: 3 } as const;

const GROUPS: readonly ProfileGroupItem[] = [
  {
    groupId: "group-1",
    name: "마포 맛집 탐험대",
    oneLineDescription: "마포구의 숨은 맛집을 함께 찾아요",
    coverImageUrl: dummyImage.src,
    matchedSavedPlaceCount: 3,
  },
  {
    groupId: "group-2",
    name: "주말 브런치 모임",
    oneLineDescription: "토요일마다 새로운 브런치 가게를 방문해요",
    coverImageUrl: null,
    matchedSavedPlaceCount: 0,
  },
];

const FAVORITES: readonly ProfileFavoriteItem[] = [
  {
    placeId: "place-1",
    name: "오즈 커피",
    roadAddress: "서울 마포구 도화길 12",
    categoryName: "카페",
    thumbnailUrl: dummyImage.src,
  },
  {
    placeId: "place-2",
    name: "또간집 식당",
    roadAddress: "서울 마포구 백범로 21",
    categoryName: null,
    thumbnailUrl: null,
  },
];

const TICKETS: readonly ProfileTicketHistoryItem[] = [
  {
    entryId: "ticket-1",
    type: "SAVE_IN_PROGRESS",
    status: "inProgress",
    saveId: "save-1",
    source: {
      kind: "place",
      placeId: "place-1",
      name: "오즈 커피",
      roadAddress: "서울 마포구 도화길 12",
    },
    occurredAt: "2026-08-27T09:00:00+09:00",
  },
  {
    entryId: "ticket-2",
    type: "REVIEW_REWARD",
    status: "settled",
    amount: 1,
    source: {
      kind: "place",
      placeId: "place-2",
      name: "또간집 식당",
      roadAddress: "서울 마포구 백범로 21",
    },
    occurredAt: "2026-08-26T18:30:00+09:00",
  },
  {
    entryId: "ticket-3",
    type: "GROUP_JOIN",
    status: "settled",
    amount: -1,
    source: { kind: "group", groupId: "group-1", name: "마포 맛집 탐험대" },
    occurredAt: "2026-08-25T12:00:00+09:00",
  },
];

const SWITCHER = [
  "fixed top-ds-12 left-ds-12 z-overlay flex w-[168px] flex-col gap-ds-4",
  "min-[431px]:left-auto min-[431px]:right-[calc(50%_+_215px_+_var(--spacing-ds-16))]",
].join(" ");

export default function ProfilePreviewPage() {
  const [state, setState] = useState<ProfilePreviewState>("groups");

  return (
    <>
      <ProfilePreviewContent state={state} />
      <nav aria-label="프로필 프리뷰 상태" className={SWITCHER}>
        {SCENARIOS.map((scenario) => (
          <button
            key={scenario.key}
            type="button"
            onClick={() => setState(scenario.key)}
            className={cn(
              "rounded-ds-xs px-ds-8 py-ds-4 text-left text-body-sm-medium",
              state === scenario.key
                ? "bg-surface-inverse text-content-interactive-inverse"
                : "bg-surface-primary text-content-secondary",
            )}
          >
            {scenario.label}
          </button>
        ))}
      </nav>
    </>
  );
}

function ProfilePreviewContent({ state }: { state: ProfilePreviewState }) {
  if (state === "tickets" || state === "tickets-empty") {
    return <TicketsPreview empty={state === "tickets-empty"} />;
  }

  const activeTab = state === "groups" || state === "groups-empty" ? "groups" : "favorites";
  const empty = state.endsWith("-empty");

  return (
    <>
      <GNB align="left" title={null} left={<BlankIcon size={28} />} />
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-surface-primary">
        <ProfileBody
          profile={PROFILE}
          activeTab={activeTab}
          basePath="/profile/me"
          counts={COUNTS}
          beforeTabs={
            <>
              <PlaceRecommendationCard />
              <TicketCard count={3} href="/preview/profile" />
            </>
          }
        >
          {activeTab === "groups" ? (
            <GroupList
              groups={empty ? [] : GROUPS}
              getGroupHref={() => "/preview/profile"}
              viewer="mine"
            />
          ) : (
            <FavoriteList
              places={empty ? [] : FAVORITES}
              getPlaceHref={() => "/preview/profile"}
              onUnfavorite={() => {}}
            />
          )}
        </ProfileBody>
      </main>
      <div className="flex shrink-0 justify-center px-ds-20 py-ds-12">
        <BottomNav
          value="my"
          tabHrefs={{
            home: ROUTES.ROOT,
            feed: ROUTES.FEED,
            group: ROUTES.GROUPS.ROOT,
            my: ROUTES.PROFILE.ME,
          }}
          createHref={ROUTES.GROUPS.NEW}
        />
      </div>
    </>
  );
}

function TicketsPreview({ empty }: { empty: boolean }) {
  return (
    <>
      <GNB
        title="내 티켓"
        left={
          <IconButton aria-label="뒤로 가기">
            <ChevronLeftIcon />
          </IconButton>
        }
      />
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-surface-primary">
        <div className="content-container py-ds-20">
          <TicketCard count={empty ? 0 : 3} />
        </div>
        <div aria-hidden="true" className="h-ds-12 shrink-0 bg-surface-secondary" />
        <TicketHistoryList
          items={empty ? [] : TICKETS}
          getSaveHref={() => "/preview/profile"}
          writeReviewHref="/reviews/new"
        />
      </main>
    </>
  );
}
