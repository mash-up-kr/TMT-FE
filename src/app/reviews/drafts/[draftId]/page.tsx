import { redirect } from "next/navigation";
import { draftReviewBasePath, REVIEW_STEPS, reviewStepPath } from "../../_constants/steps";

export default async function DraftReviewEntryPage({
  params,
}: Readonly<{ params: Promise<{ draftId: string }> }>) {
  const { draftId } = await params;

  redirect(reviewStepPath(draftReviewBasePath(draftId), REVIEW_STEPS[0]));
}
