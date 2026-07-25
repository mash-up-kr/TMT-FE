"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import {
  type ComponentProps,
  createContext,
  type Ref,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/shared/utils/cn";

const TabsValueContext = createContext<string | undefined>(undefined);

type IndicatorPosition = Readonly<{
  disabled: boolean;
  left: number;
  width: number;
}>;

type TabsProps = Omit<ComponentProps<typeof TabsPrimitive.Root>, "orientation">;

function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

function Tabs({ className, defaultValue, onValueChange, value, ...props }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);

  const handleValueChange = (nextValue: string) => {
    setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <TabsValueContext value={value ?? internalValue}>
      <TabsPrimitive.Root
        data-slot="tabs"
        className={cn("flex flex-col", className)}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        value={value}
        {...props}
        orientation="horizontal"
      />
    </TabsValueContext>
  );
}

function TabsList({
  children,
  className,
  ref,
  ...props
}: ComponentProps<typeof TabsPrimitive.List>) {
  const activeValue = useContext(TabsValueContext);
  const listRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<IndicatorPosition | null>(null);

  useLayoutEffect(() => {
    const list = listRef.current;

    if (!list || activeValue === undefined) {
      setIndicator(null);
      return;
    }

    const updateIndicator = () => {
      const trigger = list.querySelector<HTMLElement>('[role="tab"][data-state="active"]');

      setIndicator(
        trigger
          ? {
              disabled: trigger.hasAttribute("disabled"),
              left: trigger.offsetLeft,
              width: trigger.offsetWidth,
            }
          : null,
      );
    };

    updateIndicator();

    const observer = new ResizeObserver(updateIndicator);
    observer.observe(list);

    list.querySelectorAll<HTMLElement>('[role="tab"]').forEach((trigger) => {
      observer.observe(trigger);
    });

    return () => observer.disconnect();
  }, [activeValue]);

  const handleRef = useCallback(
    (node: HTMLDivElement | null) => {
      listRef.current = node;
      setRef(ref, node);
    },
    [ref],
  );

  return (
    <TabsPrimitive.List
      ref={handleRef}
      data-slot="tabs-list"
      className={cn(
        "relative flex h-ds-48 w-full shrink-0 items-start overflow-x-auto border-b border-stroke-secondary bg-surface-primary [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
      {...props}
    >
      {children}
      {indicator && (
        <span
          aria-hidden="true"
          data-slot="tabs-indicator"
          className={cn(
            "pointer-events-none absolute bottom-0 h-ds-2 bg-stroke-selected transition-[left,width] motion-reduce:transition-none",
            indicator.disabled && "bg-stroke-disabled",
          )}
          style={{ left: indicator.left, width: indicator.width }}
        />
      )}
    </TabsPrimitive.List>
  );
}

function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative flex h-ds-48 shrink-0 items-center justify-center gap-ds-8 whitespace-nowrap bg-surface-primary px-ds-24 text-body-lg-medium text-content-primary outline-none",
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

function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
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
