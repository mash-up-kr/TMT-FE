import type { Metadata } from "next";
import { ContinueDraftScreen } from "../_components/ContinueDraftScreen";

export const metadata: Metadata = {
  title: "임시저장 리뷰",
};

export default function ContinueDraftPage() {
  return <ContinueDraftScreen />;
}
