import type { StaticImageData } from "next/image";
import { EmptyNotice } from "@/shared/components/EmptyNotice/EmptyNotice";

type FeedNoticeProps = {
  title: string;
  src?: StaticImageData;
  children?: string;
};

export function FeedNotice({ title, children, src }: FeedNoticeProps) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center bg-surface-primary px-ds-20 py-ds-32">
      <EmptyNotice title={title} src={src}>
        {children}
      </EmptyNotice>
    </div>
  );
}
