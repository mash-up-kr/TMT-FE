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
  /** 시트 이름. 닫기 버튼의 접근 가능한 이름도 여기서 파생한다. */
  title: string;
  placeholder: string;
  /** 검색 입력의 접근 가능한 이름. 시트 이름과 달라야 해서 따로 받는다. */
  searchLabel: string;
  value: string;
  onValueChange: (value: string) => void;
  status: SearchStatus;
  /** 검색 전에 보여줄 것. */
  idle?: ReactNode;
  /** 결과가 준비됐을 때 그릴 것. 무엇을 비었다고 볼지는 각 시트가 판정한다. */
  children: ReactNode;
}>;

/**
 * 검색 시트의 공통 껍데기.
 *
 * 시트 틀·닫기 버튼·검색 입력·상태 분기까지만 소유한다. 결과를 어떻게 그릴지, 무엇을 비었다고
 * 볼지, 검색 전에 무엇을 보여줄지는 시트마다 다르므로 플래그 prop을 받지 않고 그대로 넘겨받는다.
 */
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

        <SearchResultArea status={status} idle={idle}>
          {children}
        </SearchResultArea>
      </div>
    </BottomSheet>
  );
}
