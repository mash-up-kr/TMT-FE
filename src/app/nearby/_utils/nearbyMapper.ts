import type { CursorPagePlaceCardResponse } from "@/api/gen/_model/cursorPagePlaceCardResponse.gen";
import type { CursorPageReviewCardResponse } from "@/api/gen/_model/cursorPageReviewCardResponse.gen";
import type { ItemsResponseCurationTagResponse } from "@/api/gen/_model/itemsResponseCurationTagResponse.gen";
import type { NearbyPlacesResponse } from "@/api/gen/_model/nearbyPlacesResponse.gen";
import type { PlaceDetailResponse } from "@/api/gen/_model/placeDetailResponse.gen";
import type { ReviewCardResponse } from "@/api/gen/_model/reviewCardResponse.gen";
import type { ReviewCardReview } from "@/shared/components/ReviewCard/ReviewCard";

export interface CurationChip {
  id: string;
  label: string;
}

function toReview(review: ReviewCardResponse): ReviewCardReview {
  return {
    id: review.reviewId,
    authorNickname: review.author.nickname,
    authorProfileImageUrl: review.author.profileImageUrl ?? null,
    rating: review.rating,
    distanceMeters: review.distanceMeters ?? null,
    photoUrls: review.photos
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((photo) => photo.url),
    pros: review.aiSummary?.pros ?? null,
    cons: review.aiSummary?.cons ?? null,
    content: review.content,
    tags: review.tags.map((tag) => ({ id: tag.tagId, label: tag.label })),
    place: {
      id: review.place.placeId,
      name: review.place.name,
      regionName: review.place.regionName,
      isFavorite: review.place.isFavorite,
    },
  };
}

export function toNearbyReviews(page: CursorPageReviewCardResponse): ReviewCardReview[] {
  return page.items.map(toReview);
}

export function toCurationChips(response: ItemsResponseCurationTagResponse): CurationChip[] {
  return response.items.map((tag) => ({ id: tag.curationTagId, label: tag.label }));
}

export interface NearbyPin {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  reviewCount: number;
}

export interface NearbyPins {
  pins: NearbyPin[];
  /** 상한(30개)에 걸려 잘렸는지. 화면이 확대 안내를 띄운다 (명세 §2-3). */
  truncated: boolean;
}

export function toNearbyPins(response: NearbyPlacesResponse): NearbyPins {
  return {
    pins: response.items.map((pin) => ({
      id: pin.placeId,
      name: pin.name,
      latitude: pin.latitude,
      longitude: pin.longitude,
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
