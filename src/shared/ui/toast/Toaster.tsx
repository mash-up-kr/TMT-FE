"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";
import { ToastItem } from "./ToastItem";
import { hasToastData, type ToastData, toastManager } from "./toast";

/** 시안에 값이 없어 조직 관례를 따른다. */
const TIMEOUT_MS = 3000;

/** 동시에 보이는 최대 개수. 넘겨진 토스트는 지워지는 대신 `inert` 되어 스크린리더가 읽지 않는다. */
const LIMIT = 3;

function ToastList() {
  const { toasts } = BaseToast.useToastManager<ToastData>();

  return toasts.filter(hasToastData).map((toast) => <ToastItem key={toast.id} toast={toast} />);
}

/**
 * 토스트가 뜨는 자리. root layout에 한 번만 배치한다.
 *
 * 화면 어디서 띄우든 같은 자리에 떠야 하고 페이지를 옮겨도 살아 있어야 해서
 * 호출부가 아니라 layout이 소유한다. 실제 호출은 `toast.success(...)`로 한다.
 */
export function Toaster() {
  return (
    <BaseToast.Provider toastManager={toastManager} timeout={TIMEOUT_MS} limit={LIMIT}>
      <BaseToast.Portal>
        <BaseToast.Viewport className="toast-viewport">
          <ToastList />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}
