"use client";

import { BottomSheet } from "@/shared/ui/BottomSheet";
import { IconButton } from "@/shared/ui/IconButton";
import { CancelIcon } from "@/shared/ui/Icons";
import { SearchField } from "@/shared/ui/TextField";
import type { SearchStatus } from "../../_model/search";
import type { AddressSearchResult } from "../../_model/store";
import {
  AddressOptionRow,
  SearchOptionList,
  SearchOptionMessage,
  SearchResultArea,
} from "./SearchOptions";

const EMPTY_MESSAGE = "검색 결과가 없어요. 다른 검색어로 찾아보세요";

const GUIDE_TITLE = "이렇게 검색해 보세요";

const GUIDE_EXAMPLES = [
  "도로명 + 건물번호 (위례성대로 2)",
  "건물명 + 번지 (방이동 44-2)",
  "건물명, 아파트명 (반포 자이, 분당 주공 1차)",
];

function AddressSearchGuide() {
  return (
    <div className="flex flex-col gap-ds-4">
      <p className="text-body-md-bold text-content-secondary">{GUIDE_TITLE}</p>
      <ul className="list-disc ps-ds-16 text-body-md-regular text-content-tertiary">
        {GUIDE_EXAMPLES.map((example) => (
          <li key={example}>{example}</li>
        ))}
      </ul>
    </div>
  );
}

type AddressSearchSheetProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
  onQueryChange: (query: string) => void;
  status: SearchStatus;
  results: readonly AddressSearchResult[];
  onSelectResult: (address: string) => void;
}>;

export function AddressSearchSheet({
  open,
  onOpenChange,
  query,
  onQueryChange,
  status,
  results,
  onSelectResult,
}: AddressSearchSheetProps) {
  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      height="fixed"
      title="주소 검색"
      right={
        <IconButton aria-label="주소 검색 닫기" onClick={() => onOpenChange(false)}>
          <CancelIcon thick />
        </IconButton>
      }
    >
      <div className="flex flex-col gap-ds-12">
        <SearchField
          value={query}
          onValueChange={onQueryChange}
          placeholder="건물, 지번, 도로명을 입력해 주세요"
          aria-label="주소 검색어"
          autoFocus
        />

        <SearchResultArea status={status} idle={<AddressSearchGuide />}>
          {results.length === 0 ? (
            <SearchOptionMessage>{EMPTY_MESSAGE}</SearchOptionMessage>
          ) : (
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
        </SearchResultArea>
      </div>
    </BottomSheet>
  );
}
