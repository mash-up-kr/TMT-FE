"use client";

import { useRouter } from "next/navigation";
import { useJoinPreview } from "@/api/gen/group-membership/group-membership.gen";
import groupFallbackImage from "@/shared/assets/dummy.png";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { FireIcon } from "@/shared/ui/ColorIcons";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import { cn } from "@/shared/utils/cn";
import { withReviewReturnTo } from "@/shared/utils/reviewNavigation";
import { type ReviewStepSegment, reviewStepPath } from "../../_constants/steps";
import type { ReviewMissingStep } from "../../_model/save";
import { useReviewFlowBase, useReviewFlowReturnTo } from "../../_stores/ReviewFlowBaseProvider";
import { ReviewStepLayout } from "../ReviewStepLayout";

const cardStyles = "rounded-ds-md border border-stroke-secondary bg-surface-primary p-ds-16";

/**
 * 리뷰는 저장했지만 티켓 조건을 못 채워 티켓이 나가지 않은 상태.
 *
 * 여기서 "그룹 가입하기"를 띄우면 티켓 부족 시트 → 리뷰 작성 → 이 화면으로 되돌아 무한히 돈다.
 * 그래서 가입 대신 남은 항목을 채우도록 보낸다.
 */
export function TicketPendingCompleteScreen({
  groupId,
  missingSteps,
  nextStep,
  onLeave,
}: Readonly<{
  groupId: string;
  /** 뱃지로 보여줄 남은 항목. 아직 모르면 비어 있다. */
  missingSteps: readonly ReviewMissingStep[];
  /** "이어서 채우기"가 향할 단계. 남은 항목 중 가장 앞선 것이다. */
  nextStep: ReviewStepSegment;
  onLeave: () => void;
}>) {
  const router = useRouter();
  const basePath = useReviewFlowBase();
  const returnTo = useReviewFlowReturnTo();
  const joinPreview = useJoinPreview(groupId);
  const preview = joinPreview.data;

  // 완료 화면은 히스토리에 남기지 않는다. 채우다 뒤로 가면 다시 이 화면이 아니라 하던 흐름이다.
  const continueFilling = () =>
    router.replace(withReviewReturnTo(reviewStepPath(basePath, nextStep), returnTo));

  return (
    <ReviewStepLayout
      className="gap-ds-20 pt-ds-20"
      footer={
        <ButtonStack type="horizontal">
          <Button variant="tertiary" className="whitespace-nowrap" onClick={onLeave}>
            나중에 하기
          </Button>
          <Button className="whitespace-nowrap" onClick={continueFilling}>
            이어서 채우기
          </Button>
        </ButtonStack>
      }
    >
      <header className="flex flex-col gap-ds-8">
        <p className="flex items-center gap-ds-4 text-body-md-bold text-content-interactive-primary">
          <FireIcon className="size-ds-20 shrink-0" />
          리뷰 쓰기 완료!
        </p>
        <h1 className="text-heading-lg text-content-primary">조금만 더 채우면 티켓을 받아요</h1>
        <p className="text-body-lg-medium text-content-tertiary">쓰던 내용은 그대로 있어요</p>
      </header>

      <section className={cn("flex flex-col gap-ds-12", cardStyles)}>
        <div className="flex flex-col gap-ds-8">
          {/* 보유 수도 가입 미리보기에서 받는다. 저장 응답과 달리 새로고침해도 남는다. */}
          <p className="flex items-end gap-ds-8 text-content-primary">
            <span className="pb-ds-4 text-body-md-medium">내 티켓</span>
            <span className="text-heading-xl">{preview?.availableTicketCount ?? 0}장</span>
          </p>
          <p className="text-body-md-medium text-content-tertiary">
            아래를 채우면 티켓을 받을 수 있어요
          </p>
        </div>
        <ul className="flex gap-ds-4">
          {missingSteps.map(({ step, label }) => (
            <li key={step}>
              <Badge tone="neutral-weak" size="xs" shape="square">
                {label}
              </Badge>
            </li>
          ))}
        </ul>
      </section>

      {/* 그룹은 못 불러와도 남은 항목을 채우는 데는 지장이 없다. 이 줄만 비운다. */}
      {preview !== undefined && (
        <section className={cn("flex items-center gap-ds-12", cardStyles)}>
          <ImageWithFallback
            src={preview.group.imageUrl ?? null}
            fallbackSrc={groupFallbackImage}
            alt=""
            width={48}
            height={48}
            className="size-ds-48 shrink-0 rounded-ds-sm object-cover"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-ds-4">
            <p className="text-body-lg-bold text-content-primary">
              <span className="text-content-interactive-primary">{preview.group.name}</span>
              {" 그룹에 가입하려면"}
            </p>
            <p className="text-body-md-medium text-content-secondary">
              티켓 {preview.requiredTicketCount}장이 필요해요
            </p>
          </div>
        </section>
      )}
    </ReviewStepLayout>
  );
}
