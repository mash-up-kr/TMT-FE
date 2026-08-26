import { notFound, redirect } from "next/navigation";
import { toUserProfileHref } from "../_utils/profileHrefs";

export default async function Page({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  // `me`는 내 프로필 예약 경로다. 타인 식별자로 해석하지 않는다.
  if (userId === "me") {
    notFound();
  }

  redirect(`${toUserProfileHref(userId)}/reviews`);
}
