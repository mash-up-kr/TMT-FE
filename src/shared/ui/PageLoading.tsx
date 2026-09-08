import { Spinner } from "./Spinner";

/** 인증 복원과 페이지 조회 사이에 로딩 화면의 외형이 바뀌지 않도록 공유한다. */
export function PageLoading() {
  return (
    <div
      role="status"
      className="flex min-h-0 flex-1 items-center justify-center bg-surface-primary"
    >
      <span className="sr-only">로딩 중</span>
      <Spinner size="lg" />
    </div>
  );
}
