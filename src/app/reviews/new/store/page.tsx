"use client";

import { useRouter } from "next/navigation";
import type { KeyboardEvent } from "react";
import { useSearchAddresses } from "@/api/gen/address/address.gen";
import { useSearchPlaces } from "@/api/gen/place/place.gen";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { SearchIcon } from "@/shared/ui/Icons";
import { SearchField, TextField } from "@/shared/ui/TextField";
import { StepHeader } from "../_components/StepHeader";
import { AddressSearchSheet } from "../_components/sheets/AddressSearchSheet";
import { StoreSearchSheet } from "../_components/sheets/StoreSearchSheet";
import { MOCK_USER_ID } from "../_constants/mockUser";
import { reviewStepPath } from "../_constants/steps";
import { useSearchSheetState } from "../_hooks/useSearchSheetState";
import type { AddressSearchResult, StoreSearchResult } from "../_model/store";
import { useReviewDraft } from "../_stores/ReviewDraftProvider";
import { useReviewFlowBase } from "../_stores/ReviewFlowBaseProvider";
import { mapAddressSearchResults, mapStoreSearchResults } from "../_utils/reviewApiMappers";
import { isReviewStoreComplete } from "../_utils/reviewStore";
import { toSearchStatus } from "../_utils/searchStatus";

/** 시트가 한 번에 보여줄 만큼. 명시하지 않으면 응답 크기를 서버 기본값에 맡기게 된다. */
const SEARCH_RESULT_LIMIT = 20;

export default function StoreStepPage() {
  const router = useRouter();
  const basePath = useReviewFlowBase();
  const { store, setStore } = useReviewDraft();

  const storeSheet = useSearchSheetState();
  const storeSearch = useSearchPlaces(
    { query: storeSheet.query, limit: SEARCH_RESULT_LIMIT },
    { query: { enabled: storeSheet.enabled } },
  );
  const storeResults = mapStoreSearchResults(storeSearch.data?.items);
  const storeStatus = toSearchStatus(storeSheet.query, storeSearch);

  const addressSheet = useSearchSheetState();
  const addressSearch = useSearchAddresses(
    { userId: MOCK_USER_ID, query: addressSheet.query, limit: SEARCH_RESULT_LIMIT },
    { query: { enabled: addressSheet.enabled } },
  );
  const addressResults = mapAddressSearchResults(addressSearch.data?.items);
  const addressStatus = toSearchStatus(addressSheet.query, addressSearch);

  const needsAddressInput = store !== null && store.id === null;

  const openAddressSheet = () => addressSheet.onOpenChange(true);

  const handleAddressFieldKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openAddressSheet();
    }
  };

  const handleSelectResult = (result: StoreSearchResult) => {
    setStore({ id: result.id, name: result.name, address: result.address, selectedAddress: null });
    storeSheet.onOpenChange(false);
  };

  const handleDirectInput = (name: string) => {
    setStore({ id: null, name, address: null, selectedAddress: null });
    storeSheet.onOpenChange(false);
  };

  const handleSelectAddress = (address: AddressSearchResult) => {
    if (store === null) {
      return;
    }

    setStore({ ...store, address: address.roadAddress, selectedAddress: address });
    addressSheet.onOpenChange(false);
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
          onSearch={() => storeSheet.onOpenChange(true)}
          onClick={() => storeSheet.onOpenChange(true)}
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
            onClick={() => router.push(reviewStepPath(basePath, "photos"))}
          >
            다음
          </Button>
        </ButtonStack>
      </div>

      <StoreSearchSheet
        open={storeSheet.open}
        onOpenChange={storeSheet.onOpenChange}
        value={storeSheet.value}
        onValueChange={storeSheet.setValue}
        status={storeStatus}
        results={storeResults}
        onSelectResult={handleSelectResult}
        onDirectInput={handleDirectInput}
      />

      <AddressSearchSheet
        open={addressSheet.open}
        onOpenChange={addressSheet.onOpenChange}
        value={addressSheet.value}
        onValueChange={addressSheet.setValue}
        status={addressStatus}
        results={addressResults}
        onSelectResult={handleSelectAddress}
      />
    </>
  );
}
