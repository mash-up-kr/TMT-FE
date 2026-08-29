"use client";

import { useEffect } from "react";
import { UT2_PARTICIPANT_TAG_KEY, UT2_TASK_TAG_KEY } from "@/shared/constants/ut2";
import { setClarityTag } from "@/shared/utils/clarity";

/**
 * ⚠️ UT2 대비 임시 코드다. `shared/utils/clarity.ts` 계열과 함께 지운다.
 *
 * 세션 단위 태그(participant·task)를 Clarity에 붙인다. 진행자가 세션 시작 시
 * `?participant=...&task=1`로 넘기는데, 그 쿼리는 첫 진입 URL에만 있고 이후 화면을
 * 옮기면 사라진다. 그래서 한 번 읽어 sessionStorage에 보관하고 매 로드마다 다시 심는다.
 *
 * `useSearchParams` 대신 `location.search`를 읽는다. 훅을 쓰면 root layout 전체에
 * Suspense 경계가 필요해지는데, 임시 계측 때문에 앱 구조를 바꿀 이유가 없다.
 */
const STORAGE_PREFIX = "ut2:";
const MAX_TAG_LENGTH = 100;

function readStored(key: string): string | null {
  try {
    return window.sessionStorage.getItem(`${STORAGE_PREFIX}${key}`);
  } catch {
    // 시크릿 모드나 저장소 차단 환경. 태그만 못 붙을 뿐 녹화는 계속된다.
    return null;
  }
}

function store(key: string, value: string): void {
  try {
    window.sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, value);
  } catch {
    // 위와 같다.
  }
}

/** 쿼리에 값이 있으면 저장하고, 없으면 이번 세션에 저장해 둔 값을 쓴다. */
function resolveTag(key: string, search: URLSearchParams): string | null {
  const fromQuery = search.get(key)?.trim();

  if (fromQuery) {
    const value = fromQuery.slice(0, MAX_TAG_LENGTH);
    store(key, value);
    return value;
  }

  return readStored(key);
}

export function Ut2Tracker() {
  useEffect(() => {
    const search = new URLSearchParams(window.location.search);

    for (const key of [UT2_PARTICIPANT_TAG_KEY, UT2_TASK_TAG_KEY]) {
      const value = resolveTag(key, search);

      if (value) {
        setClarityTag(key, value);
      }
    }
  }, []);

  return null;
}
