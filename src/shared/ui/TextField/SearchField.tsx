"use client";

import { type ChangeEvent, type KeyboardEvent, type Ref, useCallback, useRef } from "react";
import { CancelIcon, SearchIcon } from "@/shared/ui/icons";
import { cn } from "@/shared/utils/cn";
import { TextField, type TextFieldProps } from "./TextField";

/** controlled 전용 — 지우기가 값을 써야 해서 `value` + `onValueChange`가 필수다. */
export type SearchFieldProps = Omit<
  TextFieldProps,
  "trailing" | "type" | "value" | "defaultValue" | "onChange"
> &
  Readonly<{
    value: string;
    onValueChange: (value: string) => void;
    onSearch?: () => void;
  }>;

function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

/**
 * `<form>` 안에서는 Enter가 native submit과 겹친다. `onSearch` 대신 form의 `onSubmit`을 쓴다.
 */
export function SearchField({
  ref,
  size = "lg",
  disabled = false,
  value,
  onValueChange,
  onSearch,
  className,
  onKeyDown,
  ...rest
}: SearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      setRef(ref, node);
    },
    [ref],
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onValueChange(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // 한글 조합 중의 Enter는 글자 확정이므로 검색으로 보지 않는다.
    if (event.key === "Enter" && !event.nativeEvent.isComposing) {
      onSearch?.();
    }

    onKeyDown?.(event);
  };

  const handleClear = () => {
    onValueChange("");
    // 포커스를 남겨두지 않으면 사용자가 다시 탭해야 하고 스크린리더는 위치를 잃는다.
    inputRef.current?.focus();
  };

  const iconSize = size === "lg" ? 24 : 20;
  const showClear = value.length > 0 && !disabled;

  const iconButtonClass = cn(
    // 음수 마진으로 레이아웃은 유지하고 터치 영역만 넓힌다.
    "-m-ds-8 flex items-center justify-center rounded-ds-full p-ds-8",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-interactive-primary",
    "disabled:pointer-events-none",
  );

  return (
    <TextField
      ref={handleRef}
      type="search"
      enterKeyHint="search"
      size={size}
      disabled={disabled}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      trailing={
        <button
          type="button"
          onClick={showClear ? handleClear : onSearch}
          disabled={disabled}
          aria-label={showClear ? "검색어 지우기" : "검색"}
          className={iconButtonClass}
        >
          {showClear ? <CancelIcon size={iconSize} /> : <SearchIcon size={iconSize} />}
        </button>
      }
      className={cn("[&::-webkit-search-cancel-button]:appearance-none", className)}
      {...rest}
    />
  );
}
