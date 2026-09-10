"use client";

import Image from "next/image";
import { type UIEvent, useRef, useState } from "react";
import { useDragScroll } from "@/shared/hooks/useDragScroll";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { Progress } from "@/shared/ui/Progress";
import { ONBOARDING_STEP_COUNT, ONBOARDING_STEPS } from "../_constants/steps";

type OnboardingViewProps = {
  onSkip: () => void;
  onStart: () => void;
};

/**
 * 가입 직후 한 번 보여주는 소개 화면의 표시 계층.
 *
 * CTA는 마지막 장까지 다음 장으로 넘기고, 마지막 장에서만 화면을 나가는 진입구가 된다.
 * 가로 스와이프로도 넘길 수 있고, 진행바는 현재 장을 표시한다.
 */
export function OnboardingView({ onSkip, onStart }: OnboardingViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const stepsRef = useRef<HTMLElement>(null);
  const dragScroll = useDragScroll<HTMLElement>();
  const isLastStep = currentIndex === ONBOARDING_STEP_COUNT - 1;

  function handleScroll(event: UIEvent<HTMLElement>) {
    const { scrollLeft, clientWidth } = event.currentTarget;

    if (clientWidth > 0) {
      setCurrentIndex(
        Math.max(0, Math.min(ONBOARDING_STEP_COUNT - 1, Math.round(scrollLeft / clientWidth))),
      );
    }
  }

  // 스와이프와 같은 경로를 타야 한다. index를 직접 올리면 스크롤 위치와 진행바가 어긋난다.
  function goToNextStep() {
    const steps = stepsRef.current;

    if (steps === null) {
      return;
    }

    steps.scrollTo({ left: steps.clientWidth * (currentIndex + 1), behavior: "smooth" });
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface-primary">
      <header className="flex h-(--layout-gnb-height) shrink-0 items-center justify-end px-ds-20">
        <button
          type="button"
          onClick={onSkip}
          className="-mr-ds-8 cursor-pointer px-ds-8 py-ds-8 text-body-lg-regular text-content-disabled active:text-content-tertiary"
        >
          건너뛰기
        </button>
      </header>

      {/* 진행바 아래 28px. 시안 2638:60042 실측이고 ds 스케일에 없는 값이다. */}
      <div className="content-container shrink-0 pt-ds-20 pb-[28px]">
        <Progress
          value={currentIndex + 1}
          max={ONBOARDING_STEP_COUNT}
          aria-label={`또맛또 소개 ${ONBOARDING_STEP_COUNT}장 중 ${currentIndex + 1}장`}
        />
      </div>

      <section
        ref={stepsRef}
        {...dragScroll}
        aria-label="또맛또 소개"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: CTA는 앞으로만 넘기므로 이전 장으로 돌아가려면 이 영역에 포커스가 닿아야 한다. 이름을 가진 region이라 스크린리더에도 목적이 드러난다.
        tabIndex={0}
        onScroll={handleScroll}
        // 드래그 중에는 스냅을 끈다. 켜두면 손가락을 따라오지 못한다.
        className="scrollbar-hidden flex min-h-0 flex-1 snap-x snap-mandatory select-none overflow-x-auto overscroll-x-contain active:snap-none"
      >
        {ONBOARDING_STEPS.map((step, index) => (
          <div key={step.id} className="flex w-full shrink-0 snap-start justify-center px-ds-20">
            {/*
              위에 붙인다. 진행바와의 간격이 시안값 그대로 유지되고, 남는 높이는 CTA 쪽으로 간다.
              짧은 화면에서는 max-h가 높이를 잡으므로 비율은 object-contain이 지킨다.
              첫 장만 즉시 받고 나머지는 스와이프할 때 받는다.
            */}
            <Image
              src={step.image}
              alt={step.alt}
              priority={index === 0}
              draggable={false}
              className="h-auto max-h-full w-full self-start object-contain"
            />
          </div>
        ))}
      </section>

      <ButtonStack className="content-container shrink-0 pt-ds-16 pb-ds-32">
        <Button onClick={isLastStep ? onStart : goToNextStep}>
          {isLastStep ? "또맛또 시작하기" : "다음으로"}
        </Button>
      </ButtonStack>
    </div>
  );
}
