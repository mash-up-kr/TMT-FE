import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { type DraftReviewRouteSegment, isDraftReviewRouteSegment } from "../_constants/steps";
import { CompleteScreen } from "./steps/CompleteScreen";
import { PhotosStep } from "./steps/PhotosStep";
import { RatingStep } from "./steps/RatingStep";
import { TagsStep } from "./steps/TagsStep";

const STEP_SCREENS = {
  photos: PhotosStep,
  tags: TagsStep,
  rating: RatingStep,
  complete: CompleteScreen,
} satisfies Record<DraftReviewRouteSegment, ComponentType>;

export function ReviewStepScreen({ step }: Readonly<{ step: string }>) {
  if (!isDraftReviewRouteSegment(step)) {
    notFound();
  }

  const Screen = STEP_SCREENS[step];

  return <Screen />;
}
