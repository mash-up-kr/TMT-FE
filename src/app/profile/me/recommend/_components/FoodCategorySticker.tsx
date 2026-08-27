import Image from "next/image";
import type { FoodCategory } from "../_model/recommend";
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

type FoodCategoryStickerProps = Readonly<{
  category: FoodCategory;
  size: number;
  className?: string;
}>;

export function FoodCategorySticker({ category, size, className }: FoodCategoryStickerProps) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      src={STICKERS[category]}
      width={size}
      height={size}
      className={className}
    />
  );
}
