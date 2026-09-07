import { HomeScreen } from "./_components/HomeScreen";

/** Access token은 브라우저 메모리에 있으므로 인증 복원 후 화면에서 조회한다. */
export default function Home() {
  return <HomeScreen />;
}
