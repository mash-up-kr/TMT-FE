import type { ReactNode } from "react";

type AppFrameProps = Readonly<{
  children: ReactNode;
}>;

export function AppFrame({ children }: AppFrameProps) {
  return <div className="app-frame">{children}</div>;
}
