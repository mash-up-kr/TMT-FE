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

function StepIndicator({ current, total }: StepIndicatorProps) {
  return (
    // 시안 점 6px, 간격 6px. ds 스케일에 6이 없어 기본 스케일을 쓴다.
    <div role="img" aria-label={`${total}단계 중 ${current + 1}단계`} className="flex gap-1.5">
      {Array.from({ length: total }, (_, index) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: 점은 순서 자체가 정체성이다.
          key={index}
          className={cn(
            "h-1.5 rounded-ds-full",
            index === current
              ? "w-ds-16 bg-surface-interactive-primary"
              : "w-1.5 bg-surface-tertiary",
          )}
        />
      ))}
    </div>
  );
}
