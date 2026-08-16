"use client";

import { useId } from "react";
import { StarIcon } from "@/shared/ui/icons";
import { cn } from "@/shared/utils/cn";

/** 시안 5점 척도. */
const MAX_RATING = 5;

/** 시안 44x44. 터치 타깃 최소 크기(design-system rule)와도 같은 값이다. */
const starSize = "size-[44px]";

type StarRatingFieldProps = Readonly<{
  label: string;
  value: number;
  onChange: (value: number) => void;
}>;

/**
 * 별점 입력.
 *
 * 하나만 고르는 입력이라 radio group으로 만든다. 별을 버튼 5개로 두면 "여러 개를 누를 수 있는
 * 것"처럼 읽히고, 키보드 좌우 이동도 직접 만들어야 한다. native radio를 숨기고 라벨만 별로
 * 그리면 두 문제가 함께 사라진다.
 *
 * 채움은 누른 별까지 전부다(시안 주석: `왼쪽에서 4번째 별 클릭시 왼쪽 3개도 자동 선택`).
 */
export function StarRatingField({ label, value, onChange }: StarRatingFieldProps) {
  const name = useId();

  return (
    <fieldset>
      {/* legend는 flex 아이템이 되지 않아 fieldset의 gap이 걸리지 않는다. 간격은 legend가 낸다. */}
      <legend className="mb-ds-12 text-body-lg-medium text-content-primary">{label}</legend>

      <div className="flex">
        {Array.from({ length: MAX_RATING }, (_, index) => {
          const score = index + 1;
          const filled = score <= value;

          return (
            <label
              key={score}
              className={cn(
                starSize,
                "flex cursor-pointer items-center justify-center",
                "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-stroke-interactive-primary",
                filled ? "text-icon-interactive-primary" : "text-surface-tertiary",
              )}
            >
              <input
                type="radio"
                name={name}
                value={score}
                checked={score === value}
                onChange={() => onChange(score)}
                className="sr-only"
              />
              <span className="sr-only">{score}점</span>
              {/* 아이콘이 44 칸을 채운다. 별 글리프의 여백은 아이콘 안에 이미 들어 있다. */}
              <StarIcon size={44} />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
