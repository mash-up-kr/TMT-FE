import type { ComponentType, SVGProps } from "react";
import type { ColorIconProps } from "./types";

type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * 색이 고정된 아이콘을 감싼다.
 * currentColor를 쓰지 않으므로 색 관련 prop이 없고 size만 받는다.
 */
export function createColorIcon(Svg: SvgComponent) {
  return function Icon({ size = 24, ...props }: ColorIconProps) {
    return <Svg aria-hidden="true" width={size} height={size} {...props} />;
  };
}
