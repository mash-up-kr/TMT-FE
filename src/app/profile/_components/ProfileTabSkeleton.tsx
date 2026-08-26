/** 탭 본문의 첫 조회 동안 자리를 잡아둔다. 프로필과 탭은 유지된다. */
export function ProfileTabSkeleton() {
  return (
    <div aria-busy="true" className="content-container flex flex-col gap-ds-12 py-ds-16">
      {[0, 1, 2].map((row) => (
        <div key={row} className="h-[80px] animate-pulse rounded-ds-md bg-surface-secondary" />
      ))}
    </div>
  );
}
