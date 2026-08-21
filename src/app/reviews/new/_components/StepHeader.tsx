import type { ReactNode } from "react";
import { Badge } from "@/shared/ui/Badge";
import { AlertCircleIcon } from "@/shared/ui/Icons";

const OPTIONAL_MESSAGE = "정보를 입력하면 그룹에 가입할 수 있는 티켓을 드려요";

type StepHeaderProps = Readonly<{
  title: ReactNode;
  /** 시안 기준 필수 단계는 1단계뿐이다. 나머지는 안내 문구를 대신 보여준다. */
  required?: boolean;
}>;

/**
 * 단계 상단의 타이틀 묶음.
 *
 * 필수 단계는 "필수" 뱃지를, 선택 단계는 안내 문구를 단다. 둘은 같은 자리에 번갈아 놓이는
 * 한 벌이라 각 단계가 따로 조립하지 않고 여기서 함께 결정한다.
 */
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
