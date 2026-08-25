import { CheckIcon } from "@/shared/ui/Icons";
import { cn } from "@/shared/utils/cn";

type FilterOptionProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

/** 그룹 탐색 필터 시트의 옵션 행. 시안은 원형 컨트롤 대신 선택 행 전체와 체크로 상태를 보인다. */
export function FilterOption({ label, selected, onClick }: FilterOptionProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex min-h-ds-48 w-full items-center justify-between px-ds-12 text-left text-body-lg-medium text-content-primary",
        "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-interactive-primary",
        selected && "bg-surface-selected",
      )}
      aria-pressed={selected}
      onClick={onClick}
    >
      {label}
      {selected ? <CheckIcon thick size={20} aria-hidden="true" /> : null}
    </button>
  );
}
