import { GroupCard } from "@/shared/components/GroupCard/GroupCard";
import type { HomeRecommendedGroup } from "../_model/home";

/** 시안이 300px 고정 카드를 가로로 넘기는 구조라 ds 스케일 대신 값으로 둔다. */
const CARD_WIDTH = "w-[300px]";

type RecommendedGroupListProps = {
  groups: HomeRecommendedGroup[];
};

export function RecommendedGroupList({ groups }: RecommendedGroupListProps) {
  if (groups.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-ds-12 bg-surface-primary p-ds-20">
      <h2 className="px-ds-4 text-heading-sm text-content-primary">혹시, 이런 그룹은 어떠세요?</h2>
      <ul className="-mx-ds-20 flex gap-ds-12 overflow-x-auto px-ds-20">
        {groups.map((group) => (
          <li key={group.id} className={`${CARD_WIDTH} shrink-0`}>
            <GroupCard
              thumbnail={group.imageUrl}
              title={group.name}
              description={group.description}
              memberCount={group.memberCount}
              reviewCount={group.reviewCount}
              placeCount={group.placeCount}
              matchedCount={group.matchedCount}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
