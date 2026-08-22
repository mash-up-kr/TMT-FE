import type { SVGProps } from "react";

export interface ColorIconProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  size?: number | string;
}
