import Link from "next/link";
import { ROUTES } from "@/shared/constants/routes";
import { TMTLogo } from "@/shared/ui/Icons";

export function TMTLogoHomeLink() {
  return (
    <Link href={ROUTES.ROOT} aria-label="홈으로 이동" className="flex shrink-0 items-center">
      <TMTLogo aria-hidden="true" />
    </Link>
  );
}
