"use client";

import { ROUTES } from "@/shared/constants/routes";

export default function GlobalError() {
  return (
    <html lang="ko">
      <body>
        <main>
          <h1>화면을 표시할 수 없어요.</h1>
          <p>잠시 후 다시 시도해 주세요.</p>
          <button type="button" onClick={() => window.location.reload()}>
            새로고침
          </button>
          <a href={ROUTES.ROOT}>홈으로</a>
        </main>
      </body>
    </html>
  );
}
