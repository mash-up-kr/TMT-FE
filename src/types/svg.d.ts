// `?react` 쿼리로 import한 SVG는 SVGR가 React 컴포넌트로 변환한다.
// Next는 `*.svg`를 `any`로 선언해두므로, 쿼리를 분리해 타입을 명확히 잡는다.
declare module "*.svg?react" {
  import type { FunctionComponent, SVGProps } from "react";

  const ReactComponent: FunctionComponent<SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
