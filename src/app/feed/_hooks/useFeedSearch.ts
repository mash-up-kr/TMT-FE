import { useSearchParams } from "next/navigation";
import { useSearchQuery } from "@/shared/hooks/useSearchQuery";

export function useFeedSearch() {
  const search = useSearchQuery({ clearOnChange: ["curation"] });
  const searchParams = useSearchParams();

  function selectCuration(id: string | null) {
    search.clearSearch(id ? { curation: id } : {});
  }

  return {
    ...search,
    // URL 반영이 늦어져도 입력을 시작한 순간부터 칩 조건을 함께 보내지 않는다.
    curationTagId: search.value || search.query ? null : searchParams.get("curation"),
    selectCuration,
  };
}
