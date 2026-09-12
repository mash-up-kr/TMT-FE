import type { Metadata } from "next";
import Link from "next/link";
import { ScreenLayout } from "@/shared/components/ScreenLayout";
import { ROUTES } from "@/shared/constants/routes";
import { GNB } from "@/shared/ui/GNB";
import { ChevronLeftIcon } from "@/shared/ui/Icons";
import { Notice } from "@/shared/ui/Notice";
import { RankView } from "./_components/RankView";

/** 순위 안내. 줄마다 박스 하나다. 첫 줄은 mapper의 기준(그룹을 만든 사람만, 리뷰 수 순)과 같은 말이어야 한다. */
const RANK_NOTICES = [
  "랭크는 그룹을 만든 사람 중 리뷰 수 순으로 정해져요.",
  "가장 많은 맛집을 공유한 mash-up의 맛잘알은 누구!!",
] as const;

export const metadata: Metadata = {
  title: "랭킹",
};

/** 유저 활동량 랭킹 (TMT-436). 아직 내브에 없어 URL로만 연다. */
export default function RankPage() {
  return (
    <ScreenLayout
      header={
        <GNB
          className="shrink-0"
          title="랭킹"
          left={
            <Link
              href={ROUTES.ROOT}
              aria-label="홈으로"
              className="relative text-icon-primary after:-translate-x-1/2 after:-translate-y-1/2 after:absolute after:top-1/2 after:left-1/2 after:size-ds-32 after:content-['']"
            >
              <ChevronLeftIcon size={28} />
            </Link>
          }
        />
      }
    >
      {/* 목록 행의 좌우 여백(px-ds-20)에 맞춘다. */}
      <div className="flex flex-col gap-ds-8 px-ds-20 pt-ds-16 pb-ds-8">
        {RANK_NOTICES.map((message) => (
          <Notice key={message}>{message}</Notice>
        ))}
      </div>
      <RankView />
    </ScreenLayout>
  );
}
