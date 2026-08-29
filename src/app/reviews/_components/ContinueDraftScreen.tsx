"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useListSaves } from "@/api/gen/save/save.gen";
import dummyImage from "@/shared/assets/dummy-image.png";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { CancelIcon } from "@/shared/ui/Icons";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import { Radio, RadioGroup } from "@/shared/ui/Radio";
import { cn } from "@/shared/utils/cn";
import { draftReviewBasePath } from "../_constants/steps";
import type { ContinuableDraft } from "../_model/draft";
import { mapContinuableDrafts } from "../_utils/reviewApiMappers";
import { StatusMessage } from "./StatusMessage";

const LOADING_MESSAGE = "작성 중인 리뷰를 불러오는 중이에요";
const ERROR_MESSAGE = "작성 중인 리뷰를 불러오지 못했어요. 잠시 후 다시 시도해 주세요";
const EMPTY_MESSAGE = "작성 중인 리뷰가 없어요";

export function ContinueDraftScreen() {
  const router = useRouter();
  const saves = useListSaves();
  const [selectedSaveId, setSelectedSaveId] = useState<string | null>(null);

  const drafts = mapContinuableDrafts(saves.data?.items);
  // 목록이 한 번 그려진 뒤에는 선택을 유지한다. 첫 항목 기본 선택은 시안(1033:11306)을 따른다.
  const selected = selectedSaveId ?? drafts.at(0)?.saveId ?? null;

  const exitToProfile = () => router.push(ROUTES.PROFILE.ME_REVIEWS);

  return (
    <>
      <GNB
        title="리뷰 쓰기"
        right={
          <IconButton aria-label="이어쓰기 선택 닫기" onClick={exitToProfile}>
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

      <div className="content-container pt-ds-12 pb-ds-32">
        <ButtonStack type="horizontal">
          <Button variant="tertiary" onClick={exitToProfile}>
            취소
          </Button>
          <Button
            disabled={selected === null}
            onClick={() => selected !== null && router.push(draftReviewBasePath(selected))}
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
          </span>
        </div>
      ))}
    </RadioGroup>
  );
}
