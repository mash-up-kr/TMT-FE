"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGroupDetail } from "@/api/gen/group/group.gen";
import dummyImage from "@/shared/assets/dummy-image.png";
import { ROUTES } from "@/shared/constants/routes";
import { useJoinGroup } from "@/shared/hooks/useJoinGroup";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { Checkbox, CheckboxGroup } from "@/shared/ui/Checkbox";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { CancelIcon } from "@/shared/ui/Icons";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import { Spinner } from "@/shared/ui/Spinner";
import { cn } from "@/shared/utils/cn";
import { useReviewSharePages } from "../_hooks/useReviewSharePages";
import type { ReviewShareItem } from "../_model/reviewShare";
import { toReviewShareItems } from "../_utils/reviewShareMappers";

const SHARE_NOTICE =
  "리뷰 공유는 선택이에요. 다만 그룹 주제와 관련 없는 리뷰는 운영 정책에 따라 삭제될 수 있어요.";
const ERROR_MESSAGE = "공유할 리뷰를 불러오지 못했어요. 잠시 후 다시 시도해 주세요";
const EMPTY_MESSAGE = "공유할 리뷰가 없어요";

/**
 * 티켓이 있는 사람이 가입 팝업에서 `가입하기`를 누른 뒤, 가입과 함께 공유할 리뷰를 고르는
 * 화면이다. 공유는 가입 요청에 함께 실어야 하므로 가입도 이 화면이 맡는다.
 *
 * X와 하단 닫기는 가입하지 않고 그룹 상세로 돌아간다.
 * 공유하기는 선택한 리뷰와 함께 가입한다.
 */
export function ReviewShareScreen({ groupId }: Readonly<{ groupId: string }>) {
  const router = useRouter();
  const detail = useGroupDetail(groupId);
  const pages = useReviewSharePages(groupId);
  const join = useJoinGroup(groupId);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const items = toReviewShareItems(pages.data?.pages.flatMap((page) => page.items));

  const leaveWithoutJoining = () => router.replace(ROUTES.GROUPS.DETAIL(groupId));
  const shareSelected = async () => {
    if (!(await join.joinGroup({ sourceReviewIds: selectedIds }))) {
      return;
    }
    router.replace(ROUTES.GROUPS.DETAIL(groupId));
  };

  return (
    <>
      <GNB
        title="리뷰 공유"
        right={
          <IconButton
            aria-label="리뷰 공유 닫기"
            disabled={join.isPending}
            onClick={leaveWithoutJoining}
          >
            <CancelIcon thick />
          </IconButton>
        }
      />

      <main className="content-container flex min-h-0 flex-1 flex-col gap-ds-20 overflow-y-auto pt-ds-24">
        <div className="flex flex-col gap-ds-12">
          <h1 className="text-heading-lg text-content-primary">
            <span className="text-content-interactive-primary">{detail.data?.name}</span> 그룹에
            공유할
            <br />
            리뷰를 선택해 주세요
          </h1>
          <p className="rounded-ds-md bg-surface-secondary p-ds-16 text-body-md-medium text-content-tertiary">
            {SHARE_NOTICE}
          </p>
        </div>

        <ReviewShareList
          items={items}
          selectedIds={selectedIds}
          onSelectedIdsChange={setSelectedIds}
          isPending={pages.isPending}
          isError={pages.isError}
          onRetry={() => void pages.refetch()}
          hasNextPage={pages.hasNextPage}
          isFetchingNextPage={pages.isFetchingNextPage}
          onLoadMore={() => void pages.fetchNextPage()}
        />
      </main>

      <div className="content-container pt-ds-12 pb-ds-32">
        <ButtonStack type="horizontal">
          <Button variant="tertiary" disabled={join.isPending} onClick={leaveWithoutJoining}>
            닫기
          </Button>
          <Button loading={join.isPending} onClick={shareSelected}>
            공유하기
          </Button>
        </ButtonStack>
      </div>
    </>
  );
}

type ReviewShareListProps = Readonly<{
  items: ReviewShareItem[];
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}>;

function ReviewShareList({
  items,
  selectedIds,
  onSelectedIdsChange,
  isPending,
  isError,
  onRetry,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: ReviewShareListProps) {
  if (isError) {
    return (
      <div role="alert" className="flex flex-col items-center gap-ds-16 py-ds-48">
        <p className="text-body-md-regular text-content-secondary">{ERROR_MESSAGE}</p>
        <Button size="md" variant="tertiary" onClick={onRetry}>
          다시 시도
        </Button>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex justify-center py-ds-48">
        <Spinner />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="py-ds-48 text-center text-body-md-regular text-content-secondary">
        {EMPTY_MESSAGE}
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      <CheckboxGroup
        className="gap-0"
        aria-label="그룹에 공유할 리뷰"
        value={selectedIds}
        onValueChange={onSelectedIdsChange}
      >
        {items.map((item, index) => (
          <div
            key={item.reviewId}
            className={cn(
              "flex items-start gap-ds-8 py-ds-16",
              index < items.length - 1 && "border-stroke-secondary border-b",
            )}
          >
            <span className="flex items-center py-ds-4">
              {/* 체크박스가 16px이라 터치 영역이 부족하다. 가상 요소만 32까지 넓혀 레이아웃은
                  그대로 둔다. */}
              <Checkbox
                value={item.reviewId}
                aria-label={item.placeName}
                className="relative after:-inset-ds-8 after:absolute after:content-['']"
              />
            </span>
            <ImageWithFallback
              src={item.thumbnailUrl}
              fallbackSrc={dummyImage}
              alt=""
              className="size-ds-64 shrink-0 rounded-ds-sm object-cover"
            />
            <span className="flex min-w-0 flex-1 flex-col gap-ds-4 text-content-primary">
              <span className="truncate text-body-md-bold">{item.placeName}</span>
              <span className="line-clamp-2 text-body-md-regular">{item.contentPreview}</span>
            </span>
          </div>
        ))}
      </CheckboxGroup>
      {hasNextPage ? (
        <Button
          className="mt-ds-16 w-full"
          variant="tertiary"
          loading={isFetchingNextPage}
          onClick={onLoadMore}
        >
          리뷰 더보기
        </Button>
      ) : null}
    </div>
  );
}
