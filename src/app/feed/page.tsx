import type { Metadata } from "next";
import { Suspense } from "react";
import { FeedScreen } from "./_components/FeedScreen";

export const metadata: Metadata = {
  title: "맛집 피드",
};

export default function FeedPage() {
  // 화면이 검색어를 useSearchParams로 읽어 프리렌더가 불가하다. 경계를 여기서 준다.
  return (
    <Suspense>
      <FeedScreen />
    </Suspense>
  );
}
