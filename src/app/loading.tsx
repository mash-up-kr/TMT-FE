import { LoadingIcon } from "@/shared/ui/Icons";

export default function Loading() {
  return (
    <output className="flex min-h-0 flex-1 items-center justify-center bg-surface-secondary">
      <LoadingIcon className="animate-spin text-icon-tertiary" />
    </output>
  );
}
