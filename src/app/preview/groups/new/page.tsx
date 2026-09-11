"use client";

import { useEffect, useRef, useState } from "react";
import type { GroupTagOptions } from "@/app/groups/_model/groupTag";
import { GroupCreateScreen } from "@/app/groups/new/_components/GroupCreateScreen";
import type {
  GroupCreateDraft,
  GroupCreateStep,
  GroupCreateTagSheet,
  GroupReviewOption,
  GroupReviewOptionsStatus,
  GroupTagOptionsStatus,
} from "@/app/groups/new/_model/groupCreate";
import { toast } from "@/shared/ui/Toast";
import { cn } from "@/shared/utils/cn";

const SWITCHER = [
  "fixed top-ds-12 left-ds-12 z-overlay flex w-[168px] flex-col gap-ds-4",
  "min-[431px]:left-auto min-[431px]:right-[calc(50%_+_215px_+_var(--spacing-ds-16))]",
].join(" ");

const TAG_OPTIONS: GroupTagOptions = {
  categories: [
    { id: "food_1", label: "한식" },
    { id: "food_2", label: "일식" },
    { id: "food_3", label: "중식" },
    { id: "food_4", label: "양식" },
    { id: "food_5", label: "카페·디저트" },
  ],
  regions: [
    { id: "region_1", label: "서울 전체" },
    { id: "region_2", label: "성동구" },
    { id: "region_3", label: "마포구" },
    { id: "region_4", label: "강남구" },
    { id: "region_5", label: "송파구" },
  ],
};

const FILLED_DRAFT: Partial<GroupCreateDraft> = {
  groupName: "나는야 초밥왕",
  summaryDescription: "회전 초밥부터 오마카세까지",
  foodCategoryId: "food_2",
  regionIds: ["region_1", "region_2"],
  detailedDescription: "맛있는 초밥을 찾아다니는 사람들과 새로운 가게를 함께 발견해요.",
};

const REVIEW_OPTIONS: GroupReviewOption[] = [
  {
    reviewId: "review_1",
    placeName: "한판승부",
    thumbnailUrl: null,
    contentPreview:
      "처음엔 미나리가 특이해서 왔는데, 이제는 고기보다 미나리 생각나서 오는 집. 같이 간 친구들 다 만족해서 단골만 셋 생겼어요. 고기 구우면서 수다 떨기 딱 좋은 분위기입니다.",
  },
  {
    reviewId: "review_2",
    placeName: "마이니치라멘",
    thumbnailUrl: null,
    contentPreview: "진한 돈코츠 국물에 차슈가 두툼해요. 점심엔 웨이팅이 있으니 조금 일찍 가세요.",
  },
  {
    reviewId: "review_3",
    placeName: "본문 없이 사진만 올린 리뷰",
    thumbnailUrl: null,
    contentPreview: null,
  },
  {
    reviewId: "review_4",
    placeName: "이름이 아주 길어서 한 줄에 다 들어가지 않는 매장 선릉역 본점",
    thumbnailUrl: null,
    contentPreview: "매장명이 길면 한 줄로 자른다.",
  },
  {
    reviewId: "review_5",
    placeName: "솥내음강남역삼 선릉역점",
    thumbnailUrl: null,
    contentPreview: "솥밥이 바로 지어져 나와요. 누룽지까지 알차게 먹고 왔습니다.",
  },
];

const REVIEWS_DRAFT: Partial<GroupCreateDraft> = {
  ...FILLED_DRAFT,
  reviewIds: ["review_1"],
};

const MAX_DESCRIPTION_DRAFT: Partial<GroupCreateDraft> = {
  ...FILLED_DRAFT,
  detailedDescription: "가".repeat(200),
};

type Scenario = {
  key: string;
  label: string;
  step: GroupCreateStep;
  draft?: Partial<GroupCreateDraft>;
  tagOptionsStatus?: GroupTagOptionsStatus;
  openTagSheet?: GroupCreateTagSheet;
  reviewOptions?: GroupReviewOption[];
  reviewOptionsStatus?: GroupReviewOptionsStatus;
  hasNextReviewPage?: boolean;
  isCreating?: boolean;
  createResult?: "success" | "error";
};

