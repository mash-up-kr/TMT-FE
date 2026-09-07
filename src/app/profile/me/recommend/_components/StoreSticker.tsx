"use client";

import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import type { FoodCategory } from "../_model/recommend";
import { FoodCategorySticker } from "./FoodCategorySticker";

type StoreStickerProps = Readonly<{
  thumbnailUrl: string | null;
  category: FoodCategory | null;
  size: number;
}>;

/**
 * 매장 한 곳의 그림. 내가 쓴 리뷰의 사진이 있으면 사진, 없으면 카테고리 스티커다.
 *
 * 격자 칸과 냄비로 떨어지는 공이 함께 쓴다. 둘이 다른 규칙으로 그리면 담는 순간 "저 칸이
 * 내려갔다"로 읽히지 않는다.
 *
 * 원형으로 자르는 것은 부모가 한다 — 칸(52)과 공(36)의 지름이 다르고, 흰 원은 스티커일 때
 * 배경으로도 쓰인다.
 */
export function StoreSticker({ thumbnailUrl, category, size }: StoreStickerProps) {
  return (
    <ImageWithFallback
      src={thumbnailUrl}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className="size-full object-cover"
      fallback={<FoodCategorySticker category={category} size={size} />}
    />
  );
}
