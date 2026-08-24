import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { isReviewRouteSegment, type ReviewRouteSegment } from "../_constants/steps";
import { CompleteScreen } from "./steps/CompleteScreen";
import { PhotosStep } from "./steps/PhotosStep";
import { RatingStep } from "./steps/RatingStep";
import { StoreStep } from "./steps/StoreStep";
import { TagsStep } from "./steps/TagsStep";

const STEP_SCREENS = {
  store: StoreStep,
  photos: PhotosStep,
  tags: TagsStep,
  rating: RatingStep,
  complete: CompleteScreen,
} satisfies Record<ReviewRouteSegment, ComponentType>;

export function ReviewStepScreen({ step }: Readonly<{ step: string }>) {
  if (!isReviewRouteSegment(step)) {
    notFound();
  }

  const Screen = STEP_SCREENS[step];

  return <Screen />;
}