const SCENARIOS: Scenario[] = [
  { key: "basic-empty", label: "1 · 기본 정보", step: "basicInfo" },
  { key: "basic-filled", label: "1 · 입력 완료", step: "basicInfo", draft: FILLED_DRAFT },
  { key: "tags", label: "2 · 태그 선택", step: "tags", draft: FILLED_DRAFT },
  {
    key: "tags-pending",
    label: "2 · 태그 로딩",
    step: "tags",
    draft: FILLED_DRAFT,
    tagOptionsStatus: "pending",
    openTagSheet: "category",
  },
  {
    key: "tags-error",
    label: "2 · 태그 실패",
    step: "tags",
    draft: FILLED_DRAFT,
    tagOptionsStatus: "error",
    openTagSheet: "category",
  },
  { key: "image", label: "3 · 대표 이미지", step: "image", draft: FILLED_DRAFT },
  { key: "description", label: "4 · 상세 소개", step: "description", draft: FILLED_DRAFT },
  {
    key: "description-max",
    label: "4 · 200자",
    step: "description",
    draft: MAX_DESCRIPTION_DRAFT,
  },
  { key: "reviews", label: "5 · 리뷰 선택", step: "reviews", draft: REVIEWS_DRAFT },
  {
    key: "reviews-more",
    label: "5 · 리뷰 더보기",
    step: "reviews",
    draft: REVIEWS_DRAFT,
    hasNextReviewPage: true,
  },
  {
    key: "reviews-empty",
    label: "5 · 리뷰 없음",
    step: "reviews",
    draft: FILLED_DRAFT,
    reviewOptions: [],
  },
  {
    key: "reviews-pending",
    label: "5 · 리뷰 로딩",
    step: "reviews",
    draft: FILLED_DRAFT,
    reviewOptionsStatus: "pending",
  },
  {
    key: "reviews-error",
    label: "5 · 리뷰 실패",
    step: "reviews",
    draft: FILLED_DRAFT,
    reviewOptionsStatus: "error",
  },
  {
    key: "creating",
    label: "5 · 생성 중",
    step: "reviews",
    draft: REVIEWS_DRAFT,
    isCreating: true,
  },
  {
    key: "create-success",
    label: "5 · 생성 성공",
    step: "reviews",
    draft: REVIEWS_DRAFT,
    createResult: "success",
  },
  {
    key: "create-error",
    label: "5 · 생성 실패",
    step: "reviews",
    draft: REVIEWS_DRAFT,
    createResult: "error",
  },
];

export default function GroupCreatePreviewPage() {
  const [scenarioKey, setScenarioKey] = useState(SCENARIOS[0].key);
  const previewToastIdRef = useRef<string | null>(null);
  const scenario = SCENARIOS.find((item) => item.key === scenarioKey) ?? SCENARIOS[0];

  useEffect(() => {
    return () => {
      if (previewToastIdRef.current) {
        toast.close(previewToastIdRef.current);
      }
    };
  }, []);

  function showCreateResult(result: "success" | "error") {
    if (previewToastIdRef.current) {
      toast.close(previewToastIdRef.current);
    }

    previewToastIdRef.current =
      result === "success"
        ? toast.success("그룹 생성이 완료되었어요.")
        : toast.error("그룹 생성에 실패했어요. 다시 시도해 주세요.");
  }

  function handleScenarioChange(nextScenario: Scenario) {
    if (previewToastIdRef.current) {
      toast.close(previewToastIdRef.current);
      previewToastIdRef.current = null;
    }

    setScenarioKey(nextScenario.key);

    if (nextScenario.createResult) {
      showCreateResult(nextScenario.createResult);
    }
  }

  return (
    <>
      <GroupCreateScreen
        key={scenario.key}
        tagOptionsState={{
          options: TAG_OPTIONS,
          status: scenario.tagOptionsStatus ?? "success",
        }}
        reviewOptionsState={{
          options: scenario.reviewOptions ?? REVIEW_OPTIONS,
          status: scenario.reviewOptionsStatus ?? "success",
          hasNextPage: scenario.hasNextReviewPage ?? false,
          isFetchingNextPage: false,
        }}
        isCreating={scenario.isCreating ?? false}
        initialState={{
          step: scenario.step,
          draft: scenario.draft,
          openTagSheet: scenario.openTagSheet,
        }}
        onRetryTagOptionsAction={() => toast.success("태그를 다시 불러왔어요.")}
        onLoadMoreReviewOptionsAction={() => toast.success("리뷰를 더 불러왔어요.")}
        onRetryReviewOptionsAction={() => toast.success("리뷰를 다시 불러왔어요.")}
        onCreateAction={() => showCreateResult(scenario.createResult ?? "success")}
      />

      <nav aria-label="프리뷰 상태" className={SWITCHER}>
        {SCENARIOS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => handleScenarioChange(item)}
            className={cn(
              "rounded-ds-xs px-ds-8 py-ds-4 text-left text-body-sm-medium",
              item.key === scenario.key
                ? "bg-surface-inverse text-content-interactive-inverse"
                : "bg-surface-primary text-content-secondary",
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </>
  );
}
