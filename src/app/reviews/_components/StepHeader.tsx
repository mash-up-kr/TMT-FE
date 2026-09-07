import type { ReactNode } from "react";
import { Badge } from "@/shared/ui/Badge";
import { AlertCircleIcon } from "@/shared/ui/Icons";
import { cn } from "@/shared/utils/cn";

const OPTIONAL_MESSAGE = "모든 항목을 입력하면 그룹 가입 티켓을 드려요";

type StepHeaderProps = Readonly<{
  title: ReactNode;
  required?: boolean;
}>;

export function StepHeader({ title, required = false }: StepHeaderProps) {
  return (
    <header className={cn("flex flex-col items-start gap-ds-12", required && "pb-ds-16")}>
      <h1 className="text-heading-lg text-content-primary">{title}</h1>

      {required ? (
        <Badge size="md">필수</Badge>
      ) : (
        <p className="flex w-full items-center gap-ds-4 rounded-ds-xs bg-surface-secondary px-ds-12 py-ds-8 text-body-md-medium text-content-tertiary">
          <AlertCircleIcon size={16} className="shrink-0" />
          {OPTIONAL_MESSAGE}
        </p>
      )}
    </header>
  );
}
