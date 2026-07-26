"use client";

import { useState } from "react";
import { Modal } from "@/shared/ui/Modal";

const LONG_BODY_LINES = Array.from({ length: 60 }, (_, index) => index + 1);

/**
 * Modal 수동 검증 페이지.
 *
 * 자동 테스트 러너가 없어 시안 대조·접근성 확인을 눈으로 한다.
 * Modal 외 컴포넌트가 붙으면 각자 라우트를 만든다.
 */
export default function ModalTestPage() {
  const [basic, setBasic] = useState(false);
  const [noClose, setNoClose] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [longBody, setLongBody] = useState(false);
  const [withInput, setWithInput] = useState(false);
  const [styled, setStyled] = useState(false);

  return (
    <main className="content-container flex flex-1 flex-col gap-ds-24 py-ds-24">
      <header className="flex flex-col gap-ds-4">
        <h1 className="text-heading-sm text-content-primary">Modal 검증</h1>
        <p className="text-body-sm-regular text-content-tertiary">
          각 케이스를 열고 ESC · 딤드 클릭 · 닫기 버튼 · Tab 순서를 확인한다.
        </p>
      </header>

      <section className="flex flex-col gap-ds-8">
        <Case label="기본" hint="제목 + 설명 + CTA 2개" onOpen={() => setBasic(true)} />
        <Case
          label="showClose=false"
          hint="X 숨김. Tab 한 번으로 sr-only 닫기에 도달해야 한다"
          onOpen={() => setNoClose(true)}
        />
        <Case
          label="titleVisible"
          hint="시안에 제목 영역이 없어 기본은 숨김. title은 스크린리더 이름 전용이라 값은 필수다"
          onOpen={() => setTitleVisible(true)}
        />
        <Case
          label="긴 본문"
          hint="카드가 화면을 넘지 않고 내부에서만 스크롤되어야 한다"
          onOpen={() => setLongBody(true)}
        />
        <Case
          label="입력 필드"
          hint="한글 조합 중 ESC → 조합만 취소, 모달은 유지"
          onOpen={() => setWithInput(true)}
        />
        <Case
          label="className override"
          hint="rounded는 덮이지만 pb는 Popup에 걸려 내부 패딩에 더해진다"
          onOpen={() => setStyled(true)}
        />
      </section>

      <Modal
        open={basic}
        onOpenChange={setBasic}
        title="성수 커피 탐험대"
        description="티켓을 사용해 그룹에 가입하시겠어요?"
        showClose={false}
        footer={
          <div className="mt-ds-24 flex flex-col gap-ds-8">
            <TestButton variant="primary" onClick={() => setBasic(false)}>
              가입하기
            </TestButton>
            <TestButton variant="tertiary" onClick={() => setBasic(false)}>
              취소
            </TestButton>
          </div>
        }
      >
        <div className="flex items-center justify-between rounded-ds-sm bg-surface-secondary p-ds-16">
          <span className="text-body-lg-regular text-content-secondary">보유 티켓</span>
          <span className="text-body-lg-bold text-content-primary">4</span>
        </div>
      </Modal>

      <Modal open={noClose} onOpenChange={setNoClose} title="닫기 버튼 숨김" showClose={false}>
        <p className="text-body-lg-regular text-content-secondary">
          X가 보이지 않지만 DOM에는 sr-only로 남아 있다. Tab을 누르면 &quot;닫기&quot;에 포커스가
          가고, Enter로 닫힌 뒤 트리거 버튼으로 포커스가 돌아와야 한다.
        </p>
      </Modal>

      <Modal
        open={titleVisible}
        onOpenChange={setTitleVisible}
        title="화면에 보이는 제목"
        titleVisible
      >
        <p className="text-body-lg-regular text-content-secondary">
          디자인 시스템 시안의 모달에는 제목 영역이 없다(Content Area + CTA + X). 그래서
          titleVisible의 기본값은 false다.
          <br />
          <br />
          그럼에도 title을 필수 prop으로 남긴 이유는 스크린리더 때문이다. Base UI는 Dialog.Title이
          있을 때만 aria-labelledby를 걸어서, 없으면 스크린리더가 &quot;대화상자&quot;라고만 읽고
          무슨 모달인지 알 수 없다. 헤더를 그리지 않는 경우에도 sr-only로 남겨둔다.
        </p>
      </Modal>

      <Modal open={longBody} onOpenChange={setLongBody} title="긴 본문 스크롤">
        <div className="flex flex-col gap-ds-8">
          {LONG_BODY_LINES.map((line) => (
            <p key={line} className="text-body-md-regular text-content-secondary">
              {line}번째 줄 — 카드 높이가 화면을 넘지 않아야 한다.
            </p>
          ))}
        </div>
      </Modal>

      <Modal
        open={withInput}
        onOpenChange={setWithInput}
        title="한글 입력"
        description="입력창에 한글을 치다가 조합 중인 상태에서 ESC를 눌러본다."
        footer={
          <TestButton variant="primary" className="mt-ds-24" onClick={() => setWithInput(false)}>
            확인
          </TestButton>
        }
      >
        <label className="flex flex-col gap-ds-8">
          <span className="text-body-md-medium text-content-secondary">동네</span>
          <input
            placeholder="예: 성수동"
            className="w-full rounded-ds-sm border-sm border-stroke-primary px-ds-12 py-ds-8 text-body-lg-regular"
          />
        </label>
      </Modal>

      <Modal
        open={styled}
        onOpenChange={setStyled}
        title="스타일 override"
        titleVisible
        className="rounded-ds-sm pb-ds-4"
      >
        <p className="text-body-lg-regular text-content-secondary">
          rounded-ds-sm은 기본 rounded-ds-xl(20)을 덮는다. 반면 패딩은 내부가 소유하므로 pb-ds-4가
          본문의 pb-ds-20 바깥에 더해져 하단이 24가 된다.
        </p>
      </Modal>
    </main>
  );
}

function Case({
  label,
  hint,
  onOpen,
}: Readonly<{ label: string; hint: string; onOpen: () => void }>) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex flex-col gap-ds-2 rounded-ds-md border-sm border-stroke-secondary p-ds-16 text-left"
    >
      <span className="text-body-lg-bold text-content-primary">{label}</span>
      <span className="text-body-sm-regular text-content-tertiary">{hint}</span>
    </button>
  );
}

function TestButton({
  variant,
  onClick,
  className,
  children,
}: Readonly<{
  variant: "primary" | "tertiary";
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-ds-md py-ds-12 text-body-lg-bold",
        variant === "primary"
          ? "bg-surface-interactive-primary text-content-interactive-inverse"
          : "bg-surface-interactive-tertiary text-content-primary",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
