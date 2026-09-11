import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MeProfileScreen } from "../../_components/MeProfileScreen";
import { PROFILE_TABS } from "../../_model/profile";
import { parseProfileTab } from "../../_utils/profileTab";

export const metadata: Metadata = {
  title: "내 정보",
};

export function generateStaticParams() {
  return PROFILE_TABS.map((tab) => ({ tab }));
}

export default async function Page({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = await params;
  const activeTab = parseProfileTab(tab);

  if (!activeTab) {
    notFound();
  }

  return <MeProfileScreen activeTab={activeTab} />;
}
