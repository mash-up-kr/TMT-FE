import { redirect } from "next/navigation";
import { NEW_REVIEW_BASE_PATH, REVIEW_STEPS, reviewStepPath } from "../_constants/steps";

export default async function ReviewWriteEntryPage({
  searchParams,
}: Readonly<{ searchParams: Promise<Record<string, string | string[] | undefined>> }>) {
  // redirect()는 query를 자동으로 잇지 않는다. 진입 URL에 실린 맥락(가입하려던 그룹 등)이
  // 첫 단계까지 살아남도록 그대로 붙인다.
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    for (const item of Array.isArray(value) ? value : [value]) {
      if (item !== undefined) query.append(key, item);
    }
  }
  const search = query.toString();

  redirect(`${reviewStepPath(NEW_REVIEW_BASE_PATH, REVIEW_STEPS[0])}${search ? `?${search}` : ""}`);
}
