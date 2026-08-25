import fallbackImage from "@/shared/assets/dummy.png";
import { PlusIcon } from "@/shared/ui/Icons";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import type { HomeGroup } from "../_model/home";

type MyGroupListProps = {
  groups: HomeGroup[];
};

export function MyGroupList({ groups }: MyGroupListProps) {
  return (
    <div className="bg-surface-primary px-ds-20 py-ds-12">
      <ul className="-mx-ds-20 flex gap-ds-4 overflow-x-auto px-ds-20">
        {groups.map((group) => (
          <li key={group.id} className="flex w-[76px] shrink-0 flex-col items-center gap-ds-8">
            <GroupThumbnail src={group.imageUrl ?? fallbackImage} />
            <span className="line-clamp-2 w-full text-center text-body-sm-medium text-content-primary">
              {group.name}
            </span>
          </li>
        ))}
        <li className="flex w-[76px] shrink-0 flex-col items-center gap-ds-8">
          <button
            type="button"
            aria-label="새 그룹 가입하기"
            className="flex size-[60px] items-center justify-center rounded-ds-full border-sm border-stroke-primary bg-surface-secondary text-icon-disabled"
          >
            <PlusIcon size={32} />
          </button>
          {groups.length === 0 ? (
            <span className="line-clamp-2 w-full text-center text-body-sm-medium text-content-disabled">
              새 그룹 가입하기
            </span>
          ) : null}
        </li>
      </ul>
    </div>
  );
}

type GroupThumbnailProps = {
  src: string | typeof fallbackImage;
};

function GroupThumbnail({ src }: GroupThumbnailProps) {
  return (
    <ImageWithFallback
      src={src}
      fallbackSrc={fallbackImage}
      alt=""
      width={60}
      height={60}
      sizes="60px"
      className="size-[60px] shrink-0 rounded-ds-full border-sm border-stroke-primary object-cover"
    />
  );
}
