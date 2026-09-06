import { ReviewShareScreen } from "./_components/ReviewShareScreen";

export default async function GroupJoinPage({
  params,
}: Readonly<{
  params: Promise<{ groupId: string }>;
}>) {
  const { groupId } = await params;

  return <ReviewShareScreen groupId={groupId} />;
}
