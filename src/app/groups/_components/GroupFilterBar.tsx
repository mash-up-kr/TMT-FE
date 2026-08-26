import { Chip } from "@/shared/ui/Chip";
import { ChevronDownIcon } from "@/shared/ui/Icons";
import type { GroupFilterId } from "../_constants/filters";

type GroupFilterBarProps = {
  sortLabel: string;
  categoryLabel: string;
  regionLabel: string;
  isCategorySelected: boolean;
  isRegionSelected: boolean;
  onOpenFilterAction: (id: GroupFilterId) => void;
};

export function GroupFilterBar({
  sortLabel,
  categoryLabel,
  regionLabel,
  isCategorySelected,
  isRegionSelected,
  onOpenFilterAction,
}: GroupFilterBarProps) {
  return (
    <div className="flex items-center gap-ds-8">
      <FilterChip id="sort" onOpenFilterAction={onOpenFilterAction}>
        {sortLabel}
      </FilterChip>
      <span aria-hidden="true" className="h-ds-24 w-px shrink-0 bg-stroke-secondary" />
      <FilterChip
        id="category"
        selected={isCategorySelected}
        onOpenFilterAction={onOpenFilterAction}
      >
        {categoryLabel}
      </FilterChip>
      <FilterChip id="region" selected={isRegionSelected} onOpenFilterAction={onOpenFilterAction}>
        {regionLabel}
      </FilterChip>
    </div>
  );
}

type FilterChipProps = {
  id: GroupFilterId;
  selected?: boolean;
  onOpenFilterAction: (id: GroupFilterId) => void;
  children: string;
};

function FilterChip({ id, selected = false, onOpenFilterAction, children }: FilterChipProps) {
  return (
    <Chip
      size="lg"
      selected={selected}
      rightIcon={<ChevronDownIcon />}
      onClick={() => onOpenFilterAction(id)}
      aria-haspopup="dialog"
    >
      {children}
    </Chip>
  );
}
