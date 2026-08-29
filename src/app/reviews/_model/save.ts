export type ReviewSaveResult = {
  saveId: string;
  reviewId: string | null;
  placeId: string;
  grantedTicketCount: number;
  availableTicketCount: number;
};
