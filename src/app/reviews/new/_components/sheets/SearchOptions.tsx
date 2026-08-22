import type { ReactNode } from "react";
import { Badge } from "@/shared/ui/Badge";
import { cn } from "@/shared/utils/cn";
import type { SearchStatus } from "../../_model/search";

const LOADING_MESSAGE = "검색 중이에요";
const ERROR_MESSAGE = "검색에 실패했어요. 잠시 후 다시 시도해 주세요";

const rowStyles = cn(
  "flex w-full flex-col gap-ds-4 rounded-ds-md px-ds-12 py-ds-8 text-left outline-none",
  "hover:bg-surface-interactive-tertiary active:bg-surface-interactive-tertiary-hovered",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-interactive-primary",
);

export function SearchOptionList({ children }: Readonly<{ children: ReactNode }>) {
  return <ul className="flex flex-col gap-ds-4">{children}</ul>;
}

export function SearchOptionMessage({
  tone = "default",
  children,
}: Readonly<{ tone?: "default" | "error"; children: ReactNode }>) {
  return (
    <p
      role="status"
      className={cn(
        "px-ds-12 py-ds-20 text-center text-body-md-medium",
        tone === "error" ? "text-content-error" : "text-content-tertiary",
      )}
    >
      {children}
    </p>
  );
}

export function SearchResultArea({
  status,
  idle = null,
  children,
}: Readonly<{
  status: SearchStatus;
  idle?: ReactNode;
  children: ReactNode;
}>) {
  if (status === "idle") {
    return idle;
  }

  if (status === "loading") {
    return <SearchOptionMessage>{LOADING_MESSAGE}</SearchOptionMessage>;
  }

  if (status === "error") {
    return <SearchOptionMessage tone="error">{ERROR_MESSAGE}</SearchOptionMessage>;
  }

  return children;
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
