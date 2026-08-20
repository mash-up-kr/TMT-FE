import { cn } from "@/shared/utils/cn";
import { EmptyIllustration } from "./EmptyIllustration";

type EmptyNoticeProps = {
  title: string;
  children?: string;
  className?: string;
};

export function EmptyNotice({ title, children, className }: EmptyNoticeProps) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-ds-12 py-ds-32",
        className,
      )}
    >
      <EmptyIllustration />
      <div className="flex flex-col gap-ds-4 text-center">
        <p className="text-heading-sm text-content-primary">{title}</p>
        {children ? <p className="text-body-md-regular text-content-tertiary">{children}</p> : null}
      </div>
    </div>
  );
}
