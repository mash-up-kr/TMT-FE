import { EmptyNotice } from "@/shared/components/EmptyNotice/EmptyNotice";
import { LoadingIcon } from "@/shared/ui/Icons";

export function GroupEditLoading() {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center bg-surface-primary">
      <LoadingIcon className="animate-spin text-icon-tertiary" />
      <span className="sr-only">그룹 정보를 불러오는 중</span>
    </div>
  );
}

export function GroupEditError() {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center bg-surface-primary px-ds-20">
      <EmptyNotice title="그룹 정보를 불러오지 못했어요.">잠시 후 다시 시도해 주세요.</EmptyNotice>
    </div>
  );
}

export function GroupEditForbidden() {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center bg-surface-primary px-ds-20">
      <EmptyNotice title="그룹장만 편집할 수 있어요." />
    </div>
  );
}
