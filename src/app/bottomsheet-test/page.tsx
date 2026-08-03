"use client";

import { useState } from "react";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { IconButton } from "@/shared/ui/IconButton";
import { CancelIcon } from "@/shared/ui/icons";

type Case = "short" | "long" | "noFooter" | "withSlots";

const LONG_LINES = Array.from(
  { length: 30 },
  (_, index) => `${index + 1}번째 줄. 본문이 길어지면 이 영역만 스크롤되고 헤더와 푸터는 고정된다.`,
);

/**
 * BottomSheet 수동 검증 페이지.
 *
 * 실서비스 화면이 아니다. 컴포넌트 확정 후 이 커밋만 revert해 제거한다.
 */
export default function BottomSheetTestPage() {
  const [openCase, setOpenCase] = useState<Case | null>(null);
  const close = () => setOpenCase(null);

  return (
    <main className="content-container flex flex-1 flex-col gap-ds-24 py-ds-24">
      <header className="flex flex-col gap-ds-4">
        <h1 className="text-heading-sm text-content-primary">BottomSheet 검증</h1>
        <p className="text-body-sm-regular text-content-tertiary">
          본문 길이 · 푸터 유무 · 헤더 슬롯 · 스와이프로 닫기를 확인한다.
        </p>
      </header>

      <section className="flex flex-col gap-ds-8">
        <Trigger
          label="짧은 본문"
          hint="시트가 콘텐츠만큼만 올라온다"
          onRun={() => setOpenCase("short")}
        />
        <Trigger
          label="긴 본문"
          hint="max-h에서 멈추고 본문만 스크롤된다"
          onRun={() => setOpenCase("long")}
        />
        <Trigger
          label="푸터 없음"
          hint="하단 여백이 본문에 붙는다"
          onRun={() => setOpenCase("noFooter")}
        />
        <Trigger
          label="헤더 좌·우 슬롯"
          hint="제목이 가운데 유지되는지 본다"
          onRun={() => setOpenCase("withSlots")}
        />
      </section>

      <BottomSheet
        open={openCase === "short"}
        onOpenChange={close}
        title="짧은 본문"
        footer={<Buttons onCancel={close} />}
      >
        <p className="text-body-md-regular text-content-secondary">
          내용이 적으면 시트는 이 높이에서 멈춘다.
        </p>
      </BottomSheet>

      <BottomSheet
        open={openCase === "long"}
        onOpenChange={close}
        title="긴 본문"
        footer={<Buttons onCancel={close} />}
      >
        <div className="flex flex-col gap-ds-12">
          {LONG_LINES.map((line) => (
            <p key={line} className="text-body-md-regular text-content-secondary">
              {line}
            </p>
          ))}
        </div>
      </BottomSheet>

      <BottomSheet open={openCase === "noFooter"} onOpenChange={close} title="푸터 없음">
        <p className="text-body-md-regular text-content-secondary">
          푸터가 없으면 본문 아래에 여백이 붙는다.
        </p>
      </BottomSheet>

      <BottomSheet
        open={openCase === "withSlots"}
        onOpenChange={close}
        title="아주 긴 제목이 들어가면 어떻게 되는지 확인한다"
        left={
          <IconButton aria-label="닫기" onClick={close}>
            <CancelIcon thick />
          </IconButton>
        }
        right={
          <IconButton aria-label="닫기" onClick={close}>
            <CancelIcon thick />
          </IconButton>
        }
        footer={<Buttons onCancel={close} />}
      >
        <p className="text-body-md-regular text-content-secondary">
          제목이 길면 좌우 슬롯을 덮지 않고 잘린다.
        </p>
      </BottomSheet>
    </main>
  );
}

/** Button·ButtonStack(TMT-73)이 머지되면 이 임시 버튼을 교체한다. */
function Buttons({ onCancel }: Readonly<{ onCancel: () => void }>) {
  return (
    <div className="flex w-full items-center gap-ds-8 [&>*]:min-w-0 [&>*]:flex-1">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-ds-sm bg-surface-interactive-tertiary px-ds-16 py-ds-12 text-body-md-bold text-content-primary"
      >
        취소
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-ds-sm bg-surface-interactive-primary px-ds-16 py-ds-12 text-body-md-bold text-content-interactive-inverse"
      >
        확인
      </button>
    </div>
  );
}

function Trigger({
  label,
  hint,
  onRun,
}: Readonly<{ label: string; hint?: string; onRun: () => void }>) {
  return (
    <button
      type="button"
      onClick={onRun}
      className="flex flex-col items-start rounded-ds-sm border-sm border-stroke-secondary px-ds-16 py-ds-12 text-left"
    >
      <span className="text-body-md-bold text-content-primary">{label}</span>
      {hint ? <span className="text-body-sm-regular text-content-tertiary">{hint}</span> : null}
    </button>
  );
}
