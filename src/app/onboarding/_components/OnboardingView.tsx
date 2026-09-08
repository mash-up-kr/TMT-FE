"use client";

import Image from "next/image";
import { type UIEvent, useState } from "react";
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
 * 시안에 다음 버튼이 없고 CTA가 네 장 모두 같아, 가로 스와이프로 넘기고 CTA는 어느 장에서든
 * 나가는 상시 진입구로 본다. 진행바는 현재 장을 표시한다.
 */
export function OnboardingView({ onSkip, onStart }: OnboardingViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dragScroll = useDragScroll<HTMLElement>();

  function handleScroll(event: UIEvent<HTMLElement>) {
    const { scrollLeft, clientWidth } = event.currentTarget;

    if (clientWidth > 0) {
      setCurrentIndex(
        Math.max(0, Math.min(ONBOARDING_STEP_COUNT - 1, Math.round(scrollLeft / clientWidth))),
      );
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface-primary">
      <header className="flex h-(--layout-gnb-height) shrink-0 items-center justify-end px-ds-20">
        <button
          type="button"
          onClick={onSkip}
          className="text-body-lg-regular text-content-disabled"
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
        {...dragScroll}
        aria-label="또맛또 소개"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: 가로 스크롤 영역이라 키보드로 장을 넘길 유일한 수단이다. 이름을 가진 region이라 스크린리더에도 목적이 드러난다.
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
              className="h-auto max-h-full w-full self-start object-contain"
            />
          </div>
        ))}
      </section>

      <ButtonStack className="content-container shrink-0 pt-ds-16 pb-ds-32">
        <Button onClick={onStart}>또맛또 시작하기</Button>
      </ButtonStack>
    </div>
  );
}
