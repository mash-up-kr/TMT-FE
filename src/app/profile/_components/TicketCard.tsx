import Link from "next/link";
import { cn } from "@/shared/utils/cn";

type TicketCardProps = {
  count: number;
  /** 티켓 이력으로 보내는 경로. 이력 화면 상단의 요약처럼 이동이 없는 자리에서는 생략한다. */
  href?: string;
};

/** 티켓 가장자리의 반원 절취선. Figma는 좌우 각 3개, 지름 12, 중심 y = 16 / 40 / 64. */
const NOTCH_OFFSETS = ["top-ds-16", "top-ds-40", "top-ds-64"];

const frameStyles =
  "relative flex h-[80px] items-center justify-between overflow-hidden rounded-ds-sm bg-surface-interactive-secondary px-[calc(var(--spacing-ds-24)+var(--spacing-ds-4))] text-content-interactive-inverse";

export function TicketCard({ count, href }: TicketCardProps) {
  if (href) {
    return (
      <Link
        href={href}
        className={cn(frameStyles, "active:bg-surface-interactive-secondary-pressed")}
      >
        <TicketCardBody count={count} />
      </Link>
    );
  }

  return (
    <div className={frameStyles}>
      <TicketCardBody count={count} />
    </div>
  );
}

function TicketCardBody({ count }: { count: number }) {
  return (
    <>
      <span className="text-body-lg-medium">내 티켓</span>
      <span className="flex items-center gap-ds-12">
        <span className="text-heading-xl">{count}</span>
        <span className="text-body-md-medium">장</span>
      </span>
      {NOTCH_OFFSETS.map((offset) => (
        <TicketNotch key={offset} offset={offset} />
      ))}
    </>
  );
}

function TicketNotch({ offset }: { offset: string }) {
  return (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "-translate-x-1/2 -translate-y-1/2 absolute left-0 size-ds-12 rounded-ds-full bg-surface-primary",
          offset,
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          "-translate-y-1/2 absolute right-0 size-ds-12 translate-x-1/2 rounded-ds-full bg-surface-primary",
          offset,
        )}
      />
    </>
  );
}
