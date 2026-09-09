import type { ComponentType } from "react";
import type { FoodCategory } from "@/shared/model/foodCategory";
import {
  AsianIcon,
  BarIcon,
  BrunchIcon,
  BuffetIcon,
  CafeIcon,
  CategoryFallbackIcon,
  ChineseIcon,
  type ColorIconProps,
  FastfoodIcon,
  GrillIcon,
  JapaneseIcon,
  KoreanIcon,
  PubIcon,
  SeafoodIcon,
  SnackIcon,
  WesternIcon,
} from "@/shared/ui/ColorIcons";

const CATEGORY_ICONS = {
  grill: GrillIcon,
  bar: BarIcon,
  snack: SnackIcon,
  buffet: BuffetIcon,
  brunch: BrunchIcon,
  asian: AsianIcon,
  western: WesternIcon,
  japanese: JapaneseIcon,
  pub: PubIcon,
  chinese: ChineseIcon,
  cafe: CafeIcon,
  fastfood: FastfoodIcon,
  korean: KoreanIcon,
  seafood: SeafoodIcon,
} satisfies Record<FoodCategory, ComponentType<ColorIconProps>>;

type FoodCategoryIconProps = ColorIconProps & {
  category: FoodCategory | null;
};

/** 카테고리를 모르는 매장은 가게 아이콘을 그린다 (시안 2789:39346 주석). */
export function FoodCategoryIcon({ category, ...props }: FoodCategoryIconProps) {
  const Icon = category ? CATEGORY_ICONS[category] : CategoryFallbackIcon;

  return <Icon {...props} />;
}
