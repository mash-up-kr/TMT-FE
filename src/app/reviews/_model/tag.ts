export type ReviewTag = {
  id: string;
  label: string;
};

export type ReviewTagGroup = {
  id: string;
  label: string;
  hint: string;
  tags: readonly ReviewTag[];
};
