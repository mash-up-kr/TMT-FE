import type { ChangeEvent } from "react";
import { TextField } from "@/shared/ui/TextField";

type GroupSearchBarProps = {
  value: string;
  onValueChange: (value: string) => void;
};

/** 피드의 검색 진입(NearbySearchEntry)과 같은 모양이다. 입력 즉시 목록을 거르므로 검색 아이콘은 두지 않는다. */
export function GroupSearchBar({ value, onValueChange }: GroupSearchBarProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onValueChange(event.target.value);
  };

  return (
    <TextField
      aria-label="그룹 검색"
      placeholder="장소나 태그로 검색해보세요"
      value={value}
      onChange={handleChange}
      // 피드 진입점의 안내 문구는 tertiary 원색이라 필드 기본 70% 불투명도를 걷어낸다.
      className="placeholder:opacity-100"
    />
  );
}
