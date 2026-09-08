"use client";

import { Chip } from "@/shared/ui/Chip";
import { cn } from "@/shared/utils/cn";
import { useCurationChips } from "../_hooks/useCurationChips";

type FeedCurationChipsProps = {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  className?: string;
};

export function FeedCurationChips({ selectedId, onSelect, className }: FeedCurationChipsProps) {
  const { data: chips } = useCurationChips();

  if (!chips || chips.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap gap-ds-8", className)}>
      {chips.map((chip) => (
        <Chip
          key={chip.id}
          size="lg"
          selected={chip.id === selectedId}
          onClick={() => onSelect(chip.id === selectedId ? null : chip.id)}
        >
          {chip.label}
        </Chip>
      ))}
    </div>
  );
}
