import { SearchField } from "@/shared/ui/TextField";

type GroupSearchBarProps = {
  value: string;
  onValueChange: (value: string) => void;
};

export function GroupSearchBar({ value, onValueChange }: GroupSearchBarProps) {
  return (
    <SearchField
      aria-label="그룹 검색"
      placeholder="장소나 태그로 검색해보세요"
      value={value}
      onValueChange={onValueChange}
    />
  );
}
