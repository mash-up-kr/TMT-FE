import Link from "next/link";
import { Badge } from "@/shared/ui/Badge";
import type { ProfileTicketHistoryItem, TicketEntrySource } from "../_model/profile";

type TicketHistoryItemProps = {
  item: ProfileTicketHistoryItem;
  /** 작성 중 항목을 재개할 경로를 만든다. 증감 이력에는 쓰이지 않는다. */
  getSaveHref: (saveId: string) => string;
};

export function TicketHistoryItem({ item, getSaveHref }: TicketHistoryItemProps) {
  const body = (
    <>
      <div className="flex min-w-0 flex-1 flex-col gap-ds-4 text-content-primary">
        <p className="truncate text-body-lg-bold">{titleOf(item.source, item.type)}</p>
        {item.source.kind === "place" ? (
          <p className="truncate text-body-md-regular">{item.source.roadAddress}</p>
        ) : null}
      </div>
      {item.status === "inProgress" ? (
        <Badge size="md">작성 중</Badge>
      ) : (
        <p className="shrink-0 text-right text-body-lg-medium text-content-primary">
          {formatAmount(item.amount)}
        </p>
      )}
    </>
  );

  return (
    <li>
      {item.status === "inProgress" ? (
        <Link
          href={getSaveHref(item.saveId)}
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

const TYPE_TITLES: Record<string, string> = {
  SIGNUP_REWARD: "회원가입 축하 티켓",
};

/** 출처가 없는 행도 제목이 비지 않아야 한다. 회원가입 보상이 그렇다. */
function titleOf(source: TicketEntrySource, type: string): string {
  if (source.kind === "none") {
    return TYPE_TITLES[type] ?? "티켓 변동";
  }
  return source.name;
}

/** 증감은 부호가 의미를 가진다. */
function formatAmount(amount: number): string {
  return amount > 0 ? `+${amount}` : `${amount}`;
}
