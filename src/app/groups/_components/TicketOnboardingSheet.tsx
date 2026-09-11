"use client";

import Image from "next/image";
import { useState } from "react";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import {
  TICKET_ONBOARDING_STEP_COUNT,
  TICKET_ONBOARDING_STEPS,
} from "../_constants/ticketOnboarding";

type TicketOnboardingSheetProps = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
};

/**
 * 그룹 탭 첫 진입에 티켓 흐름(리뷰 → 티켓 → 그룹 가입)을 3장으로 안내하는 시트.
 *
 * 장은 CTA로만 넘긴다. 가로 스와이프를 두면 시트의 세로 스와이프 닫기와 제스처가 겹친다.
 * 마지막 장의 CTA가 시트를 닫는다.
 */
export function TicketOnboardingSheet({ open, onOpenChangeAction }: TicketOnboardingSheetProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [wasOpen, setWasOpen] = useState(open);

  // 다시 열리면 첫 장부터 보여준다. 닫힐 때 되돌리면 내려가는 동안 첫 장으로 바뀌어 보인다.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setStepIndex(0);
  }

  const step = TICKET_ONBOARDING_STEPS[stepIndex] ?? TICKET_ONBOARDING_STEPS[0];
  const isLastStep = stepIndex === TICKET_ONBOARDING_STEP_COUNT - 1;

  return (
    <BottomSheet
      label="티켓 안내"
      open={open}
      onOpenChange={onOpenChangeAction}
      footer={
        <ButtonStack>
          <Button
            onClick={() => (isLastStep ? onOpenChangeAction(false) : setStepIndex(stepIndex + 1))}
          >
            {step.ctaLabel}
          </Button>
        </ButtonStack>
      }
    >
      <div className="flex flex-col items-center gap-ds-24 pb-ds-12">
        <div className="flex w-full flex-col items-center gap-ds-12">
          <Image
            src={step.image}
            alt=""
            width={320}
            height={179}
            sizes="320px"
            priority={stepIndex === 0}
            draggable={false}
            className="h-auto w-full max-w-80"
          />
          <div className="flex w-full flex-col gap-ds-8 text-center">
            <h2 className="whitespace-pre-line text-content-primary text-heading-lg">
              {step.title}
            </h2>
            <p className="text-body-lg-regular text-content-primary">{step.description}</p>
          </div>
        </div>
        <StepIndicator current={stepIndex} total={TICKET_ONBOARDING_STEP_COUNT} />
      </div>
    </BottomSheet>
  );
}

type StepIndicatorProps = {
  current: number;
  total: number;
};

// 시안 점 6px, 간격 6px, 현재 단계 16px. 위치를 계산해 절대 배치하므로 px 값으로 둔다.
const DOT_SIZE = 6;
const DOT_PITCH = DOT_SIZE + 6;
const ACTIVE_WIDTH = 16;
/** 앞쪽 끝이 먼저 출발하고 뒤쪽 끝이 이만큼 늦게 따라가며 늘어났다 줄어든다. */
const TRAIL_DELAY = "120ms";

/**
 * 현재 단계 알약이 다음 점까지 늘어난 뒤 뒤쪽이 따라붙는 인디케이터.
 *
 * 회색 점은 뒤에 깔고 알약을 위에 겹친다. 알약의 좌우 끝을 따로 옮겨야 늘어나는 모양이 나오므로
 * 폭이 아니라 `left`·`right`를 전환하고, 진행 방향에 따라 어느 끝을 늦출지 정한다.
 */
function StepIndicator({ current, total }: StepIndicatorProps) {
  const [previous, setPrevious] = useState(current);
  const [forward, setForward] = useState(true);

  if (current !== previous) {
    setPrevious(current);
    setForward(current > previous);
  }

  const width = (total - 1) * DOT_PITCH + ACTIVE_WIDTH;
  const activeLeft = current * DOT_PITCH;

  return (
    <div
      role="img"
      aria-label={`${total}단계 중 ${current + 1}단계`}
      className="relative h-1.5"
      style={{ width }}
    >
      {Array.from({ length: total }, (_, index) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: 점은 순서 자체가 정체성이다.
          key={index}
          className="absolute top-0 size-1.5 rounded-ds-full bg-surface-tertiary transition-[left] duration-300 ease-out motion-reduce:transition-none"
          style={{ left: index * DOT_PITCH + dotOffset(index, current) }}
        />
      ))}
      <span
        className="absolute inset-y-0 rounded-ds-full bg-surface-interactive-primary transition-[left,right] duration-200 ease-in-out motion-reduce:transition-none"
        style={{
          left: activeLeft,
          right: width - activeLeft - ACTIVE_WIDTH,
          transitionDelay: forward ? `${TRAIL_DELAY}, 0ms` : `0ms, ${TRAIL_DELAY}`,
        }}
      />
    </div>
  );
}

/** 알약보다 뒤에 있는 점은 알약 폭만큼 밀리고, 알약 아래 점은 가운데에 숨는다. */
function dotOffset(index: number, current: number) {
  if (index < current) return 0;
  if (index === current) return (ACTIVE_WIDTH - DOT_SIZE) / 2;
  return ACTIVE_WIDTH - DOT_SIZE;
}
