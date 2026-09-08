import type { Metadata } from "next";
import type { ReactNode } from "react";

/** page가 client component라 제목만 이 layout이 소유한다. */
export const metadata: Metadata = {
  title: "로그인",
};

export default function LoginLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
