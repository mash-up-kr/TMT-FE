"use client";

import { useEffect, useRef, useState } from "react";
import type { GroupTagOptions } from "@/app/groups/_model/groupTag";
import { GroupCreateScreen } from "@/app/groups/new/_components/GroupCreateScreen";
import type {
  GroupCreateDraft,
  GroupCreateStep,
  GroupCreateTagSheet,
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
  {
    key: "creating",
    label: "4 · 생성 중",
    step: "description",
    draft: FILLED_DRAFT,
    isCreating: true,
  },
  {
    key: "create-success",
    label: "4 · 생성 성공",
    step: "description",
    draft: FILLED_DRAFT,
    createResult: "success",
  },
  {
    key: "create-error",
    label: "4 · 생성 실패",
    step: "description",
    draft: FILLED_DRAFT,
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
        isCreating={scenario.isCreating ?? false}
        initialState={{
          step: scenario.step,
          draft: scenario.draft,
          openTagSheet: scenario.openTagSheet,
        }}
        onRetryTagOptionsAction={() => toast.success("태그를 다시 불러왔어요.")}
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
