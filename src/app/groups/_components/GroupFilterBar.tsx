import { useState } from "react";
import { useGroupTags } from "@/api/gen/group-tag/group-tag.gen";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Button } from "@/shared/ui/Button";
import { Chip } from "@/shared/ui/Chip";
import { IconButton } from "@/shared/ui/IconButton";
import { CancelIcon, ChevronDownIcon, RefreshIcon } from "@/shared/ui/Icons";
import {
  DEFAULT_SORT,
  GROUP_SORTS,
  type GroupFilterId,
  type GroupSort,
} from "../_constants/filters";
import { toGroupTagOptions } from "../_utils/toGroupTagOptions";
import { FilterOption } from "./FilterOption";

type GroupFilterBarProps = {
  sort: GroupSort;
  categoryId: string | null;
  regionTagIds: string[];
  onSortChange: (sort: GroupSort) => void;
  onCategoryChange: (categoryId: string | null) => void;
  onRegionsChange: (regionTagIds: string[]) => void;
};

export function GroupFilterBar({
  sort,
  categoryId,
  regionTagIds,
  onSortChange,
  onCategoryChange,
  onRegionsChange,
}: GroupFilterBarProps) {
  const [openFilter, setOpenFilter] = useState<GroupFilterId | null>(null);
  const [sortDraft, setSortDraft] = useState<GroupSort>(sort);
  const [categoryDraft, setCategoryDraft] = useState<string | null>(categoryId);
  const [regionDraft, setRegionDraft] = useState<string[]>(regionTagIds);
  const { data: tags, isPending: tagsPending, isError: tagsError } = useGroupTags();
  const { categories, regions } = toGroupTagOptions(tags);
  const categoryLabel =
    categories.find((category) => category.id === categoryId)?.label ?? "카테고리";
  const selectedRegions = regions.filter((region) => regionTagIds.includes(region.id));
  const regionLabel =
    selectedRegions.length === 0
      ? "지역"
      : `${selectedRegions[0].label}${selectedRegions.length > 1 ? ` 외 ${selectedRegions.length - 1}` : ""}`;

  const openSheet = (id: GroupFilterId) => {
    if (id === "sort") setSortDraft(sort);
    if (id === "category") setCategoryDraft(categoryId);
    if (id === "region") setRegionDraft(regionTagIds);
    setOpenFilter(id);
  };

  const toggleRegion = (id: string) => {
    setRegionDraft((previous) =>
      previous.includes(id) ? previous.filter((regionId) => regionId !== id) : [...previous, id],
    );
  };

  return (
    <>
      <div className="flex items-center gap-ds-8">
        <FilterChip id="sort" onOpen={openSheet}>
          {GROUP_SORTS.find((option) => option.value === sort)?.label ?? ""}
        </FilterChip>
        <span aria-hidden="true" className="h-ds-24 w-px shrink-0 bg-stroke-secondary" />
        <FilterChip id="category" selected={categoryId !== null} onOpen={openSheet}>
          {categoryLabel}
        </FilterChip>
        <FilterChip id="region" selected={regionTagIds.length > 0} onOpen={openSheet}>
          {regionLabel}
        </FilterChip>
      </div>

      <BottomSheet
        open={openFilter === "sort"}
        onOpenChange={(open) => setOpenFilter(open ? "sort" : null)}
        title="정렬 기준"
        right={
          <IconButton
            aria-label="정렬 기준 초기화"
            className="text-icon-interactive-secondary"
            onClick={() => setSortDraft(DEFAULT_SORT)}
          >
            <RefreshIcon size={24} />
          </IconButton>
        }
        footer={
          <Button
            className="w-full"
            onClick={() => {
              onSortChange(sortDraft);
              setOpenFilter(null);
            }}
          >
            선택완료
          </Button>
        }
      >
        {GROUP_SORTS.map((option) => (
          <FilterOption
            key={option.value}
            label={option.label}
            selected={sortDraft === option.value}
            onClick={() => setSortDraft(option.value)}
          />
        ))}
      </BottomSheet>

      <BottomSheet
        open={openFilter === "category"}
        onOpenChange={(open) => setOpenFilter(open ? "category" : null)}
        title="카테고리"
        right={
          <IconButton
            aria-label="카테고리 초기화"
            className="text-icon-interactive-secondary"
            onClick={() => setCategoryDraft(null)}
          >
            <RefreshIcon size={24} />
          </IconButton>
        }
        footer={
          <Button
            className="w-full"
            onClick={() => {
              onCategoryChange(categoryDraft);
              setOpenFilter(null);
            }}
          >
            선택완료
          </Button>
        }
      >
        <FilterSheetOptions
          options={categories}
          isPending={tagsPending}
          isError={tagsError}
          selectedIds={categoryDraft ? [categoryDraft] : []}
          onOptionClick={setCategoryDraft}
        />
      </BottomSheet>

      <BottomSheet
        open={openFilter === "region"}
        onOpenChange={(open) => setOpenFilter(open ? "region" : null)}
        title="지역"
        right={
          <IconButton
            aria-label="지역 초기화"
            className="text-icon-interactive-secondary"
            onClick={() => setRegionDraft([])}
          >
            <RefreshIcon size={24} />
          </IconButton>
        }
        footer={
          <Button
            className="w-full"
            onClick={() => {
              onRegionsChange(regionDraft);
              setOpenFilter(null);
            }}
          >
            선택완료
          </Button>
        }
      >
        {regionDraft.length > 0 ? (
          <div className="flex flex-wrap gap-ds-8 py-ds-8">
            {regions
              .filter((region) => regionDraft.includes(region.id))
              .map((region) => (
                <Chip
                  key={region.id}
                  size="md"
                  selected
                  className="bg-surface-primary hover:bg-surface-primary active:bg-surface-primary"
                  rightIcon={<CancelIcon size={16} />}
                  aria-label={`${region.label} 선택 해제`}
                  onClick={() => toggleRegion(region.id)}
                >
                  {region.label}
                </Chip>
              ))}
          </div>
        ) : null}
        <FilterSheetOptions
          options={regions}
          isPending={tagsPending}
          isError={tagsError}
          selectedIds={regionDraft}
          onOptionClick={toggleRegion}
        />
      </BottomSheet>
    </>
  );
}

type FilterSheetOptionsProps = {
  options: { id: string; label: string }[];
  isPending: boolean;
  isError: boolean;
  selectedIds: string[];
  onOptionClick: (id: string) => void;
};

function FilterSheetOptions({
  options,
  isPending,
  isError,
  selectedIds,
  onOptionClick,
}: FilterSheetOptionsProps) {
  if (isPending) return <FilterSheetMessage>불러오는 중이에요</FilterSheetMessage>;
  if (isError) return <FilterSheetMessage>옵션을 불러오지 못했어요</FilterSheetMessage>;

  return options.map((option) => (
    <FilterOption
      key={option.id}
      label={option.label}
      selected={selectedIds.includes(option.id)}
      onClick={() => onOptionClick(option.id)}
    />
  ));
}

function FilterSheetMessage({ children }: { children: string }) {
  return <p className="py-ds-20 text-body-md-medium text-content-tertiary">{children}</p>;
}

type FilterChipProps = {
  id: GroupFilterId;
  selected?: boolean;
  onOpen: (id: GroupFilterId) => void;
  children: string;
};

function FilterChip({ id, selected = false, onOpen, children }: FilterChipProps) {
  return (
    <Chip
      size="lg"
      selected={selected}
      rightIcon={<ChevronDownIcon />}
      onClick={() => onOpen(id)}
      aria-haspopup="dialog"
    >
      {children}
    </Chip>
  );
}
