import Link from "next/link";
import { Badge } from "@/shared/ui/Badge";
import type { ProfileTicketHistoryItem } from "../_model/profile";

type TicketHistoryItemProps = {
  item: ProfileTicketHistoryItem;
  /** 작성 중 항목을 재개할 경로를 만든다. 증감 이력에는 쓰이지 않는다. */
  getDraftHref: (draftId: string) => string;
};

export function TicketHistoryItem({ item, getDraftHref }: TicketHistoryItemProps) {
  const body = (
    <>
      <div className="flex min-w-0 flex-1 flex-col gap-ds-4 text-content-primary">
        <p className="truncate text-body-lg-bold">{item.placeName}</p>
        <p className="truncate text-body-md-regular">{item.address}</p>
      </div>
      {item.status === "draft" ? (
        <Badge size="md">작성 중</Badge>
      ) : (
        <p className="shrink-0 text-right text-body-lg-medium text-content-primary">
          {formatDelta(item.delta)}
        </p>
      )}
    </>
  );

  return (
    <li>
      {item.status === "draft" ? (
        <Link
          href={getDraftHref(item.draftId)}
          className="content-container flex items-center gap-ds-12 py-ds-12 active:bg-surface-interactive-tertiary"
        >
          {body}
        </Link>
      ) : (
        <div className="content-container flex items-center gap-ds-12 py-ds-12">{body}</div>
      )}
    </li>
  );
}

/** 증감은 부호가 의미를 가진다. 0은 이력으로 내려오지 않지만 부호 없이 그대로 보여준다. */
function formatDelta(delta: number): string {
  return delta > 0 ? `+${delta}` : `${delta}`;
}
