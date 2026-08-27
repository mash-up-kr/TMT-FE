import { CheckIcon, PlusIcon } from "@/shared/ui/Icons";
import { cn } from "@/shared/utils/cn";
import { GRID_SURFACE } from "../_constants/appearance";
import type { RecommendStore } from "../_model/recommend";
import { FoodCategorySticker } from "./FoodCategorySticker";

const COLUMNS = 3;
const MIN_ROWS = 3;
const STICKER_SIZE = 52;

type Cell =
  | { key: string; kind: "store"; store: RecommendStore }
  | { key: string; kind: "empty" }
  | { key: string; kind: "plus" };

/**
 * `+` 칸은 언제나 마지막 칸이고 매장과 `+` 사이는 빈 점이 채운다.
 * 그래서 매장이 늘면 행이 늘고(9곳이면 4행), 줄어도 3행 아래로는 내려가지 않는다.
 */
function buildCells(stores: readonly RecommendStore[]): Cell[] {
  const needed = Math.ceil((stores.length + 1) / COLUMNS) * COLUMNS;
  const total = Math.max(MIN_ROWS * COLUMNS, needed);

  const cells: Cell[] = stores.map((store) => ({
    key: `store-${store.placeId}`,
    kind: "store",
    store,
  }));

  for (let slot = cells.length; slot < total - 1; slot += 1) {
    cells.push({ key: `empty-${slot}`, kind: "empty" });
  }

  cells.push({ key: "plus", kind: "plus" });

  return cells;
}

type StoreGridProps = Readonly<{
  stores: readonly RecommendStore[];
  /** 냄비에 담긴 매장의 placeId. */
  picked: readonly string[];
  onToggle: (store: RecommendStore) => void;
  onCreateReview: () => void;
}>;

export function StoreGrid({ stores, picked, onToggle, onCreateReview }: StoreGridProps) {
  return (
    <ul
      style={{ backgroundColor: GRID_SURFACE }}
      className="grid w-full grid-cols-3 gap-ds-16 rounded-ds-lg p-ds-20"
    >
      {buildCells(stores).map((cell) => {
        if (cell.kind === "store") {
          return (
            <StoreCell
              key={cell.key}
              store={cell.store}
              picked={picked.includes(cell.store.placeId)}
              onToggle={onToggle}
            />
          );
        }

        if (cell.kind === "plus") {
          return <PlusCell key={cell.key} onClick={onCreateReview} />;
        }

        return <EmptyCell key={cell.key} />;
      })}
    </ul>
  );
}

/*
 * 행 높이는 내용이 정한다. 시안(Figma 1674:61058)의 행 피치가 92인데, 이는 칸 높이 76에
 * 간격 16을 더한 값이다 — 행을 따로 고정하지 않는다는 뜻이다. 두 줄짜리 이름이 있는 행만
 * 96이 되고, 그래서 판 전체가 20 + 76 + 16 + 76 + 16 + 96 + 20 = 320이 된다.
 *
 * 칸을 정사각으로 두면 판 높이가 화면 너비를 따라 커진다. 시안 프레임은 360이고 앱 프레임은
 * 430까지 넓어져, 판이 320이 아니라 390이 되면서 세로 여유를 다 먹는다.
 */

type StoreCellProps = Readonly<{
  store: RecommendStore;
  picked: boolean;
  onToggle: (store: RecommendStore) => void;
}>;

function StoreCell({ store, picked, onToggle }: StoreCellProps) {
  return (
    <li className="min-h-[76px]">
      <button
        type="button"
        aria-pressed={picked}
        onClick={() => onToggle(store)}
        className="flex w-full flex-col items-center gap-ds-4"
      >
        <span
          data-entrance="cell-pop"
          className="relative flex size-[52px] shrink-0 items-center justify-center rounded-ds-full bg-surface-primary"
        >
          <FoodCategorySticker category={store.category} size={STICKER_SIZE} />
          {picked ? <PickedBadge /> : null}
        </span>
        {/*
          shrink-0이 없으면 둘째 줄이 세로로 눌려 잘린다. line-clamp가 overflow:hidden을 걸어
          flex 자식의 min-height:auto가 0으로 풀리기 때문이다. 한 줄 칸은 52 + 4 + 20 = 76이고
          두 줄이면 96이 되어야 하는데, 막지 않으면 76에 맞춰 눌린다.
        */}
        <p
          data-entrance="cell-label"
          className={cn(
            "line-clamp-2 shrink-0 text-center text-content-primary",
            picked ? "text-body-md-bold" : "text-body-md-medium",
          )}
        >
          {store.name}
        </p>
      </button>
    </li>
  );
}

/** 담긴 표시. 색만으로 상태를 전달하지 않도록 아이콘을 함께 둔다. */
function PickedBadge() {
  return (
    <span className="-top-0.5 -right-0.5 absolute flex size-[18px] items-center justify-center rounded-ds-full bg-surface-interactive-primary text-content-interactive-inverse">
      <CheckIcon size={12} />
    </span>
  );
}

function EmptyCell() {
  return (
    <li aria-hidden="true" className="flex min-h-[76px] items-center justify-center">
      <span data-entrance="cell-pop" className="size-[8px] rounded-ds-full bg-surface-primary" />
    </li>
  );
}

function PlusCell({ onClick }: { onClick: () => void }) {
  return (
    <li className="flex min-h-[76px] items-start justify-center">
      <button
        type="button"
        onClick={onClick}
        aria-label="리뷰 작성하기"
        data-entrance="cell-pop"
        className="flex size-[52px] items-center justify-center rounded-ds-full bg-surface-primary text-icon-primary"
      >
        <PlusIcon size={24} />
      </button>
    </li>
  );
}
