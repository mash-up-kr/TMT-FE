"use client";

import { useQuery } from "@tanstack/react-query";
import { MY_TICKETS } from "../_fixtures/profileFixtures";
import { toTicketHistoryItems } from "../_utils/profileMappers";
import { resolveFixture, type TicketHistory } from "./profileQueries";

export function useTicketHistory() {
  return useQuery({
    queryKey: ["profile", "me", "tickets"],
    queryFn: async (): Promise<TicketHistory> => {
      const response = await resolveFixture(MY_TICKETS);
      return {
        availableCount: response.availableCount,
        items: toTicketHistoryItems(response.items),
      };
    },
  });
}
