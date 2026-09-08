import type { MetadataRoute } from "next";
import { ROUTES } from "@/shared/constants/routes";
import { SITE_ORIGIN } from "@/shared/constants/site";

/** 색인을 허용하는 화면은 홈뿐이라 sitemap도 홈만 담는다. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: new URL(ROUTES.ROOT, SITE_ORIGIN).toString() }];
}
