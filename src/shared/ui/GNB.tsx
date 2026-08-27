import type { ReactNode } from "react";
import { TMTLogo } from "@/shared/ui/Icons";
import { cn } from "@/shared/utils/cn";

type GNBProps = Readonly<{
  /** 좌측 슬롯. */
  left?: ReactNode;
  /** 우측 슬롯. */
  right?: ReactNode;
  /** 없으면 로고가 대신 들어간다. `null`이면 헤딩 칸 자체를 비운다. */
  title?: string | null;
  /** 타이틀·로고의 가로 위치. 기본은 중앙. */
  align?: "center" | "left";
  className?: string;
}>;

/**
 * 상단 네비게이션 바.
 *
 * 슬롯은 항상 좌·중앙·우 세 칸이고 정렬은 트랙 정의로만 가른다. 계층을 align에 따라 바꾸면
 * 슬롯 간격과 축소 계약이 분기마다 달라져 같은 종류의 누락이 반복된다.
 *
 * 높이는 `--layout-gnb-height`가 소유한다. 슬롯 내용물(로고 20·아이콘 24|28·타이틀 26)에
 * 맡기면 화면마다 44~52로 갈린다. 슬롯 쪽에서 높이를 맞추려 들지 않는다.
 */
export function GNB({ left, right, title, align = "center", className }: GNBProps) {
  const hasHeading = title !== null;

  // 빈 칸이라도 grid gap은 들어가 제목이 8px 밀린다. 트랙에서만 빼고 DOM은 그대로 둔다.
  // `left={조건 && <Button />}`의 false처럼 렌더되지 않는 값도 빈 슬롯으로 본다.
  const leftIsEmpty =
    left === undefined || left === null || typeof left === "boolean" || left === "";
  const collapseLeft = align === "left" && leftIsEmpty;

  return (
    <header
      className={cn(
        "grid min-h-(--layout-gnb-height) w-full items-center gap-ds-8 bg-surface-primary px-ds-20 py-ds-12",
        resolveColumns(align, !collapseLeft, hasHeading),
        className,
      )}
    >
      <div className={cn("flex items-center justify-start gap-ds-8", collapseLeft && "contents")}>
        {left}
      </div>
      <GNBHeading title={title} />
      <div className="flex items-center justify-end gap-ds-8">{right}</div>
    </header>
  );
}

/**
 * 헤딩 칸의 세 가지 상태를 한 곳에 모은다.
 * 생략이면 로고, 문자열이면 텍스트, `null`이면 칸 자체를 렌더하지 않는다 —
 * 트랙 계산(resolveColumns)의 hasHeading과 같은 기준(title !== null)을 쓴다.
 */
function GNBHeading({ title }: { title?: string | null }) {
  if (title === null) {
    return null;
  }

  return (
    <div className="flex min-w-0 items-center justify-center">
      {title ? (
        <p className="truncate text-heading-sm text-content-primary">{title}</p>
      ) : (
        <TMTLogo />
      )}
    </div>
  );
}

function resolveColumns(align: "center" | "left", hasLeft: boolean, hasHeading: boolean): string {
  if (align === "center") {
    return hasHeading ? "grid-cols-[1fr_auto_1fr]" : "grid-cols-[1fr_1fr]";
  }

  if (hasLeft) {
    return hasHeading ? "grid-cols-[auto_auto_1fr]" : "grid-cols-[auto_1fr]";
  }

  return hasHeading ? "grid-cols-[auto_1fr]" : "grid-cols-[1fr]";
}
