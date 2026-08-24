import { type ReactNode, useEffect, useState } from "react";
import { Badge } from "@/shared/ui/Badge";
import { cn } from "@/shared/utils/cn";
import type { SearchStatus } from "../../_model/search";
import { StatusMessage } from "../StatusMessage";

const LOADING_MESSAGE = "검색 중이에요";
const ERROR_MESSAGE = "검색에 실패했어요. 잠시 후 다시 시도해 주세요";
const LOADING_DELAY_MS = 300;

const messagePadding = "px-ds-12 py-ds-20";

const rowStyles = cn(
  "flex w-full flex-col gap-ds-4 rounded-ds-md px-ds-12 py-ds-8 text-left outline-none",
  "hover:bg-surface-interactive-tertiary active:bg-surface-interactive-tertiary-hovered",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-interactive-primary",
);

export function SearchOptionList({ children }: Readonly<{ children: ReactNode }>) {
  return <ul className="flex flex-col gap-ds-4">{children}</ul>;
}

function useDelayedLoading(loading: boolean) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!loading) {
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => setVisible(true), LOADING_DELAY_MS);

    return () => clearTimeout(timer);
  }, [loading]);

  return visible;
}

export function SearchResultArea({
  status,
  idle = null,
  persistent = null,
  children,
}: Readonly<{
  status: SearchStatus;
  idle?: ReactNode;
  persistent?: ReactNode;
  children: ReactNode;
}>) {
  const showLoading = useDelayedLoading(status === "loading");

  if (status === "idle") {
    return idle;
  }

  if (status === "loading") {
    return (
      <>
        {showLoading && <StatusMessage className={messagePadding}>{LOADING_MESSAGE}</StatusMessage>}
        {persistent}
      </>
    );
  }

  if (status === "error") {
    return (
      <>
        <StatusMessage tone="error" className={messagePadding}>
          {ERROR_MESSAGE}
        </StatusMessage>
        {persistent}
      </>
    );
  }

  return <>{children}</>;
}

export function SearchOptionRow({
  primary,
  secondary,
  onSelect,
}: Readonly<{
  primary: string;
  secondary?: string;
  onSelect: () => void;
}>) {
  return (
    <li>
      <button type="button" onClick={onSelect} className={rowStyles}>
        <span className="text-body-lg-medium text-content-primary">{primary}</span>
        {secondary != null && (
          <span className="text-body-md-medium text-content-tertiary">{secondary}</span>
        )}
      </button>
    </li>
  );
}

export function AddressOptionRow({
  roadAddress,
  jibunAddress,
  onSelect,
}: Readonly<{
  roadAddress: string;
  jibunAddress: string;
  onSelect: () => void;
}>) {
  return (
    <li>
      <button type="button" onClick={onSelect} className={cn(rowStyles, "gap-ds-8")}>
        <span className="flex items-center gap-ds-4">
          <Badge tone="neutral">도로명</Badge>
          <span className="text-body-lg-medium text-content-primary">{roadAddress}</span>
        </span>
        <span className="flex items-center gap-ds-4">
          <Badge tone="neutral">지번</Badge>
          <span className="text-body-lg-medium text-content-primary">{jibunAddress}</span>
        </span>
      </button>
    </li>
  );
}

export function DirectInputOption({
  query,
  onSelect,
}: Readonly<{
  query: string;
  onSelect: () => void;
}>) {
  return (
    <li>
      <button type="button" onClick={onSelect} className={rowStyles}>
        <span className="text-body-lg-medium text-content-interactive-primary">
          ‘{query}’ 직접 입력하기
        </span>
      </button>
    </li>
  );
}
