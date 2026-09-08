import Link from "next/link";
import { ROUTES } from "@/shared/constants/routes";
import { cn } from "@/shared/utils/cn";

export function FeedSearchEntry({ keyword }: { keyword: string | null }) {
  return (
    <Link
      href={ROUTES.SEARCH}
      className={cn(
        "block w-full truncate rounded-ds-md border-sm border-stroke-field bg-surface-primary px-ds-16 py-ds-12 text-left text-body-lg-medium",
        keyword ? "text-content-primary" : "text-content-tertiary",
      )}
    >
      {keyword ?? "장소나 태그로 검색해보세요"}
    </Link>
  );
}
