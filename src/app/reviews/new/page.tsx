import { redirect } from "next/navigation";
import { NEW_REVIEW_BASE_PATH, REVIEW_STEPS, reviewStepPath } from "../_constants/steps";

export default function ReviewWriteEntryPage() {
  redirect(reviewStepPath(NEW_REVIEW_BASE_PATH, REVIEW_STEPS[0]));
}
