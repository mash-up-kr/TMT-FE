import { Toast } from "@base-ui/react/toast";

export type ToastType = "success" | "warning" | "error";

export type ToastData = {
  type: ToastType;
};

/**
 * Base UI의 `data`는 optional이지만, 우리 토스트는 항상 타입을 싣는다.
 * 폴백을 두면 `toast.error(...)`로 띄운 토스트에 성공 아이콘이 조용히 나올 수 있어 타입으로 막는다.
 */
export type TypedToast = Toast.Root.ToastObject<ToastData> & { data: ToastData };

export function hasToastData(toast: Toast.Root.ToastObject<ToastData>): toast is TypedToast {
  return toast.data !== undefined;
}

/** 컴포넌트 밖에서도 토스트를 띄우기 위한 매니저. */
export const toastManager = Toast.createToastManager<ToastData>();

function show(type: ToastType, title: string, description?: string) {
  return toastManager.add({ title, description, data: { type } });
}

/** 토스트를 띄운다. 반환값은 `toastManager.close(id)`로 직접 닫을 때 쓴다. */
export const toast = {
  success: (title: string, description?: string) => show("success", title, description),
  warning: (title: string, description?: string) => show("warning", title, description),
  error: (title: string, description?: string) => show("error", title, description),
};
