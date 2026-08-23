import { ReviewStepScreen } from "../../_components/ReviewStepScreen";
import { REVIEW_ROUTE_SEGMENTS } from "../../_constants/steps";

export function generateStaticParams() {
  return REVIEW_ROUTE_SEGMENTS.map((step) => ({ step }));
}

export const dynamicParams = false;

export default async function ReviewStepPage({
  params,
}: Readonly<{ params: Promise<{ step: string }> }>) {
  const { step } = await params;

  return <ReviewStepScreen step={step} />;
}
