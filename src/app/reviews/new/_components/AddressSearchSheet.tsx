"use client";

import { BottomSheet } from "@/shared/ui/BottomSheet";
import { IconButton } from "@/shared/ui/IconButton";
import { CancelIcon } from "@/shared/ui/icons";
import { SearchField } from "@/shared/ui/TextField";
import type { AddressSearchResult } from "../_model/store";
import { AddressOptionRow, SearchOptionList } from "./SearchOptions";

type AddressSearchSheetProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
  onQueryChange: (query: string) => void;
  results: readonly AddressSearchResult[];
  onSelectResult: (address: string) => void;
}>;

export function AddressSearchSheet({
  open,
  onOpenChange,
  query,
  onQueryChange,
  results,
  onSelectResult,
}: AddressSearchSheetProps) {
  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title="주소 검색"
      right={
        <IconButton aria-label="주소 검색 닫기" onClick={() => onOpenChange(false)}>
          <CancelIcon thick />
        </IconButton>
      }
    >
      <div className="flex flex-col gap-ds-12 pb-ds-20">
        <SearchField
          value={query}
          onValueChange={onQueryChange}
          placeholder="건물, 지번, 도로명을 입력해 주세요"
          aria-label="주소 검색어"
          autoFocus
        />

        {results.length > 0 && (
          <SearchOptionList>
            {results.map((result) => (
              <AddressOptionRow
                key={result.id}
                roadAddress={result.roadAddress}
                jibunAddress={result.jibunAddress}
                onSelect={() => onSelectResult(result.roadAddress)}
              />
            ))}
          </SearchOptionList>
        )}
      </div>
    </BottomSheet>
  );
}
