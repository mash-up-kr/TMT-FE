import type {
  GroupTagOptionsState,
  GroupTagOptionsStatus,
  GroupTagSelection,
  GroupTagSheet,
} from "@/app/groups/_model/groupTag";

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

export type GroupCreateTagSheet = GroupTagSheet;

export type { GroupTagOptionsState, GroupTagOptionsStatus, GroupTagSelection };

export type GroupCreateInitialState = {
  step?: GroupCreateStep;
  draft?: Partial<GroupCreateDraft>;
  openTagSheet?: GroupCreateTagSheet;
};
