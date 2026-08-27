"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useState } from "react";

type FallbackImageSource = string | { src: string };

type ImageWithFallbackBaseProps = Omit<
  ComponentPropsWithoutRef<"img">,
  "alt" | "onError" | "src"
> & {
  alt: string;
  src: string | null;
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
      // biome-ignore lint/performance/noImgElement: 실제 이미지 호스트가 확정되면 next/image로 전환한다.
      <img {...props} alt={alt} loading={loading} src={src} onError={() => setFailedSrc(src)} />
    );
  }

  const fallbackImageSrc = typeof fallbackSrc === "string" ? fallbackSrc : fallbackSrc.src;
  const resolvedSrc = isUnavailable ? fallbackImageSrc : src;

  return (
    // biome-ignore lint/performance/noImgElement: 실제 이미지 호스트가 확정되면 next/image로 전환한다.
    <img
      {...props}
      alt={alt}
      loading={loading}
      src={resolvedSrc}
      onError={() => {
        if (src !== null && resolvedSrc !== fallbackImageSrc) {
          setFailedSrc(src);
        }
      }}
    />
  );
}
