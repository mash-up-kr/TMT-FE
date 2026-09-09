import type { SaveResultResponseMissingItem } from "@/api/gen/_model/saveResultResponseMissingItem.gen";
import type { ReviewStepSegment } from "../_constants/steps";

export type ReviewSaveResult = {
  saveId: string;
  reviewId: string | null;
  placeId: string;
  grantedTicketCount: number;
  availableTicketCount: number;
  /** 리뷰 성립에 모자란 항목. 비어 있으면 리뷰가 완성돼 티켓이 나간다. 사진은 항목이 아니다. */
  missingItems: SaveResultResponseMissingItem[];
};

/** 티켓 조건이 걸린 단계. 사진과 매장은 조건이 아니라 여기 없다. */
export type ReviewMissingStepSegment = Extract<ReviewStepSegment, "tags" | "rating">;

/** 미충족 항목을 화면이 안내하는 단계 단위로 묶은 것. */
export type ReviewMissingStep = Readonly<{ step: ReviewMissingStepSegment; label: string }>;
