import type { ReactNode } from "react";
import { Badge } from "@/shared/ui/Badge";
import { cn } from "@/shared/utils/cn";

const rowStyles = cn(
  "flex w-full flex-col gap-ds-4 rounded-ds-md px-ds-12 py-ds-8 text-left outline-none",
  "hover:bg-surface-interactive-tertiary active:bg-surface-interactive-tertiary-hovered",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-interactive-primary",
);

export function SearchOptionList({ children }: Readonly<{ children: ReactNode }>) {
  return <ul className="flex flex-col gap-ds-4">{children}</ul>;
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
