import type { Metadata } from "next";
import { ROUTES } from "@/shared/constants/routes";
import { HomeScreen } from "./_components/HomeScreen";

/** 색인을 허용하는 유일한 화면이라, root layout의 `noindex` 기본값을 여기서만 뒤집는다. */
export const metadata: Metadata = {
  alternates: { canonical: ROUTES.ROOT },
  robots: { index: true, follow: true },
};

/** Access token은 브라우저 메모리에 있으므로 인증 복원 후 화면에서 조회한다. */
export default function Home() {
  return <HomeScreen />;
}
