import { ErrorFallback } from "@/shared/components/ErrorFallback";
import { ScreenLayout } from "@/shared/components/ScreenLayout";
import { ROUTES } from "@/shared/constants/routes";

export default function NotFound() {
  return (
    <ScreenLayout header={null}>
      <ErrorFallback
        title="찾으시는 화면이 없어요."
        description="주소가 바뀌었거나 삭제되었을 수 있어요."
        actionHref={ROUTES.ROOT}
        actionLabel="홈으로"
      />
    </ScreenLayout>
  );
}
