import { useSearchParams } from "next/navigation";
import { useSearchQuery } from "@/shared/hooks/useSearchQuery";

export function useFeedSearch() {
  const search = useSearchQuery({ clearOnEmpty: ["curation"] });
  const searchParams = useSearchParams();

  function selectCuration(id: string | null) {
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("curation", id);
    else url.searchParams.delete("curation");
    window.history.replaceState(null, "", url);
  }

  return {
    ...search,
    curationTagId: searchParams.get("curation"),
    selectCuration,
  };
}
