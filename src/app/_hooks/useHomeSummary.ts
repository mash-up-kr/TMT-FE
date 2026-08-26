import { useHome } from "@/api/gen/home/home.gen";
import type { HomeSummary } from "../_model/home";
import { toHomeSummary } from "../_utils/homeMapper";

export function useHomeSummary() {
  return useHome<HomeSummary>({ query: { select: toHomeSummary } });
}
