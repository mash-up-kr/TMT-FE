"use client";

import { useListGroups } from "@/api/gen/group/group.gen";
import { UT2_STEPS } from "@/shared/constants/ut2";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { useUt2Step } from "@/shared/hooks/useUt2Step";
import { LoadingIcon } from "@/shared/ui/Icons";
import { DEFAULT_SORT } from "../_constants/filters";
import { useGroupFilters } from "../_hooks/useGroupFilters";
import type { GroupListItem } from "../_model/group";
import { toGroupListItem, toGroupListParams } from "../_utils/groupMappers";
import { GroupFilters } from "./GroupFilters";
import { GroupList, GroupListEmpty } from "./GroupList";
import { GroupSearchBar } from "./GroupSearchBar";

export type GroupsPreviewState = "pending" | "error" | "empty";

type GroupsViewProps = {
  /** 프리뷰 라우트에서 API와 관계없이 결과 상태를 확인할 때만 쓴다. */
  previewState?: GroupsPreviewState;
};

export function GroupsView({ previewState }: GroupsViewProps) {
  const { filters, setKeyword, setSort, setCategory, setRegions } = useGroupFilters();
  const searchQuery = useDebouncedValue(filters.keyword.trim());

  const { data, isPending, isError, refetch } = useListGroups(
    toGroupListParams(filters, searchQuery),
  );

  const groups = (data?.items ?? []).map(toGroupListItem).filter((item) => item !== null);

  // ⚠️ UT2 임시 계측. 진입은 1-4, 검색어나 필터를 처음 건드리면 1-5로 넘어간다.
  const hasFiltered =
    filters.keyword.trim().length > 0 ||
    filters.sort !== DEFAULT_SORT ||
    filters.categoryId !== null ||
    filters.regionTagIds.length > 0;

  useUt2Step(UT2_STEPS.GROUP_TAB_ENTRY);
  useUt2Step(UT2_STEPS.GROUP_TAB_FILTER, hasFiltered);

  return (
    <>
      <div className="flex shrink-0 flex-col gap-ds-12 px-ds-20 py-ds-12">
        <GroupSearchBar value={filters.keyword} onValueChange={setKeyword} />
        <GroupFilters
          sort={filters.sort}
          categoryId={filters.categoryId}
          regionTagIds={filters.regionTagIds}
          onSortChange={setSort}
          onCategoryChange={setCategory}
          onRegionsChange={setRegions}
        />
      </div>
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-ds-20">
        <GroupsResult
          groups={groups}
          isPending={previewState === "pending" || (!previewState && isPending)}
          isError={previewState === "error" || (!previewState && isError)}
          forceEmpty={previewState === "empty"}
          onRetry={refetch}
        />
      </main>
    </>
  );
}

type GroupsResultProps = {
  groups: GroupListItem[];
  isPending: boolean;
  isError: boolean;
  forceEmpty: boolean;
  onRetry: () => void;
};

function GroupsResult({ groups, isPending, isError, forceEmpty, onRetry }: GroupsResultProps) {
  if (isPending) {
    return (
      <output className="flex flex-1 items-center justify-center">
        <LoadingIcon className="animate-spin text-icon-tertiary" />
      </output>
    );
  }

  if (isError) {
    return (
      <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-ds-12">
        <p className="text-body-md-regular text-content-secondary">목록을 불러오지 못했어요.</p>
        <button
          type="button"
          onClick={() => onRetry()}
          className="text-body-md-bold text-content-interactive-primary"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (forceEmpty || groups.length === 0) {
    return <GroupListEmpty />;
  }

  return <GroupList groups={groups} />;
}
