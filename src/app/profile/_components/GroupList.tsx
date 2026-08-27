import { EmptyNotice } from "@/shared/components/EmptyNotice/EmptyNotice";
import type { ProfileGroupItem, ProfileViewer } from "../_model/profile";
import { GroupListItem } from "./GroupListItem";

type GroupListProps = {
  groups: readonly ProfileGroupItem[];
  getGroupHref: (groupId: string) => string;
  viewer: ProfileViewer;
};

export function GroupList({ groups, getGroupHref, viewer }: GroupListProps) {
  if (groups.length === 0) {
    return <EmptyNotice title="아직 가입한 그룹이 없어요" className="py-ds-48" />;
  }

  return (
    <ul className="content-container bg-surface-primary">
      {groups.map((group) => (
        <GroupListItem
          key={group.groupId}
          group={group}
          href={getGroupHref(group.groupId)}
          viewer={viewer}
        />
      ))}
    </ul>
  );
}
