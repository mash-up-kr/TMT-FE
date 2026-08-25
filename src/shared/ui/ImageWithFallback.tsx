"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type ImageWithFallbackProps = Omit<ImageProps, "onError" | "src"> & {
  src: ImageProps["src"];
  fallbackSrc: ImageProps["src"];
};

export function ImageWithFallback({ src, fallbackSrc, ...props }: ImageWithFallbackProps) {
  const [failedSrc, setFailedSrc] = useState<ImageProps["src"] | null>(null);
  const resolvedSrc = failedSrc === src ? fallbackSrc : src;

  return (
    <Image
      {...props}
      src={resolvedSrc}
      onError={() => {
        if (resolvedSrc !== fallbackSrc) {
          setFailedSrc(src);
        }
      }}
    />
  );
}
