import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/shared/constants/site";

/**
 * 그룹·장소는 여기서 막지 않는다. 크롤러가 페이지의 `noindex`를 읽어야 색인을 확실히
 * 제거할 수 있고, 링크 공유는 계속 허용해야 하기 때문이다.
 * 공유할 이유가 없는 경로만 명시적으로 차단한다.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/login",
        "/onboarding",
        "/auth/",
        "/api/",
        "/profile/",
        "/reviews/",
        "/groups/new",
        "/preview/",
      ],
    },
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  };
}
