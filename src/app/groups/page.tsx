import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ScreenLayout } from "@/shared/components/ScreenLayout";
import { TMTLogoHomeLink } from "@/shared/components/TMTLogoHomeLink";
import { ROUTES } from "@/shared/constants/routes";
import { GNB } from "@/shared/ui/GNB";
import { PlusIcon } from "@/shared/ui/Icons";
import { GroupsView } from "./_components/GroupsView";
import { TicketOnboardingPrompt } from "./_components/TicketOnboardingPrompt";

export const metadata: Metadata = {
  title: "맛집 그룹 찾기",
};

export default function GroupsPage() {
  return (
    <ScreenLayout
      // GroupsView가 검색 영역의 고정과 목록 스크롤을 함께 소유한다.
      bodyScrollable={false}
      header={
        <GNB
          align="left"
          className="shrink-0"
          title={null}
          left={<TMTLogoHomeLink />}
          right={
            <Link
              href={ROUTES.GROUPS.NEW}
              aria-label="그룹 만들기"
              className="relative text-icon-primary after:-translate-x-1/2 after:-translate-y-1/2 after:absolute after:top-1/2 after:left-1/2 after:size-ds-32 after:content-['']"
            >
              <PlusIcon size={28} />
            </Link>
          }
        />
      }
    >
      <Suspense>
        <GroupsView />
      </Suspense>
      <TicketOnboardingPrompt />
    </ScreenLayout>
  );
}
