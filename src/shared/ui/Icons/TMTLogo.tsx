import type { SVGProps } from "react";
import { cn } from "@/shared/utils/cn";
import TMTLogoIcon from "./assets/tmt-logo.svg?react";

type TMTLogoProps = Readonly<Omit<SVGProps<SVGSVGElement>, "children" | "width" | "height">> & {
  height?: number;
};

/**
 * flex 안에서는 기본 shrink 때문에 폭이 좁아질수록 워드마크가 뭉개진다. 로고는 줄이는 대신
 * 넘치게 두는 편이 낫다고 보고 shrink-0을 기본으로 준다.
 */
export function TMTLogo({ height = 20, className, ...props }: TMTLogoProps) {
  return (
    <TMTLogoIcon
      role="img"
      aria-label="또맛또"
      height={height}
      className={cn("shrink-0", className)}
      {...props}
    />
  );
}
