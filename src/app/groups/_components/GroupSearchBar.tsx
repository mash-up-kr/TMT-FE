import type { ChangeEvent, CompositionEventHandler } from "react";
import { TextField } from "@/shared/ui/TextField";

type GroupSearchBarProps = {
  value: string;
  onValueChange: (value: string) => void;
  onCompositionStart: CompositionEventHandler<HTMLInputElement>;
  onCompositionEnd: CompositionEventHandler<HTMLInputElement>;
};

/** 그룹 검색은 별도 제출 버튼 없이 입력에 따라 목록을 갱신한다. */
export function GroupSearchBar({
  value,
  onValueChange,
  onCompositionStart,
  onCompositionEnd,
}: GroupSearchBarProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onValueChange(event.target.value);
  };

  return (
    <TextField
      aria-label="그룹 검색"
      placeholder="장소나 태그로 검색해보세요"
      value={value}
      onChange={handleChange}
      onCompositionStart={onCompositionStart}
      onCompositionEnd={onCompositionEnd}
      // 기존 그룹 검색창의 안내 문구 농도를 유지한다.
      className="placeholder:opacity-100"
    />
  );
}
