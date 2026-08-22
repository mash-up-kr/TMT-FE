import type { ReactNode } from "react";
import { Badge } from "@/shared/ui/Badge";
import { AlertCircleIcon } from "@/shared/ui/Icons";

const OPTIONAL_MESSAGE = "정보를 입력하면 그룹에 가입할 수 있는 티켓을 드려요";

type StepHeaderProps = Readonly<{
  title: ReactNode;
  required?: boolean;
}>;

export function StepHeader({ title, required = false }: StepHeaderProps) {
  return (
    <header className="flex flex-col items-start gap-ds-12">
      <h1 className="text-heading-lg text-content-primary">{title}</h1>

      {required ? (
        <Badge size="md">필수</Badge>
      ) : (
        <p className="flex w-full items-center gap-ds-4 text-body-md-medium text-content-tertiary">
          <AlertCircleIcon size={16} className="shrink-0" />
          {OPTIONAL_MESSAGE}
        </p>
      )}
    </header>
  );
}
