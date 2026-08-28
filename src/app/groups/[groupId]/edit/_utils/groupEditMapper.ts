import type { GroupDetailResponse } from "@/api/gen/_model/groupDetailResponse.gen";
import type { GroupRequest } from "@/api/gen/_model/groupRequest.gen";
import type { GroupEditFormData } from "../_model/groupEdit";

export function toGroupEditFormData(detail: GroupDetailResponse): GroupEditFormData {
  return {
    groupName: detail.name,
    summaryDescription: detail.oneLineDescription,
    foodCategoryId: detail.foodCategory.categoryId,
    regionIds: detail.regionTags.map((tag) => tag.regionTagId),
    imageUrl: detail.imageUrl ?? null,
    detailedDescription: detail.description ?? "",
  };
}

export function toGroupUpdateRequest(form: GroupEditFormData): GroupRequest {
  return {
    name: form.groupName.trim(),
    oneLineDescription: form.summaryDescription.trim(),
    foodCategoryId: form.foodCategoryId,
    regionTagIds: form.regionIds,
    description: form.detailedDescription.trim() || null,
  };
}
