"use client";

import type { ReactNode } from "react";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { IconButton } from "@/shared/ui/IconButton";
import { CancelIcon } from "@/shared/ui/Icons";
import { SearchField } from "@/shared/ui/TextField";
import type { SearchStatus } from "../../_model/search";
import { SearchResultArea } from "./SearchOptions";

type SearchSheetProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  placeholder: string;
  searchLabel: string;
  value: string;
  onValueChange: (value: string) => void;
  status: SearchStatus;
  idle?: ReactNode;
  persistent?: ReactNode;
  children: ReactNode;
}>;

export function SearchSheet({
  open,
  onOpenChange,
  title,
  placeholder,
  searchLabel,
  value,
  onValueChange,
  status,
  idle,
  persistent,
  children,
}: SearchSheetProps) {
  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      height="fixed"
      title={title}
      right={
        <IconButton aria-label={`${title} 닫기`} onClick={() => onOpenChange(false)}>
          <CancelIcon thick />
        </IconButton>
      }
    >
      <div className="flex flex-col gap-ds-12">
        <SearchField
          value={value}
          onValueChange={onValueChange}
          placeholder={placeholder}
          aria-label={searchLabel}
          autoFocus
        />

        <SearchResultArea status={status} idle={idle} persistent={persistent}>
          {children}
        </SearchResultArea>
      </div>
    </BottomSheet>
  );
}
