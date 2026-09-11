"use client";

import { useTicketOnboardingPrompt } from "../_hooks/useTicketOnboardingPrompt";
import { TicketOnboardingSheet } from "./TicketOnboardingSheet";

export function TicketOnboardingPrompt() {
  const { open, onOpenChange } = useTicketOnboardingPrompt();

  return <TicketOnboardingSheet open={open} onOpenChangeAction={onOpenChange} />;
}
