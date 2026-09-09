"use client";

import Image, { type ImageProps } from "next/image";
import type { ReactNode } from "react";
import { useState } from "react";

type FallbackImageSource = string | { src: string };

/** 렌더 박스는 CSS가 정하지만, srcset을 고르려면 next/image가 그 크기를 알아야 한다. */
type ImageWithFallbackBaseProps = Omit<ImageProps, "alt" | "src" | "width" | "height"> & {
  alt: string;
  src: string | null;
  width: number;
  height: number;
};

/** 대체 이미지와 대체 노드는 함께 쓰지 않는다. 무엇이 그려질지 호출부에서 하나로 읽혀야 한다. */
type ImageWithFallbackProps = ImageWithFallbackBaseProps &
  (
    | { fallbackSrc: FallbackImageSource; fallback?: never }
    | { fallback: ReactNode; fallbackSrc?: never }
  );

export function ImageWithFallback({
  src,
  fallbackSrc,
  fallback,
  alt,
  loading = "lazy",
  onError,
  ...props
}: ImageWithFallbackProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const isUnavailable = src === null || failedSrc === src;

  // 이미지가 아니라 노드로 대체하는 경우. 뱃지처럼 배경까지 다른 표현이 필요할 때 쓴다.
  if (fallbackSrc === undefined) {
    if (isUnavailable) {
      return fallback;
    }

    return (
      <Image
        {...props}
        alt={alt}
        loading={loading}
        src={src}
        onError={(event) => {
          setFailedSrc(src);
          onError?.(event);
        }}
      />
    );
  }

  const fallbackImageSrc = typeof fallbackSrc === "string" ? fallbackSrc : fallbackSrc.src;
  const resolvedSrc = isUnavailable ? fallbackImageSrc : src;

  return (
    <Image
      {...props}
      alt={alt}
      loading={loading}
      src={resolvedSrc}
      onError={(event) => {
        if (src !== null && resolvedSrc !== fallbackImageSrc) {
          setFailedSrc(src);
        }
        onError?.(event);
      }}
    />
  );
}
