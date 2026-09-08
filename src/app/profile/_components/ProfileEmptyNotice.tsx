import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { EmptyNotice } from "@/shared/components/EmptyNotice/EmptyNotice";

type ProfileEmptyNoticeProps = {
  title: string;
  src: StaticImageData;
  children?: string;
  action?: ReactNode;
};

export function ProfileEmptyNotice({ title, children, action, src }: ProfileEmptyNoticeProps) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center py-ds-48">
      <EmptyNotice src={src} title={title} action={action}>
        {children}
      </EmptyNotice>
    </div>
  );
}
