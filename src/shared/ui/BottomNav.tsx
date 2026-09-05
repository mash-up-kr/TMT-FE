"use client";

import type { ComponentPropsWithRef } from "react";
import type { AppBottomNavValue } from "@/shared/model/appNavigation";
import { cn } from "@/shared/utils/cn";
import { FeedIcon, GroupIcon, HomeIcon, MyIcon, PlusIcon } from "./Icons";

export type BottomNavProps = ComponentPropsWithRef<"nav"> & {
  value: AppBottomNavValue;
  onValueChange: (value: AppBottomNavValue) => void;
  onCreate: () => void;
};

const items = [
  { value: "home", label: "홈", Icon: HomeIcon },
  { value: "feed", label: "피드", Icon: FeedIcon },
  { value: "group", label: "그룹", Icon: GroupIcon },
  { value: "my", label: "마이", Icon: MyIcon },
] as const;

export function BottomNav({ value, onValueChange, onCreate, className, ...props }: BottomNavProps) {
  const renderItem = (item: (typeof items)[number]) => {
    const active = item.value === value;

    return (
      <button
        key={item.value}
        type="button"
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-ds-4 overflow-hidden rounded-ds-full py-[calc(var(--spacing-ds-4)+var(--spacing-ds-2))]",
          active && "bg-surface-navigation-selected",
        )}
        onClick={() => onValueChange(item.value)}
      >
        <item.Icon
          aria-hidden="true"
          filled={active}
          className={cn(
            "size-ds-24 shrink-0",
            active ? "text-icon-interactive-primary" : "text-content-tertiary",
          )}
        />
        <span
          className={cn(
            "whitespace-nowrap text-content-tertiary text-label-navigation",
            active && "text-content-interactive-primary text-label-navigation-selected",
          )}
        >
          {item.label}
        </span>
      </button>
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
        <button
          type="button"
          aria-label="만들기"
          className="inline-flex size-ds-48 shrink-0 cursor-pointer items-center justify-center rounded-ds-full bg-surface-interactive-secondary-pressed text-content-interactive-inverse active:bg-surface-interactive-secondary-pressed"
          onClick={onCreate}
        >
          <PlusIcon aria-hidden="true" className="size-ds-24 shrink-0" />
        </button>
      </div>
      {items.slice(2).map(renderItem)}
    </nav>
  );
}
