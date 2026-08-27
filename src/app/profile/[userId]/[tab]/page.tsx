import { notFound } from "next/navigation";
import { UserProfileScreen } from "../../_components/UserProfileScreen";
import { parseProfileTab } from "../../_utils/profileTab";

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string; tab: string }>;
}) {
  const { userId, tab } = await params;
  const activeTab = parseProfileTab(tab);

  if (userId === "me" || !activeTab) {
    notFound();
  }

  return <UserProfileScreen userId={userId} activeTab={activeTab} />;
}
