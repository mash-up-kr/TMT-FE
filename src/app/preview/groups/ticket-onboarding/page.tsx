"use client";

/**
 * 그룹 탭 티켓 안내 시트 확인용 프리뷰. 실제 화면은 기기당 한 번만 뜨므로 저장소와 관계없이
 * 반복해서 열어 본다.
 */

import { useState } from "react";
import { Button } from "@/shared/ui/Button";
import { TicketOnboardingSheet } from "../../../groups/_components/TicketOnboardingSheet";

export default function TicketOnboardingPreviewPage() {
  const [open, setOpen] = useState(true);

  return (
    <main className="flex min-h-full flex-col justify-center bg-surface-secondary px-ds-20 py-ds-24">
      <Button onClick={() => setOpen(true)}>티켓 안내 열기</Button>
      <TicketOnboardingSheet open={open} onOpenChangeAction={setOpen} />
    </main>
  );
}
