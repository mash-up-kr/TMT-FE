import { redirect } from "next/navigation";
import { ReviewStepScreen } from "../../../_components/ReviewStepScreen";
import {
  DRAFT_REVIEW_FIRST_STEP,
  draftReviewBasePath,
  reviewStepPath,
} from "../../../_constants/steps";

export default async function DraftReviewStepPage({
  params,
}: Readonly<{ params: Promise<{ draftId: string; step: string }> }>) {
  const { draftId, step } = await params;

  if (step === "store") {
    redirect(reviewStepPath(draftReviewBasePath(draftId), DRAFT_REVIEW_FIRST_STEP));
  }

  return <ReviewStepScreen step={step} />;
}
