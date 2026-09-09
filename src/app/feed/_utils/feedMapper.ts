import type { CursorPagePlaceCardResponse } from "@/api/gen/_model/cursorPagePlaceCardResponse.gen";
import type { CursorPageReviewCardResponse } from "@/api/gen/_model/cursorPageReviewCardResponse.gen";
import type { ItemsResponseCurationTagResponse } from "@/api/gen/_model/itemsResponseCurationTagResponse.gen";
import type { NearbyPlacesResponse } from "@/api/gen/_model/nearbyPlacesResponse.gen";
import type { PlaceDetailResponse } from "@/api/gen/_model/placeDetailResponse.gen";
import type { FoodCategory } from "@/shared/model/foodCategory";
import type { ReviewCardData } from "@/shared/model/review";
import { toFoodCategory } from "@/shared/utils/foodCategoryMapper";
import { toReviewCardData } from "@/shared/utils/reviewMapper";

export interface CurationChip {
  id: string;
  label: string;
}

export function toFeedReviews(page: CursorPageReviewCardResponse): ReviewCardData[] {
  return page.items.map(toReviewCardData);
}

export function toCurationChips(response: ItemsResponseCurationTagResponse): CurationChip[] {
  return response.items.map((tag) => ({ id: tag.curationTagId, label: tag.label }));
}

export interface FeedPin {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  /** 선택된 핀이 그리는 아이콘. 서버가 모르는 매장은 null이고 가게 아이콘이 대신 들어간다. */
  category: FoodCategory | null;
  reviewCount: number;
}

export interface FeedPins {
  pins: FeedPin[];
  /** 상한(30개)에 걸려 잘렸는지. 화면이 확대 안내를 띄운다 (명세 §2-3). */
  truncated: boolean;
}

export function toFeedPins(response: NearbyPlacesResponse): FeedPins {
  return {
    pins: response.items.map((pin) => ({
      id: pin.placeId,
      name: pin.name,
      latitude: pin.latitude,
      longitude: pin.longitude,
      category: toFoodCategory(pin.categoryId),
      reviewCount: pin.reviewCount,
    })),
    truncated: response.truncated,
  };
}

export interface PinPlace {
  id: string;
  name: string;
  averageRating: number | null;
  photoUrls: string[];
  roadAddress: string;
  phoneNumber: string | null;
  latitude: number;
  longitude: number;
  isFavorite: boolean;
}

export function toPinPlace(response: PlaceDetailResponse): PinPlace {
  return {
    id: response.placeId,
    name: response.name,
    averageRating: response.averageRating ?? null,
    photoUrls: response.photos.map((photo) => photo.url),
    roadAddress: response.roadAddress,
    phoneNumber: response.phoneNumber ?? null,
    latitude: response.latitude,
    longitude: response.longitude,
    isFavorite: response.isFavorite,
  };
}

export interface PlaceCard {
  id: string;
  name: string;
  regionName: string;
  categoryName: string | null;
  averageRating: number | null;
  reviewCount: number;
  thumbnailUrl: string | null;
  distanceMeters: number | null;
  isFavorite: boolean;
}

export function toPlaceCards(page: CursorPagePlaceCardResponse): PlaceCard[] {
  return page.items.map((place) => ({
    id: place.placeId,
    name: place.name,
    regionName: place.regionName,
    categoryName: place.categoryName ?? null,
    averageRating: place.averageRating ?? null,
    reviewCount: place.reviewCount,
    thumbnailUrl: place.thumbnailUrl ?? null,
    distanceMeters: place.distanceMeters ?? null,
    isFavorite: place.isFavorite,
  }));
}
