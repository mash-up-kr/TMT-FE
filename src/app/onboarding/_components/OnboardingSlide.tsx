import Image from "next/image";
import type { OnboardingStep } from "../_constants/steps";

type OnboardingSlideProps = {
  step: OnboardingStep;
  /** 첫 장만 즉시 받는다. 나머지는 스와이프할 때 필요하다. */
  priority?: boolean;
};

export function OnboardingSlide({ step, priority = false }: OnboardingSlideProps) {
  return (
    <div className="flex w-full shrink-0 snap-start justify-center px-ds-20">
      {/*
        위에 붙인다. 진행바와의 간격이 시안값 그대로 유지되고, 남는 높이는 CTA 쪽으로 간다.
        짧은 화면에서는 max-h가 높이를 잡으므로 비율은 object-contain이 지킨다.
      */}
      <Image
        src={step.image}
        alt={step.alt}
        priority={priority}
        className="h-auto max-h-full w-full self-start object-contain"
      />
    </div>
  );
}
