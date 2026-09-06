import { Skeleton } from "@/shared/ui/Skeleton";

export function HomeSkeleton() {
  return (
    <main aria-busy="true" className="flex flex-1 flex-col gap-ds-4 bg-surface-secondary">
      <section className="flex flex-col gap-ds-12 bg-surface-primary px-ds-20 py-ds-16">
        <Skeleton className="h-ds-24 w-ds-64" />
        <div className="flex gap-ds-12 overflow-hidden">
          <Skeleton className="h-ds-64 w-ds-64 shrink-0" />
          <Skeleton className="h-ds-64 w-ds-64 shrink-0" />
        </div>
      </section>
      <section className="flex flex-1 flex-col gap-ds-12 bg-surface-primary px-ds-20 py-ds-20">
        <Skeleton className="h-ds-24 w-ds-48" />
        <Skeleton className="h-ds-64 w-full" />
        <Skeleton className="h-ds-64 w-full" />
      </section>
    </main>
  );
}
