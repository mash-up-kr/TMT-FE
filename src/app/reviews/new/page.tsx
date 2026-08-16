import { redirect } from "next/navigation";
import { REVIEW_FLOW_BASE_PATH, REVIEW_STEPS } from "./_constants/steps";

export default function ReviewWriteEntryPage() {
  redirect(`${REVIEW_FLOW_BASE_PATH}/${REVIEW_STEPS[0].segment}`);
}
