"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { SearchIcon } from "@/shared/ui/icons";
import { SearchField, TextField } from "@/shared/ui/TextField";
import { AddressSearchSheet } from "../_components/AddressSearchSheet";
import { StoreSearchSheet } from "../_components/StoreSearchSheet";
import { REVIEW_FLOW_BASE_PATH } from "../_constants/steps";
import type { AddressSearchResult, StoreSearchResult } from "../_model/store";
import { useReviewDraft } from "../_stores/ReviewDraftProvider";
import { isReviewStoreComplete } from "../_utils/reviewStore";

export default function StoreStepPage() {
  const router = useRouter();
  const { store, setStore } = useReviewDraft();

  const [storeSheetOpen, setStoreSheetOpen] = useState(false);
  const [storeQuery, setStoreQuery] = useState("");
  const [addressSheetOpen, setAddressSheetOpen] = useState(false);
  const [addressQuery, setAddressQuery] = useState("");

  // 검색 API는 아직 도입 전이다(architecture rule: 부분 도입 금지).
  // 결과를 주입받는 자리만 남겨두고, 지금은 항상 "결과 0건 → 직접 입력" 경로로 흐른다.
  const storeResults: readonly StoreSearchResult[] = [];
  const addressResults: readonly AddressSearchResult[] = [];

  // 직접 입력 경로에서만 주소를 따로 고른다. 검색으로 고른 매장은 주소가 함께 온다.
  const needsAddressInput = store !== null && store.id === null;

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
        <header className="flex flex-col items-start gap-ds-12">
          <h1 className="text-heading-lg text-content-primary">
            방문한 매장,
            <br />
            어디였나요?
          </h1>
          <Badge size="md">필수</Badge>
        </header>

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
            onChange={() => undefined}
            onClick={() => setAddressSheetOpen(true)}
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
        results={storeResults}
        onSelectResult={handleSelectResult}
        onDirectInput={handleDirectInput}
      />

      <AddressSearchSheet
        open={addressSheetOpen}
        onOpenChange={setAddressSheetOpen}
        query={addressQuery}
        onQueryChange={setAddressQuery}
        results={addressResults}
        onSelectResult={handleSelectAddress}
      />
    </>
  );
}
