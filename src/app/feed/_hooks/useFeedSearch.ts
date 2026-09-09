import { useSearchParams } from "next/navigation";
import { useSearchQuery } from "@/shared/hooks/useSearchQuery";

export function useFeedSearch() {
  const search = useSearchQuery();
  const searchParams = useSearchParams();

  function selectCuration(id: string | null) {
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("curation", id);
    else url.searchParams.delete("curation");
    window.history.replaceState(null, "", url);
  }

  function changeSearch(value: string) {
    search.changeSearch(value);
    // 검색어를 모두 지우면 큐레이션도 해제하고 초기 피드로 돌아간다.
    if (value === "") selectCuration(null);
  }

  return {
    ...search,
    curationTagId: searchParams.get("curation"),
    changeSearch,
    selectCuration,
  };
}
