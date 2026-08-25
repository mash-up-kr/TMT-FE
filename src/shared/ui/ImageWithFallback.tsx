"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useState } from "react";

type FallbackImageSource = string | { src: string };

type ImageWithFallbackProps = Omit<ComponentPropsWithoutRef<"img">, "alt" | "onError" | "src"> & {
  alt: string;
  src: string | null;
  fallbackSrc: FallbackImageSource;
};

export function ImageWithFallback({
  src,
  fallbackSrc,
  alt,
  loading = "lazy",
  ...props
}: ImageWithFallbackProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const fallbackImageSrc = typeof fallbackSrc === "string" ? fallbackSrc : fallbackSrc.src;
  const resolvedSrc = src === null || failedSrc === src ? fallbackImageSrc : src;

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
