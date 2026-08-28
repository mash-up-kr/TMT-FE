import type { ButtonHTMLAttributes } from "react";
import { IconButton } from "@/shared/ui/IconButton";
import { HeartIcon } from "@/shared/ui/Icons";
import { cn } from "@/shared/utils/cn";

type PlaceFavoriteButtonProps = Readonly<
  Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "aria-busy" | "aria-label" | "aria-pressed" | "children" | "onClick"
  > & {
    placeName: string;
    isFavorite: boolean;
    isPending?: boolean;
    onToggleAction: () => void;
    size?: number;
  }
>;

export function PlaceFavoriteButton({
  placeName,
  isFavorite,
  isPending = false,
  onToggleAction,
  size = 28,
  disabled,
  className,
  ...buttonProps
}: PlaceFavoriteButtonProps) {
  const isDisabled = disabled || isPending;

  return (
    <IconButton
      {...buttonProps}
      aria-label={`${placeName} ${isFavorite ? "좋아요 해제" : "좋아요"}`}
      aria-busy={isPending || undefined}
      aria-pressed={isFavorite}
      disabled={isDisabled}
      className={cn("shrink-0 disabled:opacity-50", className)}
      onClick={onToggleAction}
    >
      <HeartIcon
        filled={isFavorite}
        size={size}
        className={isFavorite ? "text-icon-interactive-primary" : undefined}
      />
    </IconButton>
  );
}
