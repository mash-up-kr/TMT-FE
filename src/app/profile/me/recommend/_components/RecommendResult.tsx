"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import dummyImage from "@/shared/assets/dummy-image.png";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { ThumbDownIcon, ThumbUpIcon } from "@/shared/ui/ColorIcons";
import { MapPinIcon } from "@/shared/ui/Icons";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import { GRID_SURFACE, RESULT_LAYOUT } from "../_constants/appearance";
import type { RecommendResult as RecommendResultModel } from "../_model/recommend";
import BoilingPotShape from "./assets/pot-boiling.svg?react";

type RecommendResultProps = Readonly<{
  result: RecommendResultModel;
  onOpenDetail: () => void;
}>;

/**
 * 추천 결과 화면. 시안 1674:61096을 옮긴 것이다.
 *
 * 위에 끓는 냄비가 남고 그 아래 카드와 버튼이 온다. 화면 전체가 통째로 투명도만 켜지며
 * 나타난다 — 요소마다 따로 들어오면 방금 끝난 연출과 리듬이 겹쳐 산만하다.
 */
export function RecommendResult({ result, onOpenDetail }: RecommendResultProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia(root.current ?? undefined);

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(root.current, { autoAlpha: 1 });
      });

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.fromTo(
          root.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.5, ease: "power2.out" },
        );

        return () => tween.kill();
      });

      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="invisible flex w-full flex-col items-center">
      <BoilingPotShape
        aria-hidden="true"
        className="shrink-0"
        style={{ width: RESULT_LAYOUT.potSize, height: RESULT_LAYOUT.potSize }}
      />

      {/*
        카드가 냄비를 물고 올라간다. 냄비 박스는 아래쪽 33px이 빈 공간이라, 그만큼 겹쳐야
        카드 윗변이 냄비 그림 아랫변에 맞물린다. 시안도 냄비 44~194 위에 카드가 160에서 시작한다.
      */}
      <div
        style={{ backgroundColor: GRID_SURFACE, marginTop: -RESULT_LAYOUT.cardOverlap }}
        className="relative flex w-full flex-col gap-ds-20 rounded-ds-lg p-ds-20"
      >
        <div className="flex flex-col gap-ds-12">
          <h2 className="text-heading-md text-content-primary">{result.name}</h2>
          <div className="flex items-center gap-ds-4 text-body-md-medium text-content-tertiary">
            <MapPinIcon size={20} aria-hidden="true" className="shrink-0" />
            <span className="truncate">{result.roadAddress}</span>
            {result.categoryName ? (
              <>
                <span aria-hidden="true" className="h-[12px] w-px shrink-0 bg-stroke-primary" />
                <span className="shrink-0">{result.categoryName}</span>
              </>
            ) : null}
          </div>
        </div>

        <div className="h-[155px] w-full overflow-hidden rounded-ds-md bg-surface-tertiary">
          <ImageWithFallback
            src={result.thumbnailUrl}
            alt=""
            fallbackSrc={dummyImage}
            className="size-full object-cover"
          />
        </div>

        <ul className="flex flex-col items-start gap-ds-8">
          {result.summaries.map((summary) => (
            <li
              key={summary.id}
              className="flex items-start gap-ds-4 rounded-ds-xs bg-surface-primary px-ds-8 py-ds-4"
            >
              {summary.tone === "up" ? (
                <ThumbUpIcon size={20} aria-hidden="true" className="shrink-0" />
              ) : (
                <ThumbDownIcon size={20} aria-hidden="true" className="shrink-0" />
              )}
              <span className="text-body-sm-regular text-content-secondary">{summary.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <ButtonStack style={{ marginTop: RESULT_LAYOUT.cardToButton }}>
        <Button variant="secondary" size="lg" onClick={onOpenDetail}>
          자세히 보기
        </Button>
      </ButtonStack>
    </div>
  );
}
