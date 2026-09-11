/**
 * 큐레이션 칩 임시 값 (TMT-412).
 *
 * 정본 계약: API 명세 v2 — B. 근처 탐색 §2-4 `GET /v1/curation-tags`
 * https://ttalkkak.atlassian.net/wiki/spaces/ttalkkak/pages/57016328
 *
 * 칩 값은 프론트가 정하지 않는다. TMT-422로 칩이 서버 테이블(`curation_tag`)이 되어, 값 변경은
 * 배포가 아니라 운영 데이터 입력이다. 이 파일은 그 입력을 기다리는 동안 새 칩 5종을 화면에
 * 띄우기 위한 자리다.
 *
 * `curationTagId`는 서버가 칩에 매달린 매장 목록(`curation_tag_place`)을 찾는 키다. 아래 id는
 * **제안값**이고 서버가 확정 전이라, 모르는 id로 조회하면 검색·핀이 빈 결과(HTTP 200)로
 * 돌아온다. 즉 칩은 보이지만 결과는 비어 있는 것이 지금의 정상 상태다.
 *
 * 삭제 조건: 서버가 이 5종을 내려주기 시작하면 이 파일과 `useCurationChips`의 두 옵션을 지운다.
 */

import type { ItemsResponseCurationTagResponse } from "@/api/gen/_model/itemsResponseCurationTagResponse.gen";

export const CURATION_TAGS_FIXTURE: ItemsResponseCurationTagResponse = {
  items: [
    // 기존 `curation_euljiro_yajang`에서 지역을 뗀 이름이라, 조건을 넓힐지 그대로 쓸지 서버 판단이 남았다.
    { curationTagId: "curation_yajang", label: "야장" },
    // 라벨이 기존과 같아 id를 그대로 재사용한다 — 이 칩만 지금도 실제 결과가 나온다.
    { curationTagId: "curation_ganmaek", label: "간맥집" },
    { curationTagId: "curation_pizza_seolgi", label: "피자설기" },
    { curationTagId: "curation_fruit_sando", label: "과일산도" },
    { curationTagId: "curation_bakery_tour", label: "빵지순례" },
  ],
};
