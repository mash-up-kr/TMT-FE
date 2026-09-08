import { EmptyNotice } from "@/shared/components/EmptyNotice/EmptyNotice";

type NearbyNoticeProps = {
  title: string;
  children?: string;
};

export function NearbyNotice({ title, children }: NearbyNoticeProps) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center bg-surface-primary px-ds-20 py-ds-32">
      <EmptyNotice title={title}>{children}</EmptyNotice>
    </div>
  );
}
