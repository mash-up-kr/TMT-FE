import type { ListGroupsParams } from "@/api/gen/_model/listGroupsParams.gen";
import type { GroupFilters } from "../_hooks/useGroupFilters";

export function toGroupListParams(filters: GroupFilters, query: string): ListGroupsParams {
  return {
    query: query || undefined,
    sort: filters.sort,
    foodCategoryId: filters.categoryId ?? undefined,
    regionTagIds: filters.regionTagIds.length > 0 ? filters.regionTagIds : undefined,
  };
}
