import Image, { type StaticImageData } from "next/image";
import { cn } from "@/shared/utils/cn";

type MascotImageProps = {
  src: StaticImageData;
  className?: string;
  unoptimized?: boolean;
};

export function MascotImage({ src, className, unoptimized }: MascotImageProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative h-[130px] w-[172px] shrink-0 overflow-hidden", className)}
    >
      <Image
        src={src}
        alt=""
        unoptimized={unoptimized}
        sizes="200px"
        className="absolute -top-ds-12 left-1/2 size-[200px] max-w-none -translate-x-1/2 object-contain"
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent from-[77.31%] to-surface-primary to-[92.81%]" />
    </div>
  );
}
