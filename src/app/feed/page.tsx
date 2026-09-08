import { Suspense } from "react";
import { NearbyScreen } from "./_components/NearbyScreen";

export default function NearbyPage() {
  // 화면이 검색어를 useSearchParams로 읽어 프리렌더가 불가하다. 경계를 여기서 준다.
  return (
    <Suspense>
      <NearbyScreen />
    </Suspense>
  );
}
