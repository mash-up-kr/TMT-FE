export type GroupTagOption = Readonly<{
  id: string;
  label: string;
}>;

export type GroupTagOptions = Readonly<{
  categories: GroupTagOption[];
  regions: GroupTagOption[];
}>;

export type GroupTagOptionsStatus = "pending" | "error" | "success";

export type GroupTagOptionsState = Readonly<{
  options: GroupTagOptions;
  status: GroupTagOptionsStatus;
}>;

export type GroupTagSelection = Readonly<{
  foodCategoryId: string;
  regionIds: string[];
}>;

export type GroupTagSheet = "category" | "region";
