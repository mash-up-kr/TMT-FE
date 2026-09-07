import { AppBottomNav } from "@/shared/components/AppBottomNav";
import { ScreenLayout, type ScreenLayoutProps } from "@/shared/components/ScreenLayout";
import type { AppBottomNavValue } from "@/shared/model/appNavigation";

/** 프리뷰 경로는 AppChrome 정책 밖이라 바텀 내브를 직접 조합한다. */
export function PreviewBottomNavScreenLayout({
  activeTab,
  ...screenLayoutProps
}: ScreenLayoutProps & { activeTab: AppBottomNavValue }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ScreenLayout {...screenLayoutProps} />
      <AppBottomNav activeTab={activeTab} />
    </div>
  );
}
