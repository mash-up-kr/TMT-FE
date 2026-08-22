"use client";

import { BottomSheet } from "@/shared/ui/BottomSheet";
import { IconButton } from "@/shared/ui/IconButton";
import { CancelIcon } from "@/shared/ui/Icons";
import { SearchField } from "@/shared/ui/TextField";
import type { SearchStatus } from "../../_model/search";
import type { StoreSearchResult } from "../../_model/store";
import {
  DirectInputOption,
  SearchOptionList,
  SearchOptionRow,
  SearchResultArea,
} from "./SearchOptions";

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
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      height="fixed"
      title="매장 검색"
      right={
        <IconButton aria-label="매장 검색 닫기" onClick={() => onOpenChange(false)}>
          <CancelIcon thick />
        </IconButton>
      }
    >
      <div className="flex flex-col gap-ds-12">
        <SearchField
          value={query}
          onValueChange={onQueryChange}
          placeholder="매장명을 검색해보세요"
          aria-label="매장 검색어"
          autoFocus
        />

        <SearchResultArea status={status}>
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
        </SearchResultArea>
      </div>
    </BottomSheet>
  );
}
