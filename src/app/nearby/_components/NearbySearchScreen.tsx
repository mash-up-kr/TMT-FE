"use client";

import { useRouter } from "next/navigation";
import { type KeyboardEvent, useRef, useState } from "react";
import { TMTLogoHomeLink } from "@/shared/components/TMTLogoHomeLink";
import { feedPathWithQuery } from "@/shared/constants/routes";
import { GNB } from "@/shared/ui/GNB";
import { SearchField } from "@/shared/ui/TextField";

/**
 * 검색 입력 화면.
 *
 * 결과 목록은 이 화면이 아니라 피드 화면이 그린다 — 검색어를 URL로 넘겨 돌아간다.
 * 라우트가 달라 상태를 공유할 수 없고, URL이면 뒤로가기·새로고침·공유가 모두 자연스럽다.
 */
export function NearbySearchScreen() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  // 한글 조합 중 누른 Enter는 글자 확정에 쓰여 검색으로 잡히지 않는다.
  // 조합이 끝나는 시점에 이어서 검색하도록 눌렀다는 사실만 기억한다.
  const submitAfterComposition = useRef(false);

  const submit = (keyword: string) => {
    const trimmed = keyword.trim();

    if (!trimmed) {
      return;
    }

    router.replace(feedPathWithQuery(trimmed));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && event.nativeEvent.isComposing) {
      submitAfterComposition.current = true;
    }
  };

  return (
    <>
      <GNB align="left" className="shrink-0" title={null} left={<TMTLogoHomeLink />} />
      <div className="flex min-h-0 flex-1 flex-col gap-ds-12 overflow-y-auto px-ds-20 py-ds-12">
        <SearchField
          autoFocus
          value={query}
          onValueChange={setQuery}
          onSearch={() => submit(query)}
          onKeyDown={handleKeyDown}
          onCompositionEnd={(event) => {
            if (!submitAfterComposition.current) {
              return;
            }

            submitAfterComposition.current = false;
            // 조합이 확정된 값은 state보다 이 이벤트가 먼저 안다.
            submit(event.currentTarget.value);
          }}
          placeholder="장소나 태그로 검색해보세요"
          aria-label="장소나 태그 검색"
        />
      </div>
    </>
  );
}
