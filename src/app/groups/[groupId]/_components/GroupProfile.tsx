import groupFallbackImage from "@/shared/assets/dummy.png";
import coverFallbackImage from "@/shared/assets/dummy-small.png";
import { MatchedPlaceBadge } from "@/shared/components/MatchedPlaceBadge/MatchedPlaceBadge";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import type { GroupProfileData } from "../_model/groupDetail";

type GroupProfileProps = {
  group: GroupProfileData;
};

export function GroupProfile({ group }: GroupProfileProps) {
  return (
    <section className="bg-surface-primary">
      <div className="h-[140px] overflow-hidden bg-surface-secondary">
        <ImageWithFallback
          src={group.coverImageUrl}
          fallbackSrc={coverFallbackImage}
          alt={`${group.name} 대표 이미지`}
          className="size-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-ds-12 px-ds-20 py-ds-16">
        <div className="flex items-center gap-ds-8">
          <ImageWithFallback
            src={group.imageUrl}
            fallbackSrc={groupFallbackImage}
            alt=""
            className="size-ds-48 shrink-0 rounded-ds-full object-cover"
          />
          <div className="min-w-0">
            <h1 className="truncate text-body-lg-bold text-content-primary">{group.name}</h1>
            <p className="truncate text-body-md-medium text-content-secondary">
              {group.oneLineDescription}
            </p>
          </div>
        </div>

        <dl className="grid grid-cols-3 rounded-ds-sm border border-stroke-primary bg-surface-primary py-ds-12 text-center">
          <GroupStat label="가입자 수" value={group.memberCount} />
          <GroupStat label="리뷰" value={group.reviewCount} />
          <GroupStat label="가게" value={group.placeCount} />
        </dl>

        {group.description ? (
          <p className="text-body-md-medium text-content-secondary">{group.description}</p>
        ) : null}

        <ul className="flex flex-wrap gap-ds-4" aria-label="그룹 태그">
          {group.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-ds-full inset-ring inset-ring-stroke-primary px-ds-12 py-ds-4 text-body-sm-medium text-content-primary"
            >
              {tag}
            </li>
          ))}
        </ul>

        {group.matchedSavedPlaceCount > 0 ? (
          <MatchedPlaceBadge>
            내가 저장한 가게와 {group.matchedSavedPlaceCount}개 일치해요
          </MatchedPlaceBadge>
        ) : null}
      </div>
    </section>
  );
}

function GroupStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-ds-4">
      <dt className="text-body-sm-medium text-content-secondary">{label}</dt>
      <dd className="text-body-md-bold text-content-primary">{value}</dd>
    </div>
  );
}
