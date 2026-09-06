import { LoadingIcon } from "@/shared/ui/Icons";

export function GroupDetailLoading() {
  return (
    <div className="flex flex-1 items-center justify-center bg-surface-secondary">
      <LoadingIcon className="animate-spin text-icon-tertiary" />
    </div>
  );
}

/** preview route가 error state를 표시할 때만 쓴다. */
export function GroupDetailError() {
  return (
    <div role="alert" className="flex flex-1 items-center justify-center bg-surface-secondary">
      <p className="text-body-md-regular text-content-secondary">
        그룹 상세 데이터를 불러오지 못했어요.
      </p>
    </div>
  );
}
