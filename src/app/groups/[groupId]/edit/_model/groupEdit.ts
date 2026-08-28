export type GroupEditFormData = Readonly<{
  groupName: string;
  summaryDescription: string;
  foodCategoryId: string;
  regionIds: string[];
  imageUrl: string | null;
  detailedDescription: string;
}>;

export type GroupEditSaveResult =
  | Readonly<{ success: true }>
  | Readonly<{ success: false; errorTitle?: string }>;

export type GroupDeleteResult =
  | Readonly<{ success: true }>
  | Readonly<{ success: false; errorTitle?: string }>;

export type GroupDeleteAction = Readonly<{
  onDeleteAction: () => Promise<GroupDeleteResult>;
  isPending: boolean;
}>;
