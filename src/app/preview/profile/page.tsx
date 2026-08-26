"use client";

import { useState } from "react";
import { BottomNavScreenLayout } from "@/shared/components/BottomNavScreenLayout";
import { ScreenLayout } from "@/shared/components/ScreenLayout";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { BlankIcon, CancelIcon, ChevronLeftIcon } from "@/shared/ui/Icons";
import { cn } from "@/shared/utils/cn";
import { PlaceRecommendationCard } from "../../profile/_components/PlaceRecommendationCard";
import { ProfileBody } from "../../profile/_components/ProfileBody";
import { ProfileTabBody } from "../../profile/_components/ProfileTabBody";
import { TicketCard } from "../../profile/_components/TicketCard";
import { TicketHistoryList } from "../../profile/_components/TicketHistoryList";
import * as fixtures from "../../profile/_fixtures/profileFixtures";
import type { ProfileTabResponses } from "../../profile/_hooks/profileTabPage";
import { toProfileTabPage } from "../../profile/_hooks/profileTabPage";
import { PROFILE_TABS, type ProfileTab, type ProfileViewer } from "../../profile/_model/profile";
import {
  toProfileIdentity,
  toProfileTabCounts,
  toTicketHistoryItems,
} from "../../profile/_utils/profileMappers";

const PREVIEW_HREF = "/preview/profile";

const RESPONSES: Record<ProfileViewer, ProfileTabResponses> = {
  mine: {
    reviews: fixtures.MY_REVIEWS,
    groups: fixtures.MY_GROUPS,
    favorites: fixtures.MY_FAVORITES,
  },
  other: {
    reviews: fixtures.OTHER_REVIEWS,
    groups: fixtures.OTHER_GROUPS,
    favorites: fixtures.OTHER_FAVORITES,
  },
};

const EMPTY_RESPONSES: ProfileTabResponses = {
  reviews: fixtures.EMPTY_PAGE,
  groups: fixtures.EMPTY_PAGE,
  favorites: fixtures.EMPTY_PAGE,
};

const SUMMARY_RESPONSES = { mine: fixtures.ME, other: fixtures.OTHER_USER } as const;

const VIEWERS = [
  { viewer: "mine", label: "내" },
  { viewer: "other", label: "타인" },
] as const satisfies readonly { viewer: ProfileViewer; label: string }[];

const TAB_LABELS: Record<ProfileTab, string> = {
  reviews: "리뷰",
  groups: "그룹",
  favorites: "좋아요",
};

type ProfileScenario = {
  key: string;
  label: string;
  viewer: ProfileViewer;
  tab: ProfileTab;
  isEmpty: boolean;
};

const PROFILE_SCENARIOS: readonly ProfileScenario[] = VIEWERS.flatMap(({ viewer, label }) =>
  PROFILE_TABS.flatMap((tab) =>
    [false, true].map((isEmpty) => ({
      key: `${viewer}-${tab}${isEmpty ? "-empty" : ""}`,
      label: `${label} · ${TAB_LABELS[tab]}${isEmpty ? " · 빈 상태" : ""}`,
      viewer,
      tab,
      isEmpty,
    })),
  ),
);

const TICKET_SCENARIOS = [
  { key: "tickets", label: "티켓", isEmpty: false },
  { key: "tickets-empty", label: "티켓 · 빈 상태", isEmpty: true },
] as const;

const SCENARIO_KEYS = [
  ...PROFILE_SCENARIOS.map((scenario) => scenario.key),
  ...TICKET_SCENARIOS.map((scenario) => scenario.key),
];

const SWITCHER = [
  "fixed top-ds-12 left-ds-12 z-overlay flex max-h-[calc(100dvh-var(--spacing-ds-24))] w-[152px] flex-col gap-ds-2 overflow-y-auto",
  "min-[431px]:left-auto min-[431px]:right-[calc(50%_+_215px_+_var(--spacing-ds-16))]",
].join(" ");

