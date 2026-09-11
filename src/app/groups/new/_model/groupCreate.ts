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
  reviewIds: string[];
};

export type GroupCreateSubmission = {
  draft: GroupCreateDraft;
  groupImageFile?: File;
};

export type CreatedGroupData = {
  id: string;
};

export type GroupCreateResult = CreatedGroupData & {
  /** 그룹은 만들어졌지만 고른 리뷰를 공유하지 못했다. */
  reviewShareFailed: boolean;
};

export type GroupCreateStep = "basicInfo" | "tags" | "image" | "description" | "reviews";

export type GroupCreateTagSheet = GroupTagSheet;

export type { GroupTagOptionsState, GroupTagOptionsStatus, GroupTagSelection };

/** 새 그룹에 공유할 리뷰 목록의 한 줄. */
export type GroupReviewOption = Readonly<{
  reviewId: string;
  placeName: string;
  /** 사진 없는 리뷰는 null이다. 서버가 대체 이미지를 채우지 않는다. */
  thumbnailUrl: string | null;
  contentPreview: string | null;
}>;

export type GroupReviewOptionsStatus = "pending" | "error" | "success";

export type GroupReviewOptionsState = {
  options: GroupReviewOption[];
  status: GroupReviewOptionsStatus;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};

export type GroupCreateInitialState = {
  step?: GroupCreateStep;
  draft?: Partial<GroupCreateDraft>;
  openTagSheet?: GroupCreateTagSheet;
};
