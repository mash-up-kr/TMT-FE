"use client";

import type { TicketHistoryResponse } from "@/api/gen/_model/ticketHistoryResponse.gen";
import { useMyTickets } from "@/api/gen/profile/profile.gen";
import type { TicketHistory } from "../_model/profile";
import { toTicketHistoryItems } from "../_utils/profileMappers";

function toTicketHistory(response: TicketHistoryResponse): TicketHistory {
  return {
    availableCount: response.availableCount,
    items: toTicketHistoryItems(response.items),
  };
}

export function useTicketHistory() {
  return useMyTickets<TicketHistory>(undefined, { query: { select: toTicketHistory } });
}
