import { useCurationTags } from "@/api/gen/curation/curation.gen";
import { CURATION_TAGS_FIXTURE } from "../_fixtures/curationTags";
import { type CurationChip, toCurationChips } from "../_utils/feedMapper";

/**
 * 서버가 새 칩 5종을 내려주기 전까지 임시 값을 쓴다 (TMT-412).
 *
 * 조회를 끄지 않으면 응답이 도착하는 순간 옛 칩 4개로 덮이므로 `enabled: false`를 함께 둔다.
 * 서버가 반영되면 이 두 옵션과 fixture만 지우면 원래 조회로 돌아온다.
 */
export function useCurationChips() {
  return useCurationTags<CurationChip[]>({
    query: { select: toCurationChips, initialData: CURATION_TAGS_FIXTURE, enabled: false },
  });
}
