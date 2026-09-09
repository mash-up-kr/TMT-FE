"use client";

import { useRouter } from "next/navigation";
import { GroupCard } from "@/shared/components/GroupCard/GroupCard";
import { clearJoinGroupIntent } from "@/shared/constants/reviewJoinGroup";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { FireIcon } from "@/shared/ui/ColorIcons";
import { AlertCircleIcon } from "@/shared/ui/Icons";
import { useGroupJoinAfterReview } from "../../_hooks/useGroupJoinAfterReview";
import { ReviewStepLayout } from "../ReviewStepLayout";

const SHARE_NOTICE = "그룹 가입 시 작성한 리뷰는 자동으로 그룹에 공유돼요";
const ERROR_MESSAGE = "그룹 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요";

/**
 * 티켓이 모자라 리뷰 작성으로 넘어온 사람에게, 원래 가입하려던 그룹을 다시 보여준다.
 * 리뷰가 완성되지 않아 티켓을 받지 못했을 수도 있어 가입 가능 여부는 서버에 다시 묻는다.
 */
export function GroupJoinCompleteScreen({
  groupId,
  reviewId,
}: Readonly<{ groupId: string; reviewId: string | null }>) {
  const router = useRouter();
  const { group, isPending, isError, retry, isJoinable, joinGroup, isJoining } =
    useGroupJoinAfterReview({ groupId, reviewId });

  const leaveToGroups = () => {
    clearJoinGroupIntent();
    router.replace(ROUTES.GROUPS.ROOT);
  };

  // 리뷰는 이미 저장됐다. 그룹을 못 받았다고 이 화면에 가둘 이유가 없어 다시 받거나 나갈 길을 준다.
  if (isError || (!isPending && group === undefined)) {
    return (
      <div className="content-container flex flex-1 flex-col justify-center gap-ds-16">
        <p role="alert" className="text-center text-body-md-regular text-content-secondary">
          {ERROR_MESSAGE}
        </p>
        <ButtonStack type="horizontal">
          <Button variant="tertiary" className="whitespace-nowrap" onClick={leaveToGroups}>
            다른 그룹 보러가기
          </Button>
          <Button onClick={retry}>다시 시도</Button>
        </ButtonStack>
      </div>
    );
  }

  if (isPending || group === undefined) {
    return null;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ReviewStepLayout
        className="gap-ds-20 pt-ds-20"
        footer={
          <ButtonStack type="horizontal">
            <Button variant="tertiary" className="whitespace-nowrap" onClick={leaveToGroups}>
              다른 그룹 보러가기
            </Button>
            <Button disabled={!isJoinable} loading={isJoining} onClick={joinGroup}>
              그룹 가입하기
            </Button>
          </ButtonStack>
        }
      >
        <header className="flex flex-col gap-ds-8">
          <p className="flex items-center gap-ds-4 text-body-md-bold text-content-interactive-primary">
            <FireIcon className="size-ds-20 shrink-0" />
            리뷰 쓰기 완료!
          </p>
          <h1 className="text-heading-lg text-content-primary">
            방금 가입하려고 했던 그룹이
            <br />
            <span className="text-content-interactive-primary">{group.name}</span>인가요?
          </h1>
        </header>

        <GroupCard
          thumbnail={group.coverImages.at(0)?.url ?? group.imageUrl ?? null}
          title={group.name}
          description={group.oneLineDescription}
          memberCount={group.memberCount}
          reviewCount={group.reviewCount}
          placeCount={group.placeCount}
          matchedCount={group.matchedSavedPlaceCount}
        />

        <p className="flex items-center gap-ds-4 text-body-md-medium text-content-tertiary">
          <AlertCircleIcon size={16} className="shrink-0" />
          {SHARE_NOTICE}
        </p>
      </ReviewStepLayout>
    </div>
  );
}
