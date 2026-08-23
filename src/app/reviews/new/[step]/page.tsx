import { ReviewStepScreen } from "../../_components/ReviewStepScreen";
import { REVIEW_ROUTE_SEGMENTS } from "../../_constants/steps";

/**
 * 새 리뷰는 단계 목록이 고정이라 빌드 시점에 전부 만들어 둔다.
 *
 * 이어쓰기는 초안 식별자가 경로에 있어 같은 방법을 쓸 수 없다. 두 트리가 같은 화면을 쓰면서도
 * 렌더 방식이 갈리는 자리다.
 */
export function generateStaticParams() {
  return REVIEW_ROUTE_SEGMENTS.map((step) => ({ step }));
}

/** 위 목록에 없는 세그먼트는 화면을 그리기 전에 라우팅 단계에서 404가 된다. */
export const dynamicParams = false;

export default async function ReviewStepPage({
  params,
}: Readonly<{ params: Promise<{ step: string }> }>) {
  const { step } = await params;

  return <ReviewStepScreen step={step} />;
}
