import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { QueryProvider } from "@/shared/providers/QueryProvider";
import { AppFrame } from "@/shared/ui/AppFrame";
import { Toaster } from "@/shared/ui/Toast";

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
          <AppFrame>{children}</AppFrame>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
