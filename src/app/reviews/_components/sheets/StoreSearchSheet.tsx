"use client";

import type { SearchStatus } from "../../_model/search";
import type { StoreSearchResult } from "../../_model/store";
import { DirectInputOption, SearchOptionList, SearchOptionRow } from "./SearchOptions";
import { SearchSheet } from "./SearchSheet";

type StoreSearchSheetProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onValueChange: (value: string) => void;
  status: SearchStatus;
  results: readonly StoreSearchResult[];
  onSelectResult: (result: StoreSearchResult) => void;
  onDirectInput: (name: string) => void;
}>;

export function StoreSearchSheet({
  open,
  onOpenChange,
  value,
  onValueChange,
  status,
  results,
  onSelectResult,
  onDirectInput,
}: StoreSearchSheetProps) {
  const trimmedQuery = value.trim();

  return (
    <SearchSheet
      open={open}
      onOpenChange={onOpenChange}
      title="매장 검색"
      placeholder="매장명을 검색해보세요"
      searchLabel="매장 검색어"
      value={value}
      onValueChange={onValueChange}
      status={status}
      persistent={
        trimmedQuery.length > 0 && (
          <SearchOptionList>
            <DirectInputOption query={trimmedQuery} onSelect={() => onDirectInput(trimmedQuery)} />
          </SearchOptionList>
        )
      }
    >
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
