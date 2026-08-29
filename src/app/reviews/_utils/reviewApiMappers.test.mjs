import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { extname } from "node:path";
import test from "node:test";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(".") && extname(specifier) === "") {
      const resolved = new URL(`${specifier}.ts`, context.parentURL);
      if (existsSync(resolved)) {
        return nextResolve(resolved.href, context);
      }
    }

    return nextResolve(specifier, context);
  },
});

const mappers = await import("./reviewApiMappers.ts");

const tagConfig = {
  companionTags: [{ tagId: "companion-1", label: "친구" }],
  positivePointTags: [{ tagId: "positive-1", label: "맛있어요" }],
};

const existingPlaceDraft = {
  store: {
    id: "place-1",
    name: "또맛집",
    address: "서울시 강남구",
    selectedAddress: null,
  },
  selectedTagIds: ["companion-1", "positive-1"],
  rating: 4,
  reviewText: "다시 갈게요",
};

test("기존 매장 초안을 SaveRequest로 변환하며 태그 그룹을 보존한다", () => {
  const request = mappers.toCreateSaveRequest?.(existingPlaceDraft, tagConfig);

  assert.deepEqual(request, {
    placeId: "place-1",
    companionTagIds: ["companion-1"],
    positivePointTagIds: ["positive-1"],
    rating: 4,
    content: "다시 갈게요",
  });
});

test("직접 입력한 매장은 신규 저장에서 newPlace로 변환한다", () => {
  const request = mappers.toCreateSaveRequest?.(
    {
      ...existingPlaceDraft,
      store: {
        id: null,
        name: "새 매장",
        address: "서울시 마포구",
        selectedAddress: {
          addressId: "address-token",
          roadAddress: "서울시 마포구",
          jibunAddress: "서울시 마포구 1",
        },
      },
      selectedTagIds: [],
      rating: 0,
      reviewText: "",
    },
    tagConfig,
  );

  assert.deepEqual(request, {
    newPlace: { name: "새 매장", addressId: "address-token" },
    companionTagIds: [],
    positivePointTagIds: [],
    rating: null,
    content: null,
  });
});

test("이어쓰기 요청은 기존 placeId를 유지하고 newPlace는 보내지 않는다", () => {
  const request = mappers.toUpdateSaveRequest?.(existingPlaceDraft, tagConfig, [
    "asset-first",
    "asset-second",
  ]);

  assert.deepEqual(request, {
    placeId: "place-1",
    photoAssetIds: ["asset-first", "asset-second"],
    companionTagIds: ["companion-1"],
    positivePointTagIds: ["positive-1"],
    rating: 4,
    content: "다시 갈게요",
  });
});

test("사진이 있는 초안은 이어쓰기 목록에서 선택 불가로 표시한다", () => {
  const drafts = mappers.mapContinuableDrafts([
    {
      saveId: "photo-save",
      place: { placeId: "place-1", name: "사진 매장", roadAddress: "서울" },
      thumbnailUrl: "https://example.com/photo.png",
      updatedAt: "2026-08-29T00:00:00Z",
    },
    {
      saveId: "plain-save",
      place: { placeId: "place-2", name: "일반 매장", roadAddress: "부산" },
      thumbnailUrl: null,
      updatedAt: "2026-08-29T00:00:00Z",
    },
  ]);

  assert.deepEqual(drafts, [
    {
      saveId: "photo-save",
      placeName: "사진 매장",
      roadAddress: "서울",
      thumbnailUrl: "https://example.com/photo.png",
      canContinue: false,
    },
    {
      saveId: "plain-save",
      placeName: "일반 매장",
      roadAddress: "부산",
      thumbnailUrl: null,
      canContinue: true,
    },
  ]);
});

test("상세 응답에 사진이 있으면 이어쓰기를 허용하지 않는다", () => {
  assert.equal(mappers.isResumableSaveDetail?.({ photos: [{ photoId: "photo-1" }] }), false);
  assert.equal(mappers.isResumableSaveDetail?.({ photos: [] }), true);
});
