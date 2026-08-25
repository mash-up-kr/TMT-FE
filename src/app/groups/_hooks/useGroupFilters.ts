"use client";

import { useState } from "react";
import { DEFAULT_SORT, type GroupSort } from "../_constants/filters";

export type GroupFilters = {
  keyword: string;
  sort: GroupSort;
  /** 명세상 카테고리는 단일 선택이다. */
  categoryId: string | null;
  /** 명세상 지역은 복수 선택이다. */
  regionTagIds: string[];
};

const INITIAL: GroupFilters = {
  keyword: "",
  sort: DEFAULT_SORT,
  categoryId: null,
  regionTagIds: [],
};

/** 검색어·필터를 한곳에 모은다. 목록 쿼리가 이 값 전부를 파라미터로 쓴다. */
export function useGroupFilters() {
  const [filters, setFilters] = useState<GroupFilters>(INITIAL);

  const setKeyword = (keyword: string) => setFilters((prev) => ({ ...prev, keyword }));
  const setSort = (sort: GroupSort) => setFilters((prev) => ({ ...prev, sort }));
  const setCategory = (categoryId: string | null) =>
    setFilters((prev) => ({ ...prev, categoryId }));
  const setRegions = (regionTagIds: string[]) => setFilters((prev) => ({ ...prev, regionTagIds }));

  return { filters, setKeyword, setSort, setCategory, setRegions };
}
