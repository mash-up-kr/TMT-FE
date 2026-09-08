import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * 화면 확인용 임시 라우트 전체의 제목. 하위 프리뷰는 각자 선언하지 않고 이 값을 물려받는다.
 *
 * layout이 `title`을 문자열로 가지면 그 아래에서 root의 `%s | 또맛또` template이 끊긴다.
 * 하위가 자기 제목을 가져야 하면 layout이 아니라 각 page가 소유한다.
 */
export const metadata: Metadata = {
  title: "프리뷰",
};

export default function PreviewLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
