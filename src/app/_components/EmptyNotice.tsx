import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import tomatoPencil from "./assets/tomato-pencil.png";

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
      <Image
        src={tomatoPencil}
        alt=""
        width={172}
        height={130}
        sizes="172px"
        aria-hidden="true"
        className="h-[130px] w-[172px] shrink-0 aspect-[86/65]"
      />
      <div className="flex flex-col gap-ds-4 text-center">
        <p className="text-heading-sm text-content-primary">{title}</p>
        {children ? <p className="text-body-md-regular text-content-tertiary">{children}</p> : null}
      </div>
    </div>
  );
}
