import type { CompleteReviewStore, ReviewStore } from "../_model/store";

export function isReviewStoreComplete(store: ReviewStore | null): store is CompleteReviewStore {
  return store !== null && store.name.trim().length > 0 && store.address !== null;
}
