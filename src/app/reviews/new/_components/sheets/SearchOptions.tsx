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

/**
 * 목록 자리를 대신 채우는 안내 문구. 로딩·에러·빈 상태가 같은 자리를 쓴다.
 */
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

/**
 * 검색 결과 자리의 상태 분기.
 *
 * loading·error만 여기서 그린다. 검색 전 안내와 "결과 없음"은 시트마다 달라 —
 * 매장 검색은 둘 다 없고 주소 검색은 둘 다 있다 — 시트가 넘긴 것을 그대로 쓴다.
 */
export function SearchResultArea({
  status,
  idle = null,
  children,
}: Readonly<{
  status: SearchStatus;
  /** 검색어를 넣기 전에 보여줄 안내. 없으면 아무것도 그리지 않는다. */
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

/**
 * props를 도메인 필드가 아니라 시안이 그리는 줄 단위로 받는다.
 * 서버 응답의 필드 이름이 바뀌어도 호출부 매핑만 고치면 된다.
 */
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

/** 검색 결과 유무와 무관하게 목록 끝에 항상 붙는다. 결과 0건이면 이것만 남는다. */
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
