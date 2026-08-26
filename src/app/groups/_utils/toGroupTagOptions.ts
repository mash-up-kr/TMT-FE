import type { GroupTagsResponse } from "@/api/gen/_model/groupTagsResponse.gen";

export type GroupTagOption = Readonly<{
  id: string;
  label: string;
}>;

export type GroupTagOptions = Readonly<{
  categories: GroupTagOption[];
  regions: GroupTagOption[];
}>;

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
