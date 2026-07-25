import { BlankIcon } from "@/shared/ui/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/Tabs";

const states = ["Default", "Hovered", "Pressed", "Disabled"] as const;
const itemCounts = [8, 7, 6, 5, 4, 3] as const;

type PreviewState = (typeof states)[number];

const stateClassNames: Record<PreviewState, string | undefined> = {
  Default: undefined,
  Hovered: "bg-surface-secondary text-content-secondary",
  Pressed: "bg-surface-tertiary text-content-tertiary",
  Disabled: undefined,
};

function TabItemPreview({
  selected,
  state,
  withIcon,
}: Readonly<{
  selected: boolean;
  state: PreviewState;
  withIcon: boolean;
}>) {
  return (
    <div className="flex w-32 justify-center">
      <Tabs defaultValue={selected ? "preview" : "inactive"}>
        <TabsList className="w-max overflow-visible border-b-0">
          <TabsTrigger
            value="preview"
            disabled={state === "Disabled"}
            className={stateClassNames[state]}
          >
            {withIcon && <BlankIcon />}
            Label
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

function TabItemMatrix({ withIcon }: Readonly<{ withIcon: boolean }>) {
  return (
    <div className="overflow-x-auto rounded-ds-sm border border-stroke-secondary bg-surface-primary p-ds-20">
      <div className="flex min-w-max flex-col gap-ds-16">
        <div className="flex items-center gap-ds-20 text-body-sm-medium text-content-tertiary">
          <span className="w-24">Selected</span>
          {states.map((state) => (
            <span key={state} className="w-32 text-center">
              {state}
            </span>
          ))}
        </div>
        {[false, true].map((selected) => (
          <div key={String(selected)} className="flex items-center gap-ds-20">
            <span className="w-24 text-body-md-medium text-content-secondary">
              {String(selected)}
            </span>
            {states.map((state) => (
              <TabItemPreview key={state} selected={selected} state={state} withIcon={withIcon} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function TabsCountPreview({ count, withIcon }: Readonly<{ count: number; withIcon: boolean }>) {
  return (
    <div className="flex min-w-max items-center gap-ds-20">
      <span className="w-16 shrink-0 text-body-sm-medium text-content-tertiary">Items={count}</span>
      <Tabs defaultValue="item-1">
        <TabsList className="w-max">
          {Array.from({ length: count }, (_, index) => {
            const value = `item-${index + 1}`;

            return (
              <TabsTrigger key={value} value={value}>
                {withIcon && <BlankIcon />}
                Label
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
}

function TabsCountMatrix({ withIcon }: Readonly<{ withIcon: boolean }>) {
  return (
    <div className="overflow-x-auto rounded-ds-sm border border-stroke-secondary bg-surface-primary p-ds-20">
      <div className="flex min-w-max flex-col gap-ds-20">
        {itemCounts.map((count) => (
          <TabsCountPreview key={count} count={count} withIcon={withIcon} />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex flex-1 flex-col pb-ds-64">
      <header className="content-container border-b border-stroke-secondary py-ds-32">
        <div className="flex flex-col gap-ds-8">
          <p className="text-body-sm-medium text-content-tertiary">Component</p>
          <h1 className="text-heading-lg text-content-primary">Tabs</h1>
        </div>
      </header>

      <section className="content-container flex flex-col gap-ds-24 py-ds-32">
        <div className="flex flex-col gap-ds-4">
          <h2 className="text-heading-sm text-content-primary">Tab item</h2>
          <p className="text-body-md-regular text-content-secondary">Icon=False</p>
        </div>
        <TabItemMatrix withIcon={false} />

        <p className="text-body-md-regular text-content-secondary">Icon=True</p>
        <TabItemMatrix withIcon />
      </section>

      <section className="content-container flex flex-col gap-ds-24 border-t border-stroke-tertiary py-ds-32">
        <div className="flex flex-col gap-ds-4">
          <h2 className="text-heading-sm text-content-primary">Tabs</h2>
          <p className="text-body-md-regular text-content-secondary">Icon=False</p>
        </div>
        <TabsCountMatrix withIcon={false} />

        <p className="text-body-md-regular text-content-secondary">Icon=True</p>
        <TabsCountMatrix withIcon />
      </section>

      <section className="content-container flex flex-col gap-ds-24 border-t border-stroke-tertiary py-ds-32">
        <h2 className="text-heading-sm text-content-primary">Playground</h2>
        <div className="overflow-hidden rounded-ds-sm border border-stroke-secondary bg-surface-primary">
          <Tabs defaultValue="recent">
            <TabsList>
              <TabsTrigger value="recent">
                <BlankIcon />
                최근
              </TabsTrigger>
              <TabsTrigger value="saved">
                <BlankIcon />
                저장
              </TabsTrigger>
              <TabsTrigger value="visited">
                <BlankIcon />
                방문
              </TabsTrigger>
              <TabsTrigger value="disabled" disabled>
                <BlankIcon />
                비활성
              </TabsTrigger>
            </TabsList>
            {[
              ["recent", "최근 탭 콘텐츠"],
              ["saved", "저장 탭 콘텐츠"],
              ["visited", "방문 탭 콘텐츠"],
            ].map(([value, content]) => (
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
      </section>
    </main>
  );
}
