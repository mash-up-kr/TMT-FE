import Link from "next/link";
import type { ReactNode } from "react";
import { EmptyNotice } from "@/shared/components/EmptyNotice/EmptyNotice";
import { buttonStyles } from "@/shared/ui/Button";

const PREVIEW_HREF = "/preview/empty-notice";

export default function EmptyNoticePreviewPage() {
  return (
    <main className="min-h-full overflow-y-auto bg-surface-secondary px-ds-20 py-ds-24">
      <div className="mx-auto flex w-full max-w-(--layout-frame-max) flex-col gap-ds-20">
        <header className="flex flex-col gap-ds-4">
          <h1 className="text-heading-lg text-content-primary">EmptyNotice</h1>
          <p className="text-body-md-regular text-content-secondary">
            내용과 배치 영역의 책임을 분리한 상태를 확인합니다.
          </p>
        </header>

        <PreviewSection title="기본형 · 설명 없음">
          <NoticeFrame previewCase="default">
            <EmptyNotice title="게시물을 불러오는 중이에요." />
          </NoticeFrame>
        </PreviewSection>

        <PreviewSection title="기본형 · 설명 있음">
          <NoticeFrame previewCase="description">
            <EmptyNotice title="검색 결과가 없어요.">다른 이름이나 태그로 찾아보세요!</EmptyNotice>
          </NoticeFrame>
        </PreviewSection>

        <PreviewSection title="액션 포함형">
          <NoticeFrame previewCase="action">
            <EmptyNotice
              title="아직 작성한 리뷰가 없어요"
              action={
                <Link
                  href={PREVIEW_HREF}
                  className={buttonStyles({ variant: "tertiary", size: "md" })}
                >
                  리뷰 작성하기
                </Link>
              }
            >
              리뷰를 작성하면 티켓을 받을 수 있어요.
            </EmptyNotice>
          </NoticeFrame>
        </PreviewSection>

        <PreviewSection title="강조형 · 시트 본문">
          <NoticeFrame previewCase="prominent">
            <EmptyNotice
              variant="prominent"
              eyebrow="아직 게시된 리뷰가 없어요."
              title={"그룹 첫 리뷰를\n등록해보세요!"}
            />
          </NoticeFrame>
        </PreviewSection>

        <PreviewSection title="강조형 · 이어쓰기 마스코트">
          <NoticeFrame previewCase="prominent-writing">
            <EmptyNotice
              variant="prominent"
              illustration="writing"
              eyebrow="작성 중인 리뷰가 있어요"
              title={"리뷰를 이어서\n작성하시겠어요?"}
            />
          </NoticeFrame>
        </PreviewSection>
      </div>
    </main>
  );
}

function PreviewSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-ds-8">
      <h2 className="text-body-md-bold text-content-primary">{title}</h2>
      {children}
    </section>
  );
}

function NoticeFrame({ previewCase, children }: { previewCase: string; children: ReactNode }) {
  return (
    <div
      data-preview-case={previewCase}
      className="flex min-h-[320px] items-center justify-center rounded-ds-md bg-surface-primary px-ds-20 py-ds-32"
    >
      {children}
    </div>
  );
}
