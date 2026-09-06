import { defineTransformer } from "orval";

/**
 * OpenAPI 태그를 영문으로 바꾼다.
 *
 * `mode: "tags-split"`은 태그를 그대로 폴더·파일명으로 쓴다. 백엔드 태그가 한글이라
 * 호출부 import가 백엔드 문자열에 직접 묶이고, 태그가 바뀌면 전부 깨진다.
 */

/**
 * 키는 `(mock)` 같은 단계 표기를 뗀 형태다. mock이 끝나도 매핑이 계속 걸린다.
 * 값은 orval이 폴더·파일명에 그대로 쓰므로 kebab-case로 둔다.
 */
const TAG_RENAMES: Record<string, string> = {
  그룹: "group",
  "그룹 태그": "group-tag",
  "그룹 가입·리뷰 공유": "group-membership",
  "근처 탐색": "nearby",
  "가게 상세": "place-detail",
  매장: "place",
  "매장 검색": "place",
  "주소 검색": "address",
  "리뷰 작성": "review-write",
  "리뷰 상세": "review-detail",
  "저장·리뷰 작성": "save",
  "마이페이지·타인 프로필": "profile",
  "매장 추천": "recommendation",
  미디어: "media",
  큐레이션: "curation",
  홈: "home",
};

/** `그룹 (mock)` → `그룹` */
const stripStage = (tag: string) => tag.replace(/\s*\((?:mock|dev|temp)\)\s*$/i, "").trim();

const renameTag = (tag: string) => TAG_RENAMES[stripStage(tag)] ?? tag;

/** openapi-types의 Document는 index signature 기반이라 필요한 부분만 좁혀 다룬다. */
type SpecSubset = {
  tags?: { name: string }[];
  paths?: Record<string, Record<string, { tags?: string[] } | undefined> | undefined>;
};

export default defineTransformer((spec) => {
  const raw = spec as unknown as SpecSubset;

  // 선언부와 operation 양쪽을 함께 바꾼다. 한쪽만 바꾸면 폴더가 갈린다.
  for (const tag of raw.tags ?? []) {
    tag.name = renameTag(tag.name);
  }

  for (const methods of Object.values(raw.paths ?? {})) {
    for (const operation of Object.values(methods ?? {})) {
      if (operation?.tags) {
        operation.tags = operation.tags.map(renameTag);
      }
    }
  }

  return spec;
});
