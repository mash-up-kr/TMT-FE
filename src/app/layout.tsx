import type { Metadata } from "next";
import "@/shared/styles/globals.css";
import { QueryProvider } from "@/shared/providers/QueryProvider";

export const metadata: Metadata = {
  title: "딸깍",
  description: "딸깍 웹 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
