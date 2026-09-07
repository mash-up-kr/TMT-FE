import { AppBottomNav } from "@/shared/components/AppBottomNav";
import { ScreenLayout, type ScreenLayoutProps } from "@/shared/components/ScreenLayout";
import type { AppBottomNavValue } from "@/shared/utils/bottomNavigationPolicy";

/** 프리뷰 경로는 AppChrome 정책 밖이라 바텀 내브와 그 점유 높이를 직접 조합한다. */
export function PreviewBottomNavScreenLayout({
  activeTab,
  ...screenLayoutProps
}: ScreenLayoutProps & { activeTab: AppBottomNavValue }) {
  return (
    <div className="bottom-navigation-inset relative flex min-h-0 flex-1 flex-col">
      <div className="scroll-under-navigation flex min-h-0 flex-1 flex-col">
        <ScreenLayout {...screenLayoutProps} />
      </div>
      <AppBottomNav activeTab={activeTab} />
    </div>
  );
}
