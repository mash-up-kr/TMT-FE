"use client";

import { Dialog } from "@base-ui/react/dialog";
import { createContext, type ReactNode, useContext, useMemo, useState } from "react";
import { useCloseOnBack } from "@/shared/hooks/useCloseOnBack";
import { useDragScroll } from "@/shared/hooks/useDragScroll";
import { useSnapScrollIndex } from "@/shared/hooks/useSnapScrollIndex";
import { IconButton } from "@/shared/ui/IconButton";
import { CancelIcon } from "@/shared/ui/Icons";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import { cn } from "@/shared/utils/cn";

/** 뷰어 사진은 프레임(--layout-frame-max) 너비를 채운다. srcset은 너비로만 고른다. */
const VIEWER_IMAGE_WIDTH = 430;
const VIEWER_IMAGE_HEIGHT = 932;

const FADE_CLASS =
  "transition-opacity duration-200 ease-out data-starting-style:opacity-0 data-ending-style:opacity-0";

type FallbackImageSource = string | { src: string };

type ImageViewerContextValue = Readonly<{
  handle: Dialog.Handle<number>;
  label: string;
}>;

const ImageViewerContext = createContext<ImageViewerContextValue | null>(null);

type ImageViewerProps = Readonly<{
  imageUrls: readonly string[];
  /** 사진 묶음의 이름. 뷰어 제목과 트리거·사진의 접근 가능한 이름이 된다. */
  label: string;
  fallbackSrc: FallbackImageSource;
  /** 사진 묶음 UI. 그 안의 `ImageViewerTrigger`가 자기 번호로 뷰어를 연다. */
  children: ReactNode;
}>;

/**
 * 사진 묶음을 전체화면으로 넘겨 보는 뷰어.
 *
 * 여는 단위는 사진 한 장이 아니라 묶음이다. 뷰어는 목록 전체와 시작 번호가 필요하므로
 * 묶음을 그리는 쪽이 감싸고, 각 사진을 `ImageViewerTrigger`로 만든다. 트리거가 번호를
 * payload로 넘기므로 호출부에 열림·번호 상태가 없고, 닫으면 포커스가 누른 사진으로 돌아간다.
 *
 * @example
 * <ImageViewer imageUrls={urls} label="가게 사진" fallbackSrc={fallbackImage}>
 *   {urls.map((url, index) => (
 *     <ImageViewerTrigger key={url} index={index}>…</ImageViewerTrigger>
 *   ))}
 * </ImageViewer>
 */
export function ImageViewer({ imageUrls, label, fallbackSrc, children }: ImageViewerProps) {
  // 피드처럼 묶음이 여럿 떠 있어도 트리거가 섞이지 않게 인스턴스마다 handle을 둔다.
  const [handle] = useState(() => Dialog.createHandle<number>());
  const [open, setOpen] = useState(false);
  const context = useMemo(() => ({ handle, label }), [handle, label]);

  // 화면을 가득 채워 사용자는 새 화면으로 여기고 뒤로가기를 누른다. 페이지 대신 뷰어를 닫는다.
  useCloseOnBack(open, () => handle.close());

  return (
    <ImageViewerContext value={context}>
      {children}
      <Dialog.Root handle={handle} onOpenChange={setOpen}>
        {({ payload }) => (
          <Dialog.Portal>
            <Dialog.Backdrop
              className={cn("fixed inset-0 z-overlay bg-surface-backdrop", FADE_CLASS)}
            />
            <Dialog.Viewport className="viewer-viewport">
              <ImageViewerPopup
                imageUrls={imageUrls}
                label={label}
                fallbackSrc={fallbackSrc}
                initialIndex={payload ?? 0}
              />
            </Dialog.Viewport>
          </Dialog.Portal>
        )}
      </Dialog.Root>
    </ImageViewerContext>
  );
}

type ImageViewerTriggerProps = Readonly<{
  /** 뷰어를 열 때 먼저 보여줄 사진의 번호. */
  index: number;
  className?: string;
  children: ReactNode;
}>;

export function ImageViewerTrigger({ index, className, children }: ImageViewerTriggerProps) {
  const context = useContext(ImageViewerContext);

  if (!context) {
    throw new Error("ImageViewerTrigger는 ImageViewer 안에서 사용해야 합니다.");
  }

  return (
    <Dialog.Trigger
      handle={context.handle}
      payload={index}
      aria-label={`${context.label} ${index + 1} 크게 보기`}
      className={cn("block", className)}
    >
      {children}
    </Dialog.Trigger>
  );
}

type ImageViewerPopupProps = Readonly<{
  imageUrls: readonly string[];
  label: string;
  fallbackSrc: FallbackImageSource;
  initialIndex: number;
}>;

function ImageViewerPopup({ imageUrls, label, fallbackSrc, initialIndex }: ImageViewerPopupProps) {
  const snap = useSnapScrollIndex<HTMLElement>(imageUrls.length, initialIndex);
  const dragScroll = useDragScroll<HTMLElement>();

  return (
    <Dialog.Popup
      // 넘길 사진이 있으면 트랙이 포커스를 가져야 키보드 ←/→로 바로 넘긴다.
      initialFocus={imageUrls.length > 1 ? snap.ref : true}
      className={cn(
        "flex size-full flex-col bg-surface-viewer",
        "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
        FADE_CLASS,
      )}
    >
      <Dialog.Title className="sr-only">{label}</Dialog.Title>
      <div className="flex shrink-0 items-center px-ds-16 py-ds-12">
        {imageUrls.length > 1 ? (
          <span className="flex items-center gap-ds-2 rounded-ds-full bg-surface-inverse-weak px-ds-8 py-ds-2 text-body-sm-medium text-content-interactive-inverse">
            <span>{snap.index + 1}</span>
            <span>/</span>
            <span>{imageUrls.length}</span>
          </span>
        ) : null}
        <Dialog.Close
          render={
            <IconButton aria-label="닫기" className="ml-auto text-icon-interactive-inverse">
              <CancelIcon thick />
            </IconButton>
          }
        />
      </div>
      <section
        {...dragScroll}
        ref={snap.ref}
        aria-label={label}
        tabIndex={imageUrls.length > 1 ? 0 : undefined}
        onScroll={snap.onScroll}
        className="scrollbar-hidden flex min-h-0 flex-1 snap-x snap-mandatory select-none overflow-x-auto overscroll-x-contain"
      >
        {imageUrls.map((url, index) => (
          <ImageWithFallback
            // biome-ignore lint/suspicious/noArrayIndexKey: 같은 URL도 별도 사진이며, 뷰어는 열 때마다 새로 그린다.
            key={`${index}:${url}`}
            src={url}
            fallbackSrc={fallbackSrc}
            alt={`${label} ${index + 1}`}
            width={VIEWER_IMAGE_WIDTH}
            height={VIEWER_IMAGE_HEIGHT}
            // 연 뒤 넘길 때 빈 화면이 보이지 않도록 묶음 전체를 미리 받는다.
            loading="eager"
            draggable={false}
            className="size-full shrink-0 snap-start object-contain"
          />
        ))}
      </section>
    </Dialog.Popup>
  );
}
