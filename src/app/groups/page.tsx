import Link from "next/link";
import { TabScreenLayout } from "@/shared/components/TabScreenLayout";
import { TMTLogoHomeLink } from "@/shared/components/TMTLogoHomeLink";
import { ROUTES } from "@/shared/constants/routes";
import { GNB } from "@/shared/ui/GNB";
import { PlusIcon } from "@/shared/ui/Icons";
import { GroupsView } from "./_components/GroupsView";

export default function GroupsPage() {
  return (
    <TabScreenLayout activeTab="group">
      <GNB
        align="left"
        title={null}
        left={<TMTLogoHomeLink />}
        right={
          <Link
            href={ROUTES.GROUPS.NEW}
            aria-label="그룹 만들기"
            className="relative text-icon-primary after:-translate-x-1/2 after:-translate-y-1/2 after:absolute after:top-1/2 after:left-1/2 after:size-ds-32 after:content-['']"
          >
            <PlusIcon />
          </Link>
        }
      />
      <GroupsView />
    </TabScreenLayout>
  );
}
