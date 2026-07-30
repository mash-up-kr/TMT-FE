"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import type { ComponentProps } from "react";
import { cn } from "@/shared/utils/cn";

type TabsProps = Omit<ComponentProps<typeof TabsPrimitive.Root>, "orientation"> & {
  triggerLayout?: "fill" | "hug";
};

function Tabs({ className, triggerLayout = "fill", ...props }: TabsProps) {
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

function TabsList({ children, className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "group relative flex h-ds-48 w-full shrink-0 items-start overflow-x-auto border-b border-stroke-secondary bg-surface-primary [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
      {...props}
      activateOnFocus
    >
      {children}
      <TabsPrimitive.Indicator
        renderBeforeHydration
        aria-hidden="true"
        data-slot="tabs-indicator"
        className={cn(
          "pointer-events-none absolute bottom-0 left-[var(--active-tab-left)] z-20 h-ds-2 w-[var(--active-tab-width)] bg-stroke-selected transition-[left,width] motion-reduce:transition-none",
          "group-has-[[role=tab][data-selected][data-disabled]]:bg-stroke-disabled",
        )}
      />
    </TabsPrimitive.List>
  );
}

function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Tab>) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative flex h-ds-48 items-center justify-center gap-ds-8 whitespace-nowrap bg-surface-primary px-ds-24 text-body-lg-medium text-content-primary outline-none group-data-[trigger-layout=fill]/tabs:flex-1 group-data-[trigger-layout=hug]/tabs:shrink-0",
        "hover:bg-surface-secondary hover:text-content-secondary",
        "focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-interactive-primary",
        "disabled:pointer-events-none disabled:bg-surface-disabled disabled:text-content-disabled",
        "[&_svg]:size-ds-24 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Panel>) {
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

export { Tabs, TabsContent, TabsList, TabsTrigger };
