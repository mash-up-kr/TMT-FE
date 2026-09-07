import { ReviewStepScreen } from "../../../_components/ReviewStepScreen";

export default async function DraftReviewStepPage({
  params,
}: Readonly<{ params: Promise<{ step: string }> }>) {
  const { step } = await params;

  return <ReviewStepScreen step={step} />;
}
