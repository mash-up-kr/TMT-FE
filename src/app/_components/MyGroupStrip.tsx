import { PlusIcon } from "@/shared/ui/Icons";
import type { HomeGroup } from "../_model/home";

type MyGroupStripProps = {
  groups: HomeGroup[];
};

export function MyGroupStrip({ groups }: MyGroupStripProps) {
  return (
    <div className="bg-surface-primary px-ds-20 py-ds-12">
      <ul className="-mx-ds-20 flex gap-ds-4 overflow-x-auto px-ds-20">
        {groups.map((group) => (
          <li
            key={group.id}
            className="flex w-[76px] shrink-0 flex-col items-center gap-ds-8"
          >
            <GroupThumbnail name={group.name} imageUrl={group.imageUrl} />
            <span className="line-clamp-2 w-full text-center text-body-sm-medium text-content-primary">
              {group.name}
            </span>
          </li>
        ))}
        <li className="flex w-[76px] shrink-0 flex-col items-center gap-ds-8">
          <button
            type="button"
            aria-label="새 그룹 가입하기"
            className="flex size-[60px] items-center justify-center rounded-ds-full border-sm border-stroke-primary bg-surface-secondary text-icon-primary"
          >
            <PlusIcon size={32} />
          </button>
          {groups.length === 0 ? (
            <span className="line-clamp-2 w-full text-center text-body-sm-medium text-content-primary">
              새 그룹 가입하기
            </span>
          ) : null}
        </li>
      </ul>
    </div>
  );
}

type GroupThumbnailProps = {
  name: string;
  imageUrl: string | null;
};

function GroupThumbnail({ name, imageUrl }: GroupThumbnailProps) {
  if (!imageUrl) {
    return (
      <div className="flex size-[60px] items-center justify-center rounded-ds-full border-sm border-stroke-primary bg-surface-tertiary text-body-lg-bold text-content-tertiary">
        {name.slice(0, 1)}
      </div>
    );
  }

  return (
    // biome-ignore lint/performance/noImgElement: 이미지 호스트가 확정되지 않아 next.config의 remotePatterns를 채울 수 없다.
    <img
      src={imageUrl}
      alt=""
      className="size-[60px] shrink-0 rounded-ds-full border-sm border-stroke-primary object-cover"
      loading="lazy"
    />
  );
}
