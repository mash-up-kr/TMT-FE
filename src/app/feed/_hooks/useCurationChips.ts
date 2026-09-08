import { useCurationTags } from "@/api/gen/curation/curation.gen";
import { type CurationChip, toCurationChips } from "../_utils/feedMapper";

export function useCurationChips() {
  return useCurationTags<CurationChip[]>({ query: { select: toCurationChips } });
}
