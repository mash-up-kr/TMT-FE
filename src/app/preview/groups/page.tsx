"use client";

import { useState } from "react";
import { TabScreenLayout } from "@/shared/components/TabScreenLayout";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { BlankIcon, PlusIcon } from "@/shared/ui/Icons";
import { cn } from "@/shared/utils/cn";
import { type GroupsPreviewState, GroupsView } from "../../groups/_components/GroupsView";

/** 상태 확인용 임시 화면. 머지 전 검토를 위해서만 유지한다. */
type PreviewState = "default" | GroupsPreviewState;

const SCENARIOS: { key: PreviewState; label: string }[] = [
  { key: "default", label: "기본 화면" },
  { key: "empty", label: "검색 결과 없음" },
  { key: "pending", label: "로딩" },
  { key: "error", label: "불러오기 실패" },
];

const SWITCHER = [
  "fixed top-ds-12 left-ds-12 z-overlay flex w-[168px] flex-col gap-ds-4",
  "min-[431px]:left-auto min-[431px]:right-[calc(50%_+_215px_+_var(--spacing-ds-16))]",
].join(" ");

export default function GroupsPreviewPage() {
  const [state, setState] = useState<PreviewState>("default");

  return (
    <>
      <TabScreenLayout activeTab="group">
        <GNB
          align="left"
          title={null}
          left={<BlankIcon size={28} />}
          right={
            <IconButton aria-label="그룹 만들기">
              <PlusIcon />
            </IconButton>
          }
        />
        <GroupsView previewState={state === "default" ? undefined : state} />
      </TabScreenLayout>

      <nav aria-label="프리뷰 상태" className={SWITCHER}>
        {SCENARIOS.map((scenario) => (
          <button
            key={scenario.key}
            type="button"
            onClick={() => setState(scenario.key)}
            className={cn(
              "rounded-ds-xs px-ds-8 py-ds-4 text-left text-body-sm-medium",
              state === scenario.key
                ? "bg-surface-inverse text-content-interactive-inverse"
                : "bg-surface-primary text-content-secondary",
            )}
          >
            {scenario.label}
          </button>
        ))}
      </nav>
    </>
  );
}
