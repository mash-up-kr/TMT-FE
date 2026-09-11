import { useId } from "react";
import dummyImage from "@/shared/assets/dummy-image.png";
import emptyMascot from "@/shared/components/assets/mascot-empty.png";
import { EmptyNotice } from "@/shared/components/EmptyNotice/EmptyNotice";
import { Button } from "@/shared/ui/Button";
import { Checkbox, CheckboxGroup } from "@/shared/ui/Checkbox";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import { RetryNotice } from "@/shared/ui/RetryNotice";
import { Spinner } from "@/shared/ui/Spinner";
import type { GroupReviewOptionsState } from "../_model/groupCreate";
import { GroupCreateStepHeader } from "./GroupCreateStepHeader";

const ERROR_MESSAGE = "리뷰를 불러오지 못했어요. 잠시 후 다시 시도해 주세요";

type GroupReviewSelectionStepProps = {
  reviewOptionsState: GroupReviewOptionsState;
  selectedReviewIds: string[];
  onSelectedReviewIdsChangeAction: (reviewIds: string[]) => void;
  onLoadMoreReviewOptionsAction: () => void;
  onRetryReviewOptionsAction: () => void;
};

export function GroupReviewSelectionStep(props: GroupReviewSelectionStepProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-ds-24">
      <GroupCreateStepHeader
        title={"새로 만들 그룹에\n공유할 리뷰를 골라볼까요?"}
        required={false}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <GroupReviewOptionList {...props} />
      </div>
    </div>
  );
}

function GroupReviewOptionList({
  reviewOptionsState: { options, status, hasNextPage, isFetchingNextPage },
  selectedReviewIds,
  onSelectedReviewIdsChangeAction,
  onLoadMoreReviewOptionsAction,
  onRetryReviewOptionsAction,
}: GroupReviewSelectionStepProps) {
  const idPrefix = useId();

  if (status === "error") {
    return <RetryNotice message={ERROR_MESSAGE} onRetry={onRetryReviewOptionsAction} />;
  }

  if (status === "pending") {
    return (
      <div className="flex flex-1 items-center justify-center py-ds-48">
        <Spinner />
      </div>
    );
  }

  if (options.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center py-ds-24">
        <EmptyNotice src={emptyMascot} title="아직 작성한 리뷰가 없어요">
          그룹을 만든 뒤에 리뷰를 추가할 수 있어요
        </EmptyNotice>
      </div>
    );
  }

  return (
    <>
      <CheckboxGroup
        className="gap-0"
        aria-label="새 그룹에 공유할 리뷰"
        value={selectedReviewIds}
        onValueChange={onSelectedReviewIdsChangeAction}
      >
        {options.map((option) => (
          <label
            key={option.reviewId}
            htmlFor={`${idPrefix}-${option.reviewId}`}
            className="flex items-start gap-ds-8 border-stroke-secondary border-b py-ds-16"
          >
            <span className="flex items-center py-ds-4">
              <Checkbox
                id={`${idPrefix}-${option.reviewId}`}
                value={option.reviewId}
                aria-label={option.placeName}
              />
            </span>
            <ImageWithFallback
              src={option.thumbnailUrl}
              fallbackSrc={dummyImage}
              alt=""
              width={64}
              height={64}
              className="size-ds-64 shrink-0 rounded-ds-xs object-cover"
            />
            <span className="flex min-w-0 flex-1 flex-col gap-ds-4 text-content-primary">
              <span className="truncate text-body-md-bold">{option.placeName}</span>
              {option.contentPreview ? (
                <span className="line-clamp-2 text-body-md-regular">{option.contentPreview}</span>
              ) : null}
            </span>
          </label>
        ))}
      </CheckboxGroup>
      {hasNextPage ? (
        <Button
          className="mt-ds-16 w-full shrink-0"
          variant="tertiary"
          loading={isFetchingNextPage}
          onClick={onLoadMoreReviewOptionsAction}
        >
          리뷰 더보기
        </Button>
      ) : null}
    </>
  );
}
