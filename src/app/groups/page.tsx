import { TabScreenLayout } from "@/shared/components/TabScreenLayout";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { BlankIcon, PlusIcon } from "@/shared/ui/Icons";
import { GroupsView } from "./_components/GroupsView";

export default function GroupsPage() {
  return (
    <TabScreenLayout activeTab="group">
      <GNB
        align="left"
        title={null}
        left={<BlankIcon size={28} />}
        right={
          <IconButton aria-label="그룹 만들기">
            <PlusIcon />
          </IconButton>
        }
      />
      <GroupsView />
    </TabScreenLayout>
  );
}
