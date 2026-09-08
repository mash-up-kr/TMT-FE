import type { SVGProps } from "react";
import { cn } from "@/shared/utils/cn";
import TMTLogoIcon from "./assets/tmt-logo.svg?react";
import TMTLogoSimpleIcon from "./assets/tmt-logo-simple.svg?react";

type TMTLogoProps = Readonly<Omit<SVGProps<SVGSVGElement>, "children" | "width" | "height">> & {
  height?: number;
  variant?: "color" | "simple";
};

/**
 * flex 안에서는 기본 shrink 때문에 폭이 좁아질수록 워드마크가 뭉개진다. 로고는 줄이는 대신
 * 넘치게 두는 편이 낫다고 보고 shrink-0을 기본으로 준다.
 */
export function TMTLogo({ height = 18, variant = "color", className, ...props }: TMTLogoProps) {
  const LogoIcon = variant === "simple" ? TMTLogoSimpleIcon : TMTLogoIcon;

  return (
    <LogoIcon
      role="img"
      aria-label="또맛또"
      height={height}
      width={(height * 128) / 28}
      className={cn("shrink-0", variant === "simple" && "text-content-primary", className)}
      {...props}
    />
  );
}
