"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useListSaves } from "@/api/gen/save/save.gen";
import dummyImage from "@/shared/assets/dummy-image.png";
import {
  bindJoinGroupToSave,
  resolveContinueDraftExitPath,
  syncJoinGroupIntent,
} from "@/shared/constants/reviewJoinGroup";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { CancelIcon } from "@/shared/ui/Icons";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import { Radio, RadioGroup } from "@/shared/ui/Radio";
import { cn } from "@/shared/utils/cn";
import { getReviewReturnTo, withReviewReturnTo } from "@/shared/utils/reviewNavigation";
import { draftReviewBasePath } from "../_constants/steps";
import type { ContinuableDraft } from "../_model/draft";
import { mapContinuableDrafts } from "../_utils/reviewApiMappers";
import { StatusMessage } from "./StatusMessage";

const LOADING_MESSAGE = "작성 중인 리뷰를 불러오는 중이에요";
const ERROR_MESSAGE = "작성 중인 리뷰를 불러오지 못했어요. 잠시 후 다시 시도해 주세요";
const EMPTY_MESSAGE = "작성 중인 리뷰가 없어요";

export function ContinueDraftScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const saves = useListSaves();
  const [selectedSaveId, setSelectedSaveId] = useState<string | null>(null);

  // 그룹에서 왔는지는 URL이 말해 준다. 새로 쓰기 입구와 같은 규칙이라 마이페이지에서 온 사람에게
  // 지난 그룹이 따라붙지 않고, 뒤로 와서 다른 초안을 다시 골라도 그 그룹에 새로 묶인다.
  useEffect(() => {
    syncJoinGroupIntent(window.location.search);
  }, []);

  const drafts = mapContinuableDrafts(saves.data?.items);
  const returnTo = getReviewReturnTo(searchParams);
  const firstContinuable = drafts.find((draft) => draft.canContinue);
  // 목록이 한 번 그려진 뒤에는 선택을 유지한다. 처음에는 첫 항목을 골라 둔다.
  const selected = drafts.some((draft) => draft.saveId === selectedSaveId && draft.canContinue)
    ? selectedSaveId
    : (firstContinuable?.saveId ?? null);

  const exitSelection = () => router.push(resolveContinueDraftExitPath());
  // 초안이 확정되는 순간이다. 그룹 때문에 시작한 흐름이면 여기서 묶어야 완료 화면이 그룹으로 이어준다.
  const continueWith = (saveId: string) => {
    bindJoinGroupToSave(saveId);
    router.push(withReviewReturnTo(draftReviewBasePath(saveId), returnTo));
  };

  return (
    <>
      <GNB
        title="리뷰 쓰기"
        right={
          <IconButton aria-label="이어쓰기 선택 닫기" onClick={exitSelection}>
            <CancelIcon thick />
          </IconButton>
        }
      />

      <main className="content-container flex min-h-0 flex-1 flex-col gap-ds-24 overflow-y-auto pt-ds-20">
        <h1 className="whitespace-pre-line text-heading-lg text-content-primary">
          {"이어서 작성할 리뷰를\n선택해 주세요"}
        </h1>

        <DraftList
          drafts={drafts}
          selected={selected}
          onSelect={setSelectedSaveId}
          isError={saves.isError}
          isPending={saves.isPending}
        />
      </main>

      <div className="content-container shrink-0 pt-ds-12 pb-ds-32">
        <ButtonStack type="horizontal">
          <Button variant="tertiary" onClick={exitSelection}>
            취소
          </Button>
          <Button
            disabled={selected === null}
            onClick={() => selected !== null && continueWith(selected)}
          >
            이어서 작성하기
          </Button>
        </ButtonStack>
      </div>
    </>
  );
}

type DraftListProps = {
  drafts: ContinuableDraft[];
  selected: string | null;
  onSelect: (saveId: string) => void;
  isError: boolean;
  isPending: boolean;
};

function DraftList({ drafts, selected, onSelect, isError, isPending }: DraftListProps) {
  if (isError) {
    return <StatusMessage tone="error">{ERROR_MESSAGE}</StatusMessage>;
  }

  if (isPending) {
    return <StatusMessage>{LOADING_MESSAGE}</StatusMessage>;
  }

  if (drafts.length === 0) {
    return <StatusMessage>{EMPTY_MESSAGE}</StatusMessage>;
  }

  return (
    <RadioGroup
      className="gap-0"
      aria-label="이어서 작성할 리뷰"
      value={selected}
      onValueChange={(value) => onSelect(String(value))}
    >
      {drafts.map((draft, index) => (
        <div
          key={draft.saveId}
          className={cn(
            "flex items-start gap-ds-8 py-ds-16",
            index < drafts.length - 1 && "border-stroke-secondary border-b",
          )}
        >
          <span className="flex items-center py-ds-4">
            {/* 시안의 라디오는 16px이라 터치 영역이 부족하다. IconButton과 같은 방식으로
                가상 요소만 32까지 넓혀 레이아웃은 그대로 둔다. */}
            <Radio
              value={draft.saveId}
              aria-label={draft.placeName}
              aria-describedby={draft.canContinue ? undefined : `${draft.saveId}-unavailable`}
              disabled={!draft.canContinue}
              className="after:-inset-ds-8 after:absolute after:content-['']"
            />
          </span>
          <ImageWithFallback
            src={draft.thumbnailUrl}
            fallbackSrc={dummyImage}
            alt=""
            className="size-ds-48 shrink-0 rounded-ds-sm border border-stroke-secondary object-cover"
          />
          <span className="flex min-w-0 flex-1 flex-col gap-ds-4">
            <span className="truncate text-body-lg-bold text-content-primary">
              {draft.placeName}
            </span>
            <span className="truncate text-body-md-regular text-content-primary">
              {draft.roadAddress}
            </span>
            {!draft.canContinue && (
              <span
                id={`${draft.saveId}-unavailable`}
                className="text-body-sm-regular text-content-tertiary"
              >
                사진이 있는 리뷰는 아직 이어 쓸 수 없어요
              </span>
            )}
          </span>
        </div>
      ))}
    </RadioGroup>
  );
}
