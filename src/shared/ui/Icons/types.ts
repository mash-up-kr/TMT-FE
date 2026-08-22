import type { SVGProps } from "react";

interface IconBaseProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  size?: number | string;
}

export interface IconProps extends IconBaseProps {
  thick?: boolean;
}

export interface FilledIconProps extends IconBaseProps {
  filled?: boolean;
}
