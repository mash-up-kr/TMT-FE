"use client";

import { useEffect, useEffectEvent } from "react";

/** 이 훅이 넣은 기록 칸의 표식. 닫을 때 지금 칸이 우리 것인지 확인하는 데 쓴다. */
const HISTORY_MARKER = "__closeOnBack";

/**
 * 열려 있는 동안 방문 기록에 한 칸을 넣어, 뒤로가기(버튼·제스처)가 페이지를 떠나는 대신 이 층을 닫게 한다.
 * X·ESC처럼 다른 방법으로 닫히면 넣어둔 칸을 되돌려 기록에 흔적을 남기지 않는다.
 *
 * 닫힌 채 마운트돼 나중에 열리는 컴포넌트에서 쓴다. 열린 채 마운트되면 개발 모드 StrictMode가
 * effect를 두 번 돌리면서 부른 back이 늦게 도착해 곧바로 닫힌다.
 */
export function useCloseOnBack(open: boolean, onClose: () => void) {
  const close = useEffectEvent(onClose);

  useEffect(() => {
    if (!open) {
      return;
    }

    let closedByBack = false;
    // Next App Router가 자기 내부 상태를 이 칸에 복사해 두므로, 뒤로 가도 같은 화면으로 복원된다.
    window.history.pushState({ [HISTORY_MARKER]: true }, "");

    function handlePopState() {
      closedByBack = true;
      close();
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);

      // 그 사이 다른 이동으로 칸이 바뀌었다면 되돌리지 않는다. 남의 기록을 지우게 된다.
      if (!closedByBack && window.history.state?.[HISTORY_MARKER]) {
        window.history.back();
      }
    };
  }, [open]);
}
