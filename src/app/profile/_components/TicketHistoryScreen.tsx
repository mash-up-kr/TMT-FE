"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared/constants/routes";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { CancelIcon, ChevronLeftIcon } from "@/shared/ui/Icons";
import { useTicketHistory } from "../_hooks/useProfileData";
import { saveHref } from "../_utils/profileHrefs";
import { ProfileScreenStatus } from "./ProfileScreenStatus";
import { ProfileTabSkeleton } from "./ProfileTabSkeleton";
import { TicketCard } from "./TicketCard";
import { TicketHistoryList } from "./TicketHistoryList";

export function TicketHistoryScreen() {
  const router = useRouter();
  const history = useTicketHistory();

  return (
    <>
      <GNB
        className="shrink-0"
        title="내 티켓"
        left={
          <IconButton aria-label="뒤로 가기" onClick={() => router.back()}>
            <ChevronLeftIcon size={28} />
          </IconButton>
        }
        right={
          <IconButton aria-label="닫기" onClick={() => router.push(ROUTES.PROFILE.ME)}>
            <CancelIcon size={28} />
          </IconButton>
        }
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="content-container py-ds-24">
          <TicketCard count={history.data?.availableCount ?? 0} />
        </div>
        {history.data ? (
          <TicketHistoryList
            items={history.data.items}
            getSaveHref={saveHref}
            writeReviewHref={ROUTES.REVIEWS.NEW}
          />
        ) : (
          <ProfileScreenStatus
            query={history}
            skeleton={<ProfileTabSkeleton />}
            errorMessage="티켓 이력을 불러오지 못했어요"
          />
        )}
      </div>
    </>
  );
}
