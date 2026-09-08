import type { Metadata, Viewport } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import "./globals.css";
import { AmplitudeAnalytics } from "@/shared/components/AmplitudeAnalytics";
import { AppChrome } from "@/shared/components/AppChrome";
import { AppToaster } from "@/shared/components/AppToaster";
import { Ut2Tracker } from "@/shared/components/Ut2Tracker";
import { SITE, SITE_ORIGIN } from "@/shared/constants/site";
import { AuthProvider } from "@/shared/providers/AuthProvider";
import { QueryProvider } from "@/shared/providers/QueryProvider";
import { isAmplitudeEnabled } from "@/shared/utils/amplitude";
import { CLARITY_SNIPPET, isClarityEnabled } from "@/shared/utils/clarity";

/**
 * 검색 색인은 홈만 허용한다. 여기서 `noindex`를 기본값으로 두고 홈만 뒤집으므로,
 * 앞으로 추가되는 화면도 명시적으로 열지 않는 한 색인되지 않는다.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  applicationName: SITE.name,
  title: { default: SITE.title, template: `%s | ${SITE.name}` },
  description: SITE.description,
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <div className="app-frame">
            <AuthProvider>
              <AppChrome>{children}</AppChrome>
            </AuthProvider>
          </div>
          <AppToaster />
        </QueryProvider>
        {isAmplitudeEnabled ? <AmplitudeAnalytics /> : null}
        {/* ⚠️ UT2 대비 임시 계측. shared/utils/clarity.ts 계열과 함께 지운다. */}
        {isClarityEnabled ? (
          <>
            <Script id="microsoft-clarity" strategy="afterInteractive">
              {CLARITY_SNIPPET}
            </Script>
            <Ut2Tracker />
          </>
        ) : null}
      </body>
    </html>
  );
}
