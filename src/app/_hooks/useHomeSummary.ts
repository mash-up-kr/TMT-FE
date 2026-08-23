import { useHome } from "@/api/gen/home/home.gen";
import type { HomeSummary } from "../_model/home";
import { toHomeSummary } from "../_utils/homeMapper";

const SERVER_IGNORES_USER_ID = 1;

export function useHomeSummary() {
  return useHome<HomeSummary>(
    { userId: SERVER_IGNORES_USER_ID },
    { query: { select: toHomeSummary } },
  );
}
