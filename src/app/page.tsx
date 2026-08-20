import { HomeShell } from "./_components/HomeShell";

export default function Home() {
  return (
    <HomeShell>
      <main className="content-container flex flex-1 flex-col items-center justify-center gap-2">
        <h1 className="text-heading-md text-content-primary">딸깍</h1>
        <p className="text-body-md-regular text-content-secondary">모바일 기본 레이아웃</p>
      </main>
    </HomeShell>
  );
}
