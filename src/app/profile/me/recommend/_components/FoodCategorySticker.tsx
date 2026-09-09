import Image from "next/image";
import type { FoodCategory } from "@/shared/model/foodCategory";
import asian from "./assets/asian.png";
import bar from "./assets/bar.png";
import brunch from "./assets/brunch.png";
import buffet from "./assets/buffet.png";
import cafe from "./assets/cafe.png";
import chinese from "./assets/chinese.png";
import fastfood from "./assets/fastfood.png";
import grill from "./assets/grill.png";
import japanese from "./assets/japanese.png";
import korean from "./assets/korean.png";
import pub from "./assets/pub.png";
import seafood from "./assets/seafood.png";
import snack from "./assets/snack.png";
import western from "./assets/western.png";

const STICKERS = {
  grill,
  bar,
  snack,
  buffet,
  brunch,
  asian,
  western,
  japanese,
  pub,
  chinese,
  cafe,
  fastfood,
  korean,
  seafood,
} satisfies Record<FoodCategory, unknown>;

/** 서버가 카테고리를 주지 못한 매장이 그리는 그림. 특정 요리로 읽히지 않는 모둠 접시다. */
const FALLBACK_CATEGORY: FoodCategory = "buffet";

type FoodCategoryStickerProps = Readonly<{
  category: FoodCategory | null;
  size: number;
  className?: string;
}>;

export function FoodCategorySticker({ category, size, className }: FoodCategoryStickerProps) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      src={STICKERS[category ?? FALLBACK_CATEGORY]}
      width={size}
      height={size}
      className={className}
    />
  );
}
