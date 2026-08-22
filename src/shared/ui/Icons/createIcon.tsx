import type { ComponentType, SVGProps } from "react";
import type { ColorIconProps, FilledIconProps, IconProps } from "./types";

type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * thin/thick 두 벌의 SVGR 컴포넌트를 받아 아이콘 컴포넌트를 만든다.
 * thick/size/currentColor/aria-hidden 같은 아이콘 공통 계약을 여기서 흡수한다.
 */
export function createIcon(Thin: SvgComponent, Thick: SvgComponent) {
  return function Icon({ thick = false, size = 24, ...props }: IconProps) {
    const Svg = thick ? Thick : Thin;
    return <Svg aria-hidden="true" width={size} height={size} {...props} />;
  };
}

/**
 * outline/fill 두 벌의 SVGR 컴포넌트를 받아 아이콘 컴포넌트를 만든다.
 * 굵기가 아니라 채움 여부가 갈리는 아이콘은 thick 대신 이 축을 쓴다.
 */
export function createFilledIcon(Outline: SvgComponent, Fill: SvgComponent) {
  return function Icon({ filled = false, size = 24, ...props }: FilledIconProps) {
    const Svg = filled ? Fill : Outline;
    return <Svg aria-hidden="true" width={size} height={size} {...props} />;
  };
}

/**
 * 색이 고정된 다색 아이콘을 감싼다.
 * currentColor를 쓰지 않으므로 thick/filled 축이 없고 size만 받는다.
 */
export function createColorIcon(Svg: SvgComponent) {
  return function Icon({ size = 24, ...props }: ColorIconProps) {
    return <Svg aria-hidden="true" width={size} height={size} {...props} />;
  };
}
