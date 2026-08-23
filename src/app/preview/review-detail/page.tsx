"use client";

/**
 * 리뷰 상세 시트 상태 확인용 임시 페이지. 팀 공유를 위해 브랜치에만 올려두고 머지 전에 삭제한다.
 *
 * 상태 전환 버튼은 프레임 밖(데스크탑 여백)에 fixed로 띄워 화면을 밀지 않는다.
 * 시트가 스와이프로 닫히므로 프레임 안에 다시 열기 버튼을 둔다.
 */

import { useState } from "react";
import type { ReviewDetail } from "@/shared/components/ReviewDetailSheet/ReviewDetailSheet";
import { ReviewDetailSheet } from "@/shared/components/ReviewDetailSheet/ReviewDetailSheet";
import { cn } from "@/shared/utils/cn";

const SWITCHER = [
  "fixed top-ds-12 left-ds-12 z-toast flex w-[168px] flex-col gap-ds-4",
  "min-[431px]:left-auto min-[431px]:right-[calc(50%_+_215px_+_var(--spacing-ds-16))]",
].join(" ");

const PHOTOS = [
  { id: "sp_1", url: "https://picsum.photos/seed/tmt-d1/720/540" },
  { id: "sp_2", url: "https://picsum.photos/seed/tmt-d2/720/540" },
  { id: "sp_3", url: "https://picsum.photos/seed/tmt-d3/720/540" },
];

/** GET /v1/reviews/review_4 실제 응답 기반. aiSummary는 mock이 null이라 시안 문구를 넣었다. */
const FULL: ReviewDetail = {
  placeName: "오즈 커피",
  address: "서울 마포구 도화동 201-1",
  categoryName: "카페·디저트",
  rating: 5,
  tags: [
    { id: "tag_friend", label: "친구" },
    { id: "tag_tasty", label: "음식이 맛있어요" },
    { id: "tag_mood", label: "분위기가 좋아요" },
    { id: "tag_clean", label: "청결하고 깔끔해요" },
  ],
  photos: PHOTOS,
  pros: "분위기가 좋아요",
  cons: "가격이 좀 나가고 웨이팅이 많을 수 있어요. 주말에는 자리 잡기가 어려워요.",
  content:
    "핸드드립이 진하고 산미가 적당해요. 창가 자리가 넓어서 오래 앉아 있기 좋았습니다.\n디저트는 스콘만 있었는데 버터 향이 좋았어요.",
};

/** GET /v1/saves/save_5 실제 응답 기반. */
const PLACE_ONLY: ReviewDetail = {
  ...FULL,
  rating: null,
  tags: [],
  photos: [],
  pros: null,
  cons: null,
  content: null,
};

type Scenario = {
  key: string;
  label: string;
  detail: ReviewDetail;
  continuable: boolean;
};

const SCENARIOS: Scenario[] = [
  { key: "full", label: "전체 (완성 리뷰)", detail: FULL, continuable: false },
  {
    key: "photo-3",
    label: "사진 3장",
    detail: { ...PLACE_ONLY, photos: PHOTOS },
    continuable: true,
  },
  {
    key: "photo-2",
    label: "사진 2장",
    detail: { ...PLACE_ONLY, photos: PHOTOS.slice(0, 2) },
    continuable: true,
  },
  {
    key: "photo-1",
    label: "사진 1장",
    detail: { ...PLACE_ONLY, photos: PHOTOS.slice(0, 1) },
    continuable: true,
  },
  {
    key: "tags",
    label: "태그있음",
    detail: { ...PLACE_ONLY, tags: FULL.tags, photos: PHOTOS },
    continuable: true,
  },
  {
    key: "rating",
    label: "별점있음",
    detail: { ...PLACE_ONLY, rating: 5, tags: FULL.tags, photos: PHOTOS },
    continuable: true,
  },
  { key: "place-only", label: "가게만 저장", detail: PLACE_ONLY, continuable: true },
  {
    key: "long",
    label: "긴 내용 (스크롤)",
    detail: {
      ...FULL,
      placeName: "이자카야 고쿄 강남 신논현점 아주 긴 이름",
      content: "긴 본문 ".repeat(120),
      tags: [
        ...FULL.tags,
        { id: "tag_value", label: "가성비가 좋아요" },
        { id: "tag_unknown", label: "매핑 없는 태그" },
      ],
    },
    continuable: false,
  },
];

export default function ReviewDetailPreview() {
  const [key, setKey] = useState(SCENARIOS[0].key);
  const [open, setOpen] = useState(true);
  const scenario = SCENARIOS.find((item) => item.key === key) ?? SCENARIOS[0];

  return (
    <>
      <main className="flex flex-1 flex-col items-center justify-center gap-ds-12 bg-surface-secondary">
        <p className="text-body-md-medium text-content-secondary">{scenario.label}</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-ds-md bg-surface-inverse px-ds-16 py-ds-8 text-body-md-bold text-content-interactive-inverse"
        >
          시트 열기
        </button>
      </main>

      <ReviewDetailSheet
        open={open}
        onOpenChange={setOpen}
        detail={scenario.detail}
        onContinueWriting={scenario.continuable ? () => {} : undefined}
      />

      <nav aria-label="프리뷰 상태" className={SWITCHER}>
        {SCENARIOS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => {
              setKey(item.key);
              setOpen(true);
            }}
            className={cn(
              "rounded-ds-xs px-ds-8 py-ds-4 text-left text-body-sm-medium",
              item.key === scenario.key
                ? "bg-surface-inverse text-content-interactive-inverse"
                : "bg-surface-primary text-content-secondary",
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </>
  );
}
