import Link from "next/link";
import { buttonStyles } from "@/shared/ui/Button";
import type { ProfileTicketHistoryItem } from "../_model/profile";
import { ProfileEmptyNotice } from "./ProfileEmptyNotice";
import { TicketHistoryItem } from "./TicketHistoryItem";

type TicketHistoryListProps = {
  items: readonly ProfileTicketHistoryItem[];
  getSaveHref: (saveId: string) => string;
  writeReviewHref: string;
};

export function TicketHistoryList({ items, getSaveHref, writeReviewHref }: TicketHistoryListProps) {
  if (items.length === 0) {
    return (
      <ProfileEmptyNotice
        title="아직 작성한 리뷰가 없어요"
        action={
          <Link
            href={writeReviewHref}
            className={buttonStyles({ variant: "tertiary", size: "md" })}
          >
            리뷰 작성하기
          </Link>
        }
      >
        리뷰를 작성하면 티켓을 받을 수 있어요.
      </ProfileEmptyNotice>
    );
  }

  return (
    <ul className="bg-surface-primary">
      {items.map((item) => (
        <TicketHistoryItem key={item.entryId} item={item} getSaveHref={getSaveHref} />
      ))}
    </ul>
  );
}
