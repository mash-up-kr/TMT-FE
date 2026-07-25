import { BlankIcon } from "@/shared/ui/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/Tabs";

const tabItems = [
  { value: "recent", label: "최근", content: "최근 탭 콘텐츠" },
  { value: "saved", label: "저장", content: "저장 탭 콘텐츠" },
  { value: "visited", label: "방문", content: "방문 탭 콘텐츠" },
] as const;

export default function Home() {
  return (
    <main className="content-container flex flex-1 flex-col gap-ds-24 py-ds-32">
      <h1 className="text-heading-sm text-content-primary">Tabs Playground</h1>

      <div className="overflow-hidden rounded-ds-sm border border-stroke-secondary bg-surface-primary">
        <Tabs defaultValue="recent">
          <TabsList>
            {tabItems.map(({ value, label }) => (
              <TabsTrigger key={value} value={value}>
                <BlankIcon />
                {label}
              </TabsTrigger>
            ))}
            <TabsTrigger value="disabled" disabled>
              <BlankIcon />
              비활성
            </TabsTrigger>
          </TabsList>

          {tabItems.map(({ value, content }) => (
            <TabsContent
              key={value}
              value={value}
              className="p-ds-24 text-body-md-regular text-content-secondary"
            >
              {content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </main>
  );
}
