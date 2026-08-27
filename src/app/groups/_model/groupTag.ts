export type GroupTagOption = Readonly<{
  id: string;
  label: string;
}>;

export type GroupTagOptions = Readonly<{
  categories: GroupTagOption[];
  regions: GroupTagOption[];
}>;
