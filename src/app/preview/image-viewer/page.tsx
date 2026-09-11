"use client";

/**
 * 사진 뷰어 확인용 프리뷰. 실제 화면은 인증이 필요해 사진 묶음을 가진 공용 컴포넌트만 모았다.
 * 마지막 사진은 없는 주소라 fallback으로 그려진다 — 썸네일과 뷰어가 같은 대체 이미지를 쓰는지 본다.
 */

import { type ReactNode, useState } from "react";
import dummy from "@/shared/assets/dummy.png";
import dummyImage from "@/shared/assets/dummy-image.png";
import dummyProfile from "@/shared/assets/dummy-profile.png";
import { PlaceSummary } from "@/shared/components/PlaceSummary/PlaceSummary";
import {
  type ReviewDetail,
  ReviewDetailSheet,
} from "@/shared/components/ReviewDetailSheet/ReviewDetailSheet";
import { Button } from "@/shared/ui/Button";
import { ImageCarousel } from "@/shared/ui/ImageCarousel";

const MISSING_PHOTO_URL =
  "https://ttalkkak-tmt-media.s3.ap-northeast-2.amazonaws.com/preview/missing-photo.jpg";
const PHOTO_URLS = [dummy.src, dummyProfile.src, MISSING_PHOTO_URL];

const REVIEW_DETAIL: ReviewDetail = {
  placeName: "또맛또 식당",
  address: "서울 성동구 왕십리로 1",
  categoryName: "한식",
  rating: 4.5,
  tags: [],
  photos: PHOTO_URLS.map((url, index) => ({ id: `photo-${index}`, url })),
  pros: "국물이 진해요",
  cons: null,
  content: "사진을 눌러 뷰어가 시트 위로 뜨는지 확인한다.",
};

export default function ImageViewerPreview() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <main className="flex min-h-full flex-col gap-ds-24 overflow-y-auto bg-surface-primary py-ds-24">
      <PreviewSection title="캐러셀 3장 (리뷰 카드·그룹 커버)">
        <ImageCarousel
          imageUrls={PHOTO_URLS}
          fallbackSrc={dummyImage}
          label="리뷰 사진"
          width={430}
          height={360}
          className="h-[360px] w-full bg-surface-tertiary"
        />
      </PreviewSection>

      <PreviewSection title="캐러셀 1장">
        <ImageCarousel
          imageUrls={[dummy.src]}
          fallbackSrc={dummyImage}
          label="그룹 대표 이미지"
          width={430}
          height={140}
          className="h-[140px] w-full bg-surface-secondary"
        />
      </PreviewSection>

      <PreviewSection title="가게 요약 사진 스트립">
        <PlaceSummary
          place={{
            photoUrls: PHOTO_URLS,
            roadAddress: "서울 성동구 왕십리로 1",
            phoneNumber: null,
          }}
        />
      </PreviewSection>

      <PreviewSection title="리뷰 상세 시트 위에서 열기">
        <div className="px-ds-20">
          <Button className="w-full" onClick={() => setSheetOpen(true)}>
            리뷰 상세 시트 열기
          </Button>
        </div>
      </PreviewSection>

      <ReviewDetailSheet open={sheetOpen} onOpenChange={setSheetOpen} detail={REVIEW_DETAIL} />
    </main>
  );
}

function PreviewSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-ds-8">
      <h2 className="px-ds-20 text-body-lg-bold text-content-primary">{title}</h2>
      {children}
    </section>
  );
}
