import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";
import PotShape from "./assets/pot.svg?react";

/**
 * 뚜껑 없는 냄비. Pot 컴포넌트(Figma 1585:30041)에는 뚜껑 레이어가 있지만 이 화면의
 * 인스턴스(1792:38204)는 그것을 끈 상태로 쓴다.
 *
 * 박스는 그림에 딱 맞춘다. 시안의 170 정사각 인스턴스는 뚜껑 자리까지 포함한 크기라 위쪽에
 * 60px 넘게 빈 공간이 남는데, 그대로 두면 세로 배분에서 냄비가 아래로 치우쳐 보인다.
 *
 * `behind`로 넘긴 것은 냄비 그림 **뒤에** 깔린다. 떨어지는 공이 여기로 들어와, 냄비에 닿는
 * 순간 가려지며 안으로 들어간 것처럼 보인다.
 */
const BOX = 60;
const SHAPE = { width: 56.4286, height: 28.5714 } as const;

type PotIllustrationProps = Readonly<{
  size: number;
  /** 냄비 그림 뒤에 깔린다. 떨어지는 공과 국자가 여기 들어간다. */
  behind?: ReactNode;
  /** 냄비 그림 앞에 얹힌다. 냄비 위에서 뿌리는 후추가 여기 들어간다. */
  above?: ReactNode;
  className?: string;
}>;

export function PotIllustration({ size, behind, above, className }: PotIllustrationProps) {
  const scale = size / BOX;

  return (
    <div
      data-entrance="pot"
      className={cn("relative shrink-0", className)}
      style={{ width: SHAPE.width * scale, height: SHAPE.height * scale }}
    >
      {behind}
      <div data-entrance="pot-tilt" className="absolute inset-0">
        <PotShape aria-hidden="true" className="absolute inset-0 size-full" />
      </div>
      {above}
    </div>
  );
}
