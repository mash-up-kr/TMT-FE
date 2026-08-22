"use client";

import type { SearchStatus } from "../../_model/search";
import type { StoreSearchResult } from "../../_model/store";
import { DirectInputOption, SearchOptionList, SearchOptionRow } from "./SearchOptions";
import { SearchSheet } from "./SearchSheet";

type StoreSearchSheetProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
  onQueryChange: (query: string) => void;
  status: SearchStatus;
  results: readonly StoreSearchResult[];
  onSelectResult: (result: StoreSearchResult) => void;
  onDirectInput: (name: string) => void;
}>;

export function StoreSearchSheet({
  open,
  onOpenChange,
  query,
  onQueryChange,
  status,
  results,
  onSelectResult,
  onDirectInput,
}: StoreSearchSheetProps) {
  const trimmedQuery = query.trim();

  return (
    <SearchSheet
      open={open}
      onOpenChange={onOpenChange}
      title="매장 검색"
      placeholder="매장명을 검색해보세요"
      searchLabel="매장 검색어"
      query={query}
      onQueryChange={onQueryChange}
      status={status}
    >
      {/* 직접 입력 옵션이 항상 남으므로 이 시트에는 빈 상태가 없다. */}
      <SearchOptionList>
        {results.map((result) => (
          <SearchOptionRow
            key={result.id}
            primary={result.name}
            secondary={result.address}
            onSelect={() => onSelectResult(result)}
          />
        ))}
        <DirectInputOption query={trimmedQuery} onSelect={() => onDirectInput(trimmedQuery)} />
      </SearchOptionList>
    </SearchSheet>
  );
}
