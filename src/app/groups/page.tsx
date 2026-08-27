import Link from "next/link";
import { BottomNavScreenLayout } from "@/shared/components/BottomNavScreenLayout";
import { TMTLogoHomeLink } from "@/shared/components/TMTLogoHomeLink";
import { ROUTES } from "@/shared/constants/routes";
import { GNB } from "@/shared/ui/GNB";
import { PlusIcon } from "@/shared/ui/Icons";
import { GroupsView } from "./_components/GroupsView";

export default function GroupsPage() {
  return (
    <BottomNavScreenLayout
      activeTab="group"
      // 목록이 자체 스크롤을 갖고 필터 바를 고정한다. 여기서 또 감싸면 필터가 같이 밀린다.
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
      <GroupsView />
    </BottomNavScreenLayout>
  );
}
