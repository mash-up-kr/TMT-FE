import type { ReviewStore } from "./store";

export type ReviewDraftSnapshot = {
  store: ReviewStore | null;
  selectedTagIds: readonly string[];
  rating: number;
  reviewText: string;
};
