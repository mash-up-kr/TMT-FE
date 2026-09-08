import type { Metadata } from "next";
import { RecommendScreen } from "./_components/RecommendScreen";

export const metadata: Metadata = {
  title: "맛집 추천 담기",
};

export default function Page() {
  return <RecommendScreen />;
}
