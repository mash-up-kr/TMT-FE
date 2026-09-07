import { redirect } from "next/navigation";
import { ROUTES } from "@/shared/constants/routes";

/** X-User-Id 기반 UT2 사용자 전환은 Bearer 인증 도입으로 종료했다. */
export default function Ut2PreviewPage() {
  redirect(ROUTES.LOGIN);
}
