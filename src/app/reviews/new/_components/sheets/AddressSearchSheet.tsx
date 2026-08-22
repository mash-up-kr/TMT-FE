"use client";

import type { SearchStatus } from "../../_model/search";
import type { AddressSearchResult } from "../../_model/store";
import { AddressOptionRow, SearchOptionList, SearchOptionMessage } from "./SearchOptions";
import { SearchSheet } from "./SearchSheet";

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
  value: string;
  onValueChange: (value: string) => void;
  status: SearchStatus;
  results: readonly AddressSearchResult[];
  onSelectResult: (address: AddressSearchResult) => void;
}>;

export function AddressSearchSheet({
  open,
  onOpenChange,
  value,
  onValueChange,
  status,
  results,
  onSelectResult,
}: AddressSearchSheetProps) {
  return (
    <SearchSheet
      open={open}
      onOpenChange={onOpenChange}
      title="주소 검색"
      placeholder="건물, 지번, 도로명을 입력해 주세요"
      searchLabel="주소 검색어"
      value={value}
      onValueChange={onValueChange}
      status={status}
      idle={<AddressSearchGuide />}
    >
      {results.length === 0 ? (
        <SearchOptionMessage>{EMPTY_MESSAGE}</SearchOptionMessage>
      ) : (
        <SearchOptionList>
          {results.map((result) => (
            <AddressOptionRow
              key={result.addressId}
              roadAddress={result.roadAddress}
              jibunAddress={result.jibunAddress}
              onSelect={() => onSelectResult(result)}
            />
          ))}
        </SearchOptionList>
      )}
    </SearchSheet>
  );
}
