export interface HomeGroup {
  id: string;
  name: string;
  imageUrl: string | null;
}

export interface HomeRecommendedGroup extends HomeGroup {
  description: string;
  memberCount: number;
  reviewCount: number;
  placeCount: number;
  matchedCount: number;
}

export interface HomeSummary {
  nickname: string;
  myGroups: HomeGroup[];
  recommendedGroups: HomeRecommendedGroup[];
}

export interface FeedReviewTag {
  id: string;
  label: string;
}

export interface FeedReviewPlace {
  id: string;
  name: string;
  regionName: string;
}

export interface FeedReview {
  id: string;
  authorNickname: string;
  authorProfileImageUrl: string | null;
  rating: number;
  distanceMeters: number | null;
  photoUrls: string[];
  pros: string | null;
  cons: string | null;
  content: string;
  tags: FeedReviewTag[];
  place: FeedReviewPlace;
}
