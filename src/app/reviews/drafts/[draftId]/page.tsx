import { redirect } from "next/navigation";
import {
  DRAFT_REVIEW_FIRST_STEP,
  draftReviewBasePath,
  reviewStepPath,
} from "../../_constants/steps";

export default async function DraftReviewEntryPage({
  params,
}: Readonly<{ params: Promise<{ draftId: string }> }>) {
  const { draftId } = await params;

  redirect(reviewStepPath(draftReviewBasePath(draftId), DRAFT_REVIEW_FIRST_STEP));
}
