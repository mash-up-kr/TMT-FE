"use client";

import "./globals.css";
import { ErrorFallback } from "@/shared/components/ErrorFallback";

export default function GlobalError() {
  return (
    <html lang="ko">
      <body className="flex min-h-dvh">
        <ErrorFallback onRetry={() => window.location.reload()} />
      </body>
    </html>
  );
}
