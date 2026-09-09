"use client";

import { type ComponentPropsWithoutRef, type UIEvent, useState } from "react";
import { useDragScroll } from "@/shared/hooks/useDragScroll";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import { cn } from "@/shared/utils/cn";

type ImageCarouselProps = Omit<ComponentPropsWithoutRef<"div">, "children" | "width" | "height"> & {
  imageUrls: readonly string[];
  fallbackSrc: string | { src: string };
  label: string;
  /** 슬라이드 한 장이 실제로 그려지는 크기. className이 정하는 박스와 같아야 한다. */
  width: number;
  height: number;
};

export function ImageCarousel(props: ImageCarouselProps) {
  // 사진 구성이 달라지면 스크롤 위치와 번호를 함께 처음으로 되돌린다.
  return <ImageCarouselContent key={JSON.stringify(props.imageUrls)} {...props} />;
}

function ImageCarouselContent({
  imageUrls,
  fallbackSrc,
  label,
  width,
  height,
  className,
  ...props
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dragScroll = useDragScroll<HTMLElement>();

  if (imageUrls.length === 0) {
    return null;
  }

  function handleScroll(event: UIEvent<HTMLElement>) {
    const { scrollLeft, clientWidth } = event.currentTarget;

    if (clientWidth > 0) {
      setCurrentIndex(
        Math.max(0, Math.min(imageUrls.length - 1, Math.round(scrollLeft / clientWidth))),
      );
    }
  }

  return (
    <div {...props} className={cn("relative overflow-hidden", className)}>
      <section
        {...dragScroll}
        aria-label={label}
        tabIndex={imageUrls.length > 1 ? 0 : undefined}
        onScroll={handleScroll}
        className="scrollbar-hidden flex size-full snap-x snap-mandatory select-none overflow-x-auto overscroll-x-contain active:snap-none"
      >
        {imageUrls.map((url, index) => (
          <ImageWithFallback
            // biome-ignore lint/suspicious/noArrayIndexKey: 같은 URL도 별도 사진이며, 목록 변경 시 부모 key로 전체를 초기화한다.
            key={`${index}:${url}`}
            src={url}
            fallbackSrc={fallbackSrc}
            alt={`${label} ${index + 1}`}
            width={width}
            height={height}
            draggable={false}
            className="size-full shrink-0 snap-start object-cover"
          />
        ))}
      </section>
      {imageUrls.length > 1 ? (
        <span className="pointer-events-none absolute top-ds-12 right-ds-12 flex items-center gap-ds-2 rounded-ds-full bg-surface-inverse-weak px-ds-8 py-ds-2 text-body-sm-medium text-content-interactive-inverse">
          <span>{currentIndex + 1}</span>
          <span>/</span>
          <span>{imageUrls.length}</span>
        </span>
      ) : null}
    </div>
  );
}
