"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";
import type { CSSProperties } from "react";
import { ToastItem } from "./ToastItem";
import { hasToastData, type ToastData, toastManager } from "./toast";

/**
 * TIMEOUT_MS: 토스트가 보이는 시간.
 * 시안에 값이 없어 조직 관례를 따른다.
 */
const TIMEOUT_MS = 3000;

/**
 * LIMIT: 토스트가 동시에 보이는 최대 개수.
 * 넘겨진 토스트는 지워지는 대신 `inert` 되어 스크린리더가 읽지 않는다.
 */
const LIMIT = 3;

function ToastList() {
  const { toasts } = BaseToast.useToastManager<ToastData>();

  return toasts.filter(hasToastData).map((toast) => <ToastItem key={toast.id} toast={toast} />);
}

type ToasterProps = Readonly<{
  /** 화면 아래에서 띄울 거리(px). BottomNav 대응 */
  bottomInset?: number;
}>;

/**
 * 토스트가 뜨는 자리. 레이아웃마다 한 번만 배치한다.
 *
 * 화면 어디서 띄우든 같은 자리에 떠야 하고 페이지를 옮겨도 살아 있어야 해서,
 * 호출부가 아니라 layout이 소유한다.
 *
 * 여백을 CSS 변수 상속이 아니라 prop으로 받는 건 Portal 때문이다. 토스트는 `body`에
 * 붙으므로 레이아웃 노드에 선언한 변수가 닿지 않는다. 여기서 인라인으로 심어야 전달된다.
 */
export function Toaster({ bottomInset }: ToasterProps = {}) {
  return (
    <BaseToast.Provider toastManager={toastManager} timeout={TIMEOUT_MS} limit={LIMIT}>
      <BaseToast.Portal>
        <BaseToast.Viewport
          className="toast-viewport"
          style={
            bottomInset === undefined
              ? undefined
              : ({ "--layout-floating-inset-block": `${bottomInset}px` } as CSSProperties)
          }
        >
          <ToastList />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}
