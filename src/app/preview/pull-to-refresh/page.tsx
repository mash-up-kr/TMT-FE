"use client";

/**
 * 당겨서 새로고침 확인용 프리뷰. 실제 홈·피드는 인증이 필요해 제스처만 따로 확인한다.
 * 새로고침은 1.2초 기다렸다 횟수를 올린다 — 인디케이터가 응답을 기다리는 동안 유지되는지 본다.
 */

import { useState } from "react";
import { TMTLogoHomeLink } from "@/shared/components/TMTLogoHomeLink";
import { GNB } from "@/shared/ui/GNB";
import { PreviewBottomNavScreenLayout } from "../_components/PreviewBottomNavScreenLayout";

const FAKE_REFRESH_MS = 1200;
const ROWS = Array.from({ length: 24 }, (_, index) => index + 1);

export default function PullToRefreshPreview() {
  const [refreshCount, setRefreshCount] = useState(0);

  const refresh = () =>
    new Promise<void>((resolve) => {
      setTimeout(() => {
        setRefreshCount((count) => count + 1);
        resolve();
      }, FAKE_REFRESH_MS);
    });

  return (
    <PreviewBottomNavScreenLayout
      activeTab="home"
      header={<GNB align="left" className="shrink-0" title={null} left={<TMTLogoHomeLink />} />}
      onRefresh={refresh}
    >
      <main className="flex flex-1 flex-col bg-surface-secondary">
        <p
          data-testid="refresh-count"
          className="bg-surface-primary px-ds-20 py-ds-12 text-heading-md text-content-primary"
        >
          새로고침 {refreshCount}회
        </p>
        <ul className="flex flex-col gap-ds-4">
          {ROWS.map((row) => (
            <li key={row} className="bg-surface-primary px-ds-20 py-ds-16 text-body-md-regular">
              항목 {row}
            </li>
          ))}
        </ul>
      </main>
    </PreviewBottomNavScreenLayout>
  );
}
