"use client";

import Image from "next/image";
import { useState } from "react";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { cn } from "@/shared/utils/cn";
import {
  TICKET_ONBOARDING_STEP_COUNT,
  TICKET_ONBOARDING_STEPS,
} from "../_constants/ticketOnboarding";

/** 콘텐츠와 인디케이터가 한 몸으로 움직여야 자연스러우므로 같은 시간·곡선을 쓴다. */
const STEP_TRANSITION = "duration-250 ease-in-out motion-reduce:transition-none";

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
        {/* 본문 좌우 여백까지 넓혀야 넘어가는 장이 여백 경계에서 잘려 보이지 않는다. */}
        <div className="-mx-ds-20 self-stretch overflow-hidden">
          <div
            className={cn("flex transition-transform", STEP_TRANSITION)}
            style={{ transform: `translateX(-${stepIndex * 100}%)` }}
          >
            {TICKET_ONBOARDING_STEPS.map((item, index) => (
              <div
                key={item.id}
                // 화면 밖 장은 스크린리더와 포커스에서 뺀다.
                inert={index !== stepIndex}
                className="flex w-full shrink-0 flex-col items-center gap-ds-12 px-ds-20"
              >
                <Image
                  src={item.image}
                  alt=""
                  width={320}
                  height={179}
                  sizes="320px"
                  // 넘기는 순간 비어 보이지 않게 뒤 장도 미리 받는다.
                  priority={index === 0}
                  loading={index === 0 ? undefined : "eager"}
                  draggable={false}
                  className="h-auto w-full max-w-80"
                />
                <div className="flex w-full flex-col gap-ds-8 text-center">
                  <h2 className="whitespace-pre-line text-content-primary text-heading-lg">
                    {item.title}
                  </h2>
                  <p className="text-body-lg-regular text-content-primary">{item.description}</p>
                </div>
              </div>
            ))}
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

function StepIndicator({ current, total }: StepIndicatorProps) {
  return (
    // 시안 점 6px, 간격 6px. ds 스케일에 6이 없어 기본 스케일을 쓴다.
    <div role="img" aria-label={`${total}단계 중 ${current + 1}단계`} className="flex gap-1.5">
      {Array.from({ length: total }, (_, index) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: 점은 순서 자체가 정체성이다.
          key={index}
          className={cn(
            "h-1.5 rounded-ds-full transition-[width,background-color]",
            STEP_TRANSITION,
            index === current
              ? "w-ds-16 bg-surface-interactive-primary"
              : "w-1.5 bg-surface-tertiary",
          )}
        />
      ))}
    </div>
  );
}
