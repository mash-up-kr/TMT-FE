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
  getSaveHref: (saveId: string) => string;
};

export function TicketHistoryItem({ item, getSaveHref }: TicketHistoryItemProps) {
  return (
    <li>
      <TicketHistoryRow item={item} getSaveHref={getSaveHref}>
        <TicketHistoryContents item={item} />
        <TicketHistoryTrailing item={item} />
      </TicketHistoryRow>
    </li>
  );
}

type TicketHistoryRowProps = TicketHistoryItemProps & { children: ReactNode };

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

/**
 * 행의 제목은 티켓이 어떻게 움직였는지다. 매장·그룹 이름은 아래 줄이 맡는다.
 *
 * 부호가 아니라 종류로 가른다. 리뷰를 지워 티켓이 빠지는 것과 그룹에 티켓을 내는 것은
 * 둘 다 음수지만 사용자에게는 다른 일이다.
 */
const ENTRY_TITLES: Record<TicketEntryType, string> = {
  SAVE_IN_PROGRESS: "티켓 획득 예정",
  SIGNUP_REWARD: "티켓 획득",
  REVIEW_REWARD: "티켓 획득",
  REVIEW_DELETE_REVOKE: "티켓 회수",
  GROUP_JOIN: "티켓 사용",
};

/** 매장도 그룹도 없는 행은 이름을 만들 데가 없어 종류가 곧 설명이다. */
const SOURCELESS_DESCRIPTIONS: Partial<Record<TicketEntryType, string>> = {
  SIGNUP_REWARD: "회원가입 축하 티켓",
};

function toDescription(source: TicketEntrySource, type: TicketEntryType): string | null {
  if (source.kind === "place") {
    return source.name;
  }
  if (source.kind === "group") {
    return `${source.name} 그룹 가입`;
  }

  return SOURCELESS_DESCRIPTIONS[type] ?? null;
}

function TicketHistoryContents({ item }: { item: ProfileTicketHistoryItem }) {
  const description = toDescription(item.source, item.type);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-ds-4 text-content-primary">
      <p className="truncate text-body-lg-bold">{ENTRY_TITLES[item.type]}</p>
      {description !== null && <p className="truncate text-body-md-regular">{description}</p>}
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

function formatAmount(amount: number): string {
  return amount > 0 ? `+${amount}` : `${amount}`;
}
