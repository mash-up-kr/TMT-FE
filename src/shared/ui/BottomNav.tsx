import Link from "next/link";
import type { ComponentPropsWithRef } from "react";
import { cn } from "@/shared/utils/cn";
import { FeedIcon, GroupIcon, HomeIcon, MyIcon, PlusIcon } from "./Icons";

export type BottomNavValue = "home" | "feed" | "group" | "my";

export type BottomNavProps = ComponentPropsWithRef<"nav"> & {
  value: BottomNavValue;
  tabHrefs: Record<BottomNavValue, string>;
  createHref: string;
};

const items = [
  { value: "home", label: "홈", Icon: HomeIcon },
  { value: "feed", label: "피드", Icon: FeedIcon },
  { value: "group", label: "그룹", Icon: GroupIcon },
  { value: "my", label: "마이", Icon: MyIcon },
] as const;

export function BottomNav({ value, tabHrefs, createHref, className, ...props }: BottomNavProps) {
  const renderItem = (item: (typeof items)[number]) => {
    const active = item.value === value;

    return (
      <Link
        key={item.value}
        href={tabHrefs[item.value]}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex min-w-0 flex-1 flex-col items-center gap-ds-4 overflow-hidden rounded-ds-full py-[calc(var(--spacing-ds-4)+var(--spacing-ds-2))]",
          active && "bg-surface-navigation-selected",
        )}
      >
        <item.Icon
          aria-hidden="true"
          className={cn(
            "size-ds-24 shrink-0",
            active ? "text-icon-interactive-primary" : "text-icon-disabled",
          )}
        />
        <span
          className={cn(
            "whitespace-nowrap text-content-interactive-secondary text-label-navigation",
            active && "text-content-interactive-primary text-label-navigation-selected",
          )}
        >
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <nav
      aria-label="주요 메뉴"
      className={cn(
        "flex w-full max-w-(--layout-bottom-navigation-width) items-center overflow-hidden rounded-ds-full border-sm border-stroke-inverse bg-surface-primary/80 px-ds-12 py-ds-4 shadow-navigation backdrop-blur-navigation",
        className,
      )}
      {...props}
    >
      {items.slice(0, 2).map(renderItem)}
      <div className="flex min-w-0 flex-1 items-center justify-center">
        <Link
          href={createHref}
          aria-label="만들기"
          className="inline-flex size-ds-48 shrink-0 items-center justify-center rounded-ds-full bg-surface-interactive-primary text-content-interactive-inverse active:bg-surface-interactive-primary-pressed"
        >
          <PlusIcon aria-hidden="true" className="size-ds-24 shrink-0" />
        </Link>
      </div>
      {items.slice(2).map(renderItem)}
    </nav>
  );
}