export default function ProfilePreviewPage() {
  const [scenarioKey, setScenarioKey] = useState(SCENARIO_KEYS[0]);

  return (
    <>
      <ProfilePreviewContent scenarioKey={scenarioKey} />
      <nav aria-label="프로필 프리뷰 상태" className={SWITCHER}>
        {[...PROFILE_SCENARIOS, ...TICKET_SCENARIOS].map((scenario) => (
          <button
            key={scenario.key}
            type="button"
            onClick={() => setScenarioKey(scenario.key)}
            className={cn(
              "rounded-ds-xs px-ds-8 py-ds-4 text-left text-body-sm-medium",
              scenarioKey === scenario.key
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

function ProfilePreviewContent({ scenarioKey }: { scenarioKey: string }) {
  const ticketScenario = TICKET_SCENARIOS.find((scenario) => scenario.key === scenarioKey);
  if (ticketScenario) {
    return <TicketsPreview isEmpty={ticketScenario.isEmpty} />;
  }

  const scenario = PROFILE_SCENARIOS.find((candidate) => candidate.key === scenarioKey);
  if (!scenario) {
    return null;
  }

  return <ProfilePreview scenario={scenario} />;
}

function ProfilePreview({ scenario }: { scenario: ProfileScenario }) {
  const { viewer, tab, isEmpty } = scenario;
  const summaryResponse = SUMMARY_RESPONSES[viewer];
  const page = toProfileTabPage(tab, isEmpty ? EMPTY_RESPONSES : RESPONSES[viewer], viewer);

  const body = (
    <ProfileBody
      profile={toProfileIdentity(summaryResponse)}
      counts={toProfileTabCounts(summaryResponse)}
      activeTab={tab}
      basePath={PREVIEW_HREF}
      beforeTabs={
        viewer === "mine" && (
          <>
            <PlaceRecommendationCard />
            <TicketCard count={fixtures.ME.availableTicketCount} href={PREVIEW_HREF} />
          </>
        )
      }
    >
      <ProfileTabBody
        page={page}
        viewer={viewer}
        getGroupHref={() => PREVIEW_HREF}
        getPlaceHref={() => PREVIEW_HREF}
        onSelectReview={() => {}}
        onUnfavorite={viewer === "mine" ? () => {} : undefined}
      />
    </ProfileBody>
  );

  if (viewer === "other") {
    return (
      <ScreenLayout
        header={
          <GNB
            align="left"
            className="shrink-0"
            title={null}
            left={
              <IconButton aria-label="뒤로 가기">
                <ChevronLeftIcon size={28} />
              </IconButton>
            }
          />
        }
      >
        {body}
      </ScreenLayout>
    );
  }

  return (
    <BottomNavScreenLayout
      activeTab="my"
      header={<GNB align="left" className="shrink-0" title={null} left={<BlankIcon size={28} />} />}
    >
      {body}
    </BottomNavScreenLayout>
  );
}

function TicketsPreview({ isEmpty }: { isEmpty: boolean }) {
  const response = isEmpty ? fixtures.EMPTY_TICKETS : fixtures.MY_TICKETS;

  return (
    <ScreenLayout
      header={
        <GNB
          className="shrink-0"
          title="내 티켓"
          left={
            <IconButton aria-label="뒤로 가기">
              <ChevronLeftIcon size={28} />
            </IconButton>
          }
          right={
            <IconButton aria-label="닫기">
              <CancelIcon size={28} />
            </IconButton>
          }
        />
      }
    >
      <div className="content-container py-ds-24">
        <TicketCard count={response.availableCount} />
      </div>
      <TicketHistoryList
        items={toTicketHistoryItems(response.items)}
        getSaveHref={() => PREVIEW_HREF}
        writeReviewHref={PREVIEW_HREF}
      />
    </ScreenLayout>
  );
}
