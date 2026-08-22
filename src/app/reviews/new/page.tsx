import { redirect } from "next/navigation";
import { REVIEW_STEPS, reviewStepPath } from "./_constants/steps";

export default function ReviewWriteEntryPage() {
  redirect(reviewStepPath(REVIEW_STEPS[0]));
}
