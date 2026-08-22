"use client";

import Image from "next/image";
import type { SearchStatus } from "../../_model/search";
import type { AddressSearchResult } from "../../_model/store";
import emptyResultMascot from "../assets/address-search-empty-mascot.png";
import { AddressOptionRow, SearchOptionList } from "./SearchOptions";
import { SearchSheet } from "./SearchSheet";

const EMPTY_TITLE = "검색결과가 없어요";

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

function AddressSearchEmptyState() {
  return (
    <div className="flex flex-col items-center gap-ds-12 py-ds-32">
      <div className="relative h-[130px] w-[172px] shrink-0">
        <Image src={emptyResultMascot} alt="" fill className="object-contain" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-[77.308%] to-surface-primary to-[92.806%]"
        />
      </div>
      <div className="flex flex-col items-center gap-ds-4 text-center">
        <p className="text-heading-sm text-content-primary">{EMPTY_TITLE}</p>
        <p className="text-body-md-medium text-content-tertiary">
          도로명, 지번, 건물명, 아파트명으로
          <br />
          다시 검색해주세요
        </p>
      </div>
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
        <AddressSearchEmptyState />
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
