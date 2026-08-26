import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/shared/ui/Badge";
import { cn } from "@/shared/utils/cn";
import type {
  ProfileTicketHistoryItem,
  TicketEntrySource,
  TicketEntryType,
} from "../_model/profile";

type TicketHistoryItemProps = {
  item: ProfileTicketHistoryItem;
  /** 작성 중 항목을 재개할 경로를 만든다. 증감 이력에는 쓰이지 않는다. */
  getSaveHref: (saveId: string) => string;
};

export function TicketHistoryItem({ item, getSaveHref }: TicketHistoryItemProps) {
  return (
    <li>
      <TicketHistoryRow item={item} getSaveHref={getSaveHref}>
        <TicketHistoryTitle source={item.source} type={item.type} />
        <TicketHistoryTrailing item={item} />
      </TicketHistoryRow>
    </li>
  );
}

type TicketHistoryRowProps = TicketHistoryItemProps & { children: ReactNode };

/** 작성 중 행만 저장 상세로 이어진다. 증감 이력은 눌리지 않는다. */
function TicketHistoryRow({ item, getSaveHref, children }: TicketHistoryRowProps) {
  const rowStyles = "content-container flex items-center gap-ds-12 py-ds-12";

  if (item.status === "inProgress") {
    return (
      <Link
        href={getSaveHref(item.saveId)}
        className={cn(rowStyles, "active:bg-surface-interactive-tertiary")}
      >
        {children}
      </Link>
    );
  }

  return <div className={rowStyles}>{children}</div>;
}

const SOURCELESS_TITLES: Partial<Record<TicketEntryType, string>> = {
  SIGNUP_REWARD: "회원가입 축하 티켓",
};

type TicketHistoryTitleProps = {
  source: TicketEntrySource;
  type: TicketEntryType;
};

/** 출처가 없는 행도 제목이 비지 않아야 한다. 회원가입 보상이 그렇다. */
function TicketHistoryTitle({ source, type }: TicketHistoryTitleProps) {
  const title = source.kind === "none" ? (SOURCELESS_TITLES[type] ?? "티켓 변동") : source.name;

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-ds-4 text-content-primary">
      <p className="truncate text-body-lg-bold">{title}</p>
      {source.kind === "place" && (
        <p className="truncate text-body-md-regular">{source.roadAddress}</p>
      )}
    </div>
  );
}

function TicketHistoryTrailing({ item }: { item: ProfileTicketHistoryItem }) {
  if (item.status === "inProgress") {
    return <Badge size="md">작성 중</Badge>;
  }

  return (
    <p className="shrink-0 text-right text-body-lg-medium text-content-primary">
      {formatAmount(item.amount)}
    </p>
  );
}

/** 증감은 부호가 의미를 가진다. */
function formatAmount(amount: number): string {
  return amount > 0 ? `+${amount}` : `${amount}`;
}
