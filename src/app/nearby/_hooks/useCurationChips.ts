import { useCurationTags } from "@/api/gen/curation/curation.gen";
import { type CurationChip, toCurationChips } from "../_utils/nearbyMapper";

export function useCurationChips() {
  return useCurationTags<CurationChip[]>({ query: { select: toCurationChips } });
}
