import type { Metadata } from "next";
import { FeedSearchScreen } from "../_components/FeedSearchScreen";

export const metadata: Metadata = {
  title: "맛집 검색",
};

export default function FeedSearchPage() {
  return <FeedSearchScreen />;
}
