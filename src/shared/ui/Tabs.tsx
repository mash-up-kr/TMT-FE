"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import type { ComponentProps } from "react";
import { cn } from "@/shared/utils/cn";

type StyledProps<T> = Omit<T, "className"> & {
  className?: string;
};

type TabsProps = StyledProps<Omit<ComponentProps<typeof TabsPrimitive.Root>, "orientation">> & {
  triggerLayout?: "fill" | "hug";
};

type TabsListProps = StyledProps<ComponentProps<typeof TabsPrimitive.List>>;
type TabsTriggerProps = StyledProps<ComponentProps<typeof TabsPrimitive.Tab>>;
type TabsContentProps = StyledProps<ComponentProps<typeof TabsPrimitive.Panel>>;

export function Tabs({ className, triggerLayout = "fill", ...props }: TabsProps) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-trigger-layout={triggerLayout}
      className={cn("group/tabs flex flex-col", className)}
      {...props}
      orientation="horizontal"
    />
  );
}

export function TabsList({ activateOnFocus = true, children, className, ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "group relative flex h-ds-48 w-full shrink-0 items-start overflow-x-auto border-b border-stroke-secondary bg-surface-primary [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
      {...props}
      activateOnFocus={activateOnFocus}
    >
      {children}
      <TabsPrimitive.Indicator
        renderBeforeHydration
        aria-hidden="true"
        data-slot="tabs-indicator"
        className={cn(
          "pointer-events-none absolute bottom-0 left-(--active-tab-left) z-20 h-ds-2 w-(--active-tab-width) bg-stroke-selected transition-[left,width] motion-reduce:transition-none",
          "group-has-[[role=tab][data-active][data-disabled]]:bg-stroke-disabled",
        )}
      />
    </TabsPrimitive.List>
  );
}

export function TabsTrigger({ className, ...props }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative flex h-ds-48 items-center justify-center gap-ds-8 whitespace-nowrap bg-surface-primary px-ds-24 text-body-lg-medium text-content-primary outline-none group-data-[trigger-layout=fill]/tabs:flex-1 group-data-[trigger-layout=hug]/tabs:shrink-0",
        "hover:bg-surface-secondary hover:text-content-secondary",
        "focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-interactive-primary",
        "data-disabled:pointer-events-none data-disabled:bg-surface-disabled data-disabled:text-content-disabled",
        "[&_svg]:size-ds-24 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: TabsContentProps) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn(
        "flex-1 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-interactive-primary",
        className,
      )}
      {...props}
    />
  );
}
