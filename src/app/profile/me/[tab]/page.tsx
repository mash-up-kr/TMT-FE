import { notFound } from "next/navigation";
import { MeProfileScreen } from "../../_components/MeProfileScreen";
import { parseProfileTab } from "../../_utils/profileTab";

export default async function Page({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = await params;
  const activeTab = parseProfileTab(tab);

  if (!activeTab) {
    notFound();
  }

  return <MeProfileScreen activeTab={activeTab} />;
}
