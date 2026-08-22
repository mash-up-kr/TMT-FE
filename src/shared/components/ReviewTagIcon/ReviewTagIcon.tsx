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

/**
 * 리뷰 태그 id와 아이콘의 대응. 정본 태그 목록은 GET /v1/review-form-config다.
 * 스펙에 tagId enum이 없어 모르는 id가 올 수 있고, 그때는 아이콘 없이 라벨만 보이도록
 * null을 렌더한다.
 */
const TAG_ICONS: Record<string, ComponentType<ColorIconProps>> = {
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

type ReviewTagIconProps = ColorIconProps & {
  tagId: string;
};

export function ReviewTagIcon({ tagId, ...props }: ReviewTagIconProps) {
  const Icon = TAG_ICONS[tagId];

  return Icon ? <Icon {...props} /> : null;
}
