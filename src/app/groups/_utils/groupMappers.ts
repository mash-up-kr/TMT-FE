import type { GroupCardResponse } from "@/api/gen/_model/groupCardResponse.gen";
import type { GroupTagsResponse } from "@/api/gen/_model/groupTagsResponse.gen";
import type { ListGroupsParams } from "@/api/gen/_model/listGroupsParams.gen";
import type { GroupFilters } from "../_hooks/useGroupFilters";
import type { GroupListItem } from "../_model/group";

export type GroupTagOption = Readonly<{
  id: string;
  label: string;
}>;

export type GroupTagOptions = Readonly<{
  categories: GroupTagOption[];
  regions: GroupTagOption[];
}>;

export function toGroupListItem(response: GroupCardResponse): GroupListItem | null {
  // id가 없으면 상세로 갈 수도, 목록에서 구분할 수도 없어 그리지 않는다.
  if (!response.groupId) {
    return null;
  }

  return {
    id: response.groupId,
    thumbnail: response.coverImageUrl ?? null,
    name: response.name ?? "",
    description: response.oneLineDescription ?? "",
    memberCount: response.memberCount ?? 0,
    reviewCount: response.reviewCount ?? 0,
    placeCount: response.placeCount ?? 0,
    matchedCount: response.matchedSavedPlaceCount ?? 0,
  };
}

export function toGroupListParams(filters: GroupFilters, query: string): ListGroupsParams {
  return {
    query: query || undefined,
    sort: filters.sort,
    foodCategoryId: filters.categoryId ?? undefined,
    regionTagIds: filters.regionTagIds.length > 0 ? filters.regionTagIds : undefined,
  };
}

export function toGroupTagOptions(tags: GroupTagsResponse | undefined): GroupTagOptions {
  return {
    categories:
      tags?.foodCategories.map(({ categoryId, label }) => ({
        id: categoryId,
        label,
      })) ?? [],
    regions:
      tags?.regionTags.map(({ regionTagId, label }) => ({
        id: regionTagId,
        label,
      })) ?? [],
  };
}
