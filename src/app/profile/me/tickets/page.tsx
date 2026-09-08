import type { Metadata } from "next";
import { TicketHistoryScreen } from "../../_components/TicketHistoryScreen";

export const metadata: Metadata = {
  title: "내 티켓",
};

export default function Page() {
  return <TicketHistoryScreen />;
}
