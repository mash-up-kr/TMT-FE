import type { ReactNode } from "react";
import { ContinueDraftPrompt } from "../_components/ContinueDraftPrompt";

/**
 * 탭과 하위 화면을 옮겨 다녀도 유지되는 마이페이지 껍데기.
 * 진입 1회 안내를 이 자리에서 소유한다. 탭은 동적 세그먼트라 그 아래에 두면 함께 리마운트된다.
 */
export default function MyProfileLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      {children}
      <ContinueDraftPrompt />
    </>
  );
}
