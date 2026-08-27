export type ReviewCardData = {
  id: string;
  authorNickname: string;
  authorProfileImageUrl: string | null;
  rating: number;
  distanceMeters: number | null;
  photoUrls: string[];
  pros: string | null;
  cons: string | null;
  content: string;
  tags: { id: string; label: string }[];
  place: { id: string; name: string; regionName: string; isFavorite?: boolean };
};
