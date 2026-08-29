import type { Metadata, Viewport } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import "./globals.css";
import { AmplitudeAnalytics } from "@/shared/components/AmplitudeAnalytics";
import { AppToaster } from "@/shared/components/AppToaster";
import { Ut2Tracker } from "@/shared/components/Ut2Tracker";
import { QueryProvider } from "@/shared/providers/QueryProvider";
import { isAmplitudeEnabled } from "@/shared/utils/amplitude";
import { CLARITY_SNIPPET, isClarityEnabled } from "@/shared/utils/clarity";

export const metadata: Metadata = {
  title: "딸깍",
  description: "딸깍 웹 서비스",
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
          <div className="app-frame">{children}</div>
          <AppToaster />
        </QueryProvider>
        {isAmplitudeEnabled ? <AmplitudeAnalytics /> : null}
        {/* ⚠️ UT2 대비 임시 계측. shared/utils/clarity.ts 계열과 함께 지운다. */}
        {isClarityEnabled ? (
          <>
            <Script id="clarity" strategy="afterInteractive">
              {CLARITY_SNIPPET}
            </Script>
            <Ut2Tracker />
          </>
        ) : null}
      </body>
    </html>
  );
}
