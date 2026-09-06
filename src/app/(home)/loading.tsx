import { ScreenLayout } from "@/shared/components/ScreenLayout";
import { TMTLogoHomeLink } from "@/shared/components/TMTLogoHomeLink";
import { GNB } from "@/shared/ui/GNB";
import { HomeSkeleton } from "./_components/HomeSkeleton";

export default function HomeLoading() {
  return (
    <ScreenLayout
      header={<GNB align="left" className="shrink-0" title={null} left={<TMTLogoHomeLink />} />}
    >
      <HomeSkeleton />
    </ScreenLayout>
  );
}
