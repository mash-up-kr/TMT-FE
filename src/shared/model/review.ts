import type { FoodCategory } from "@/shared/model/foodCategory";

export type ReviewCardData = {
  id: string;
  authorId: string;
  authorNickname: string;
  authorProfileImageUrl: string | null;
  rating: number;
  distanceMeters: number | null;
  photoUrls: string[];
  pros: string | null;
  cons: string | null;
  content: string | null;
  contentLength: number;
  tags: { id: string; label: string }[];
  place: {
    id: string;
    name: string;
    regionName: string;
    category?: FoodCategory | null;
    isFavorite?: boolean;
  };
};
