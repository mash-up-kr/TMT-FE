import type { GroupDetailResponse } from "@/api/gen/_model/groupDetailResponse.gen";
import type { GroupRequest } from "@/api/gen/_model/groupRequest.gen";
import type { CreatedGroupData, GroupCreateDraft } from "../_model/groupCreate";

export function toGroupCreateRequest(draft: GroupCreateDraft): GroupRequest {
  return {
    name: draft.groupName.trim(),
    oneLineDescription: draft.summaryDescription.trim(),
    foodCategoryId: draft.foodCategoryId,
    regionTagIds: draft.regionIds,
    imageAssetId: draft.groupImageId,
    description: draft.detailedDescription?.trim() || undefined,
  };
}

export function toCreatedGroupData(response: GroupDetailResponse): CreatedGroupData {
  return { id: response.groupId };
}
