"use client";

import { useRouter } from "next/navigation";
import { type KeyboardEvent, useState } from "react";
import { useSearchAddresses } from "@/api/gen/address/address.gen";
import { useSearchPlaces } from "@/api/gen/place/place.gen";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { SearchIcon } from "@/shared/ui/Icons";
import { SearchField, TextField } from "@/shared/ui/TextField";
import { StepHeader } from "../_components/StepHeader";
import { AddressSearchSheet } from "../_components/sheets/AddressSearchSheet";
import { StoreSearchSheet } from "../_components/sheets/StoreSearchSheet";
import { REVIEW_FLOW_BASE_PATH } from "../_constants/steps";
import type { SearchStatus } from "../_model/search";
import type { StoreSearchResult } from "../_model/store";
import { useReviewDraft } from "../_stores/ReviewDraftProvider";
import { mapAddressSearchResults, mapStoreSearchResults } from "../_utils/reviewApiMappers";
import { isReviewStoreComplete } from "../_utils/reviewStore";

const configuredMockUserId = Number(process.env.NEXT_PUBLIC_MOCK_USER_ID);
const mockUserId =
  Number.isSafeInteger(configuredMockUserId) && configuredMockUserId > 0 ? configuredMockUserId : 1;

function getSearchStatus(query: string, isFetching: boolean, isError: boolean): SearchStatus {
  if (query.length === 0) {
    return "idle";
  }

  if (isError) {
    return "error";
  }

  return isFetching ? "loading" : "ready";
}

export default function StoreStepPage() {
  const router = useRouter();
  const { store, setStore } = useReviewDraft();

  const [storeSheetOpen, setStoreSheetOpen] = useState(false);
  const [storeQuery, setStoreQuery] = useState("");
  const [addressSheetOpen, setAddressSheetOpen] = useState(false);
  const [addressQuery, setAddressQuery] = useState("");

  const trimmedStoreQuery = storeQuery.trim();
  const trimmedAddressQuery = addressQuery.trim();
  const storeSearch = useSearchPlaces(
    { query: trimmedStoreQuery },
    { query: { enabled: storeSheetOpen && trimmedStoreQuery.length > 0 } },
  );
  const addressSearch = useSearchAddresses(
    { userId: mockUserId, query: trimmedAddressQuery },
    { query: { enabled: addressSheetOpen && trimmedAddressQuery.length > 0 } },
  );
  const storeResults = mapStoreSearchResults(storeSearch.data?.items);
  const addressResults = mapAddressSearchResults(addressSearch.data?.items);
  const storeStatus = getSearchStatus(
    trimmedStoreQuery,
    storeSearch.isFetching,
    storeSearch.isError,
  );
  const addressStatus = getSearchStatus(
    trimmedAddressQuery,
    addressSearch.isFetching,
    addressSearch.isError,
  );

  // 직접 입력 경로에서만 주소를 따로 고른다. 검색으로 고른 매장은 주소가 함께 온다.
  const needsAddressInput = store !== null && store.id === null;

  const openAddressSheet = () => setAddressSheetOpen(true);

  // 읽기 전용 필드라 타이핑 대신 시트를 연다. 포인터 경로와 키보드 경로를 맞춘다.
  const handleAddressFieldKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openAddressSheet();
    }
  };

  const handleSelectResult = (result: StoreSearchResult) => {
    setStore({ id: result.id, name: result.name, address: result.address });
    setStoreSheetOpen(false);
  };

  const handleDirectInput = (name: string) => {
    setStore({ id: null, name, address: null });
    setStoreSheetOpen(false);
  };

  const handleSelectAddress = (address: string) => {
    setStore(store === null ? null : { ...store, address });
    setAddressSheetOpen(false);
  };

  return (
    <>
      <div className="content-container flex flex-1 flex-col gap-ds-24 pt-ds-24">
        <StepHeader
          required
          title={
            <>
              방문한 매장,
              <br />
              어디였나요?
            </>
          }
        />

        <SearchField
          value={store?.name ?? ""}
          onValueChange={() => setStore(null)}
          onSearch={() => setStoreSheetOpen(true)}
          onClick={() => setStoreSheetOpen(true)}
          placeholder="매장명을 검색해보세요"
          aria-label="방문 매장"
          readOnly
          className="cursor-pointer"
        />

        {needsAddressInput && (
          <TextField
            label="주소"
            value={store.address ?? ""}
            onClick={openAddressSheet}
            onKeyDown={handleAddressFieldKeyDown}
            placeholder="건물, 지번, 도로명을 입력해 주세요"
            trailing={<SearchIcon />}
            readOnly
            className="cursor-pointer"
          />
        )}
      </div>

      <div className="content-container pt-ds-12 pb-ds-32">
        <ButtonStack>
          <Button
            disabled={!isReviewStoreComplete(store)}
            onClick={() => router.push(`${REVIEW_FLOW_BASE_PATH}/photos`)}
          >
            다음
          </Button>
        </ButtonStack>
      </div>

      <StoreSearchSheet
        open={storeSheetOpen}
        onOpenChange={setStoreSheetOpen}
        query={storeQuery}
        onQueryChange={setStoreQuery}
        status={storeStatus}
        results={storeResults}
        onSelectResult={handleSelectResult}
        onDirectInput={handleDirectInput}
      />

      <AddressSearchSheet
        open={addressSheetOpen}
        onOpenChange={setAddressSheetOpen}
        query={addressQuery}
        onQueryChange={setAddressQuery}
        status={addressStatus}
        results={addressResults}
        onSelectResult={handleSelectAddress}
      />
    </>
  );
}
