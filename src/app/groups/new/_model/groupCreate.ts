import type { GroupTagOptions } from "@/app/groups/_model/groupTag";

export type GroupCreateDraft = {
  groupName: string;
  summaryDescription: string;
  foodCategoryId: string;
  regionIds: string[];
  groupImageId?: string;
  detailedDescription?: string;
};

export type GroupCreateSubmission = {
  draft: GroupCreateDraft;
  groupImageFile?: File;
};

export type CreatedGroupData = {
  id: string;
};

export type GroupCreateStep = "basicInfo" | "tags" | "image" | "description";

export type GroupCreateTagSheet = "category" | "region";

export type GroupTagOptionsStatus = "pending" | "error" | "success";

export type GroupTagOptionsState = {
  options: GroupTagOptions;
  status: GroupTagOptionsStatus;
};

export type GroupTagSelection = Pick<GroupCreateDraft, "foodCategoryId" | "regionIds">;

export type GroupCreateInitialState = {
  step?: GroupCreateStep;
  draft?: Partial<GroupCreateDraft>;
  openTagSheet?: GroupCreateTagSheet;
};
