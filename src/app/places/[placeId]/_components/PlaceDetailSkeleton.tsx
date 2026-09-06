import { Skeleton } from "@/shared/ui/Skeleton";

export function PlaceDetailSkeleton() {
  return (
    <main
      aria-busy="true"
      className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-surface-primary"
    >
      <section className="flex flex-col gap-ds-12 px-ds-20 py-ds-16">
        <Skeleton className="h-ds-24 w-ds-64" />
        <Skeleton className="h-ds-64 w-full" />
        <Skeleton className="h-ds-16 w-ds-40" />
      </section>
      <div aria-hidden="true" className="h-ds-12 shrink-0 bg-surface-secondary" />
      <section className="flex flex-col gap-ds-12 px-ds-20 py-ds-20">
        <Skeleton className="h-ds-24 w-ds-32" />
        <Skeleton className="h-ds-64 w-full" />
        <Skeleton className="h-ds-64 w-full" />
      </section>
    </main>
  );
}
