"use client";

import { toast } from "@/shared/ui/Toast";

type CopyAddressButtonProps = {
  address: string;
};

export function CopyAddressButton({ address }: CopyAddressButtonProps) {
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address);
      toast.success("주소가 복사되었어요.");
    } catch {
      toast.error("주소를 복사하지 못했어요. 다시 시도해 주세요.");
    }
  }

  return (
    <button
      type="button"
      aria-label="주소 복사"
      disabled={!address.trim()}
      onClick={handleCopy}
      className="shrink-0 text-body-md-medium text-content-info disabled:text-content-disabled"
    >
      복사
    </button>
  );
}
