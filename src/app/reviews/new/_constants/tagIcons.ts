import type { ComponentType } from "react";
import {
  CleanIcon,
  type ColorIconProps,
  CompanionAloneIcon,
  CompanionColleagueIcon,
  CompanionFamilyIcon,
  CompanionFriendIcon,
  CompanionLoverIcon,
  FoodIcon,
  MoneyIcon,
  MoodIcon,
  ResponseIcon,
  SeatIcon,
  SubwayIcon,
} from "@/shared/ui/ColorIcons";

type TagIcon = ComponentType<ColorIconProps>;

export const REVIEW_TAG_ICONS: Record<string, TagIcon> = {
  tag_alone: CompanionAloneIcon,
  tag_couple: CompanionLoverIcon,
  tag_friend: CompanionFriendIcon,
  tag_colleague: CompanionColleagueIcon,
  tag_family: CompanionFamilyIcon,
  tag_tasty: FoodIcon,
  tag_kind: ResponseIcon,
  tag_mood: MoodIcon,
  tag_value: MoneyIcon,
  tag_clean: CleanIcon,
  tag_transit: SubwayIcon,
  tag_spacious: SeatIcon,
};
