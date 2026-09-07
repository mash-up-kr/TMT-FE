"use client";

import { type ReactNode, useRef } from "react";
import { CheckIcon, PlusIcon } from "@/shared/ui/Icons";
import { GRID_SURFACE } from "../_constants/appearance";
import { useCellArrival } from "../_hooks/useCellArrival";
import { MAX_PICKED } from "../_hooks/useStorePot";
import type { RecommendStore } from "../_model/recommend";
import { StoreSticker } from "./StoreSticker";

const COLUMNS = 3;
const ROWS = 3;
const STICKER_SIZE = 52;

/** 한 장에 들어가는 칸. 매장은 한 장에 최대 이만큼 나온다. */
const CELLS_PER_PAGE = COLUMNS * ROWS;

type Cell =
  | { key: string; kind: "store"; store: RecommendStore }
  | { key: string; kind: "empty" }
  | { key: string; kind: "plus" };

type Page = { key: string; cells: Cell[] };

/**
 * 매장과 `매장 추가`를 한 줄로 세운 뒤 3×3 판으로 끊는다. 판 높이는 매장 수와 무관하게 3행이다.
 *
 * `매장 추가`는 **마지막 매장 바로 다음 칸**이다. 판 끝에 고정해 두면 매장 세 곳만 있는 장에서
 * 목록과 입구 사이가 다섯 칸이나 비어 둘이 한 줄기로 읽히지 않는다. 한 장이 매장 아홉 곳으로
 * 꽉 차면 입구는 다음 장으로 넘어간다 — 매장을 밀어내면서까지 자리를 차지하지는 않는다.
 *
 * 매장이 없어도 한 장은 남는다. 판이 통째로 사라지면 `매장 추가`로 가는 입구까지 없어진다.
 */
function buildPages(stores: readonly RecommendStore[]): Page[] {
  const items: Cell[] = stores.map((store) => ({
    key: `store-${store.placeId}`,
    kind: "store",
    store,
  }));

  items.push({ key: "plus", kind: "plus" });

  const pageCount = Math.ceil(items.length / CELLS_PER_PAGE);

  return Array.from({ length: pageCount }, (_, page) => {
    const offset = page * CELLS_PER_PAGE;
    const cells = items.slice(offset, offset + CELLS_PER_PAGE);

    for (let slot = cells.length; slot < CELLS_PER_PAGE; slot += 1) {
      cells.push({ key: `empty-${page}-${slot}`, kind: "empty" });
    }

    return { key: `page-${page}`, cells };
  });
}

type StoreGridProps = Readonly<{
  stores: readonly RecommendStore[];
  /** 냄비에 담긴 매장의 placeId. */
  picked: readonly string[];
  onToggle: (store: RecommendStore) => void;
  onCreateReview: () => void;
}>;

export function StoreGrid({ stores, picked, onToggle, onCreateReview }: StoreGridProps) {
  const board = useRef<HTMLDivElement>(null);
  const pages = buildPages(stores);

  useCellArrival(board, stores.length);

  return (
    <div className="flex w-full flex-col items-end gap-ds-8">
      <PickedCounter picked={picked.length} />
      <div
        ref={board}
        style={{ backgroundColor: GRID_SURFACE }}
        className="scrollbar-hidden flex w-full snap-x snap-mandatory gap-ds-40 overflow-x-auto scroll-px-ds-20 rounded-ds-lg p-ds-20"
      >
        {pages.map((page, index) => (
          <ul key={page.key} className="grid w-full shrink-0 snap-start grid-cols-3 gap-ds-16">
            {page.cells.map((cell) => {
              if (cell.kind === "store") {
                return (
                  <StoreCell
                    key={cell.key}
                    store={cell.store}
                    picked={picked.includes(cell.store.placeId)}
                    onToggle={onToggle}
                    // 연출은 첫 장만 잡는다. 나머지는 화면 밖이라, 함께 걸면 보이지도 않는 칸까지
                    // stagger가 이어져 첫 장이 늦게 완성된다.
                    animation={{ entrance: index === 0, arrival: index === 0 }}
                  />
                );
              }

              if (cell.kind === "plus") {
                return (
                  <PlusCell
                    key={cell.key}
                    onClick={onCreateReview}
                    // 도착 연출에서는 빠진다. 첫 렌더부터 있던 칸이라 진입 연출이 이미 소유한다.
                    animation={{ entrance: index === 0, arrival: false }}
                  />
                );
              }

              return <EmptyCell key={cell.key} />;
            })}
          </ul>
        ))}
      </div>
    </div>
  );
}

/**
 * 냄비에 몇 곳을 담았는지. 담을 수 있는 최대치를 함께 보여 준다.
 *
 * 판이 여러 장이 되면 담은 매장이 다른 장으로 넘어가 화면에서 사라진다. 그때도 지금까지 몇 곳을
 * 골랐는지 한 자리에서 읽히게 하려는 것이다. 5곳을 채우면 더 담을 수 없다는 것도 여기서 읽힌다.
 */
function PickedCounter({ picked }: { picked: number }) {
  return (
    <p
      // 담을 때마다 숫자만 바뀌고 포커스는 그대로다. 값이 바뀐 것을 소리로도 알리려면 live 영역이어야 한다.
      role="status"
      aria-label={`${MAX_PICKED}곳 중 ${picked}곳 담음`}
      className="flex items-center gap-ds-2 rounded-ds-full bg-surface-inverse-weak px-ds-8 py-ds-2 text-body-sm-medium text-content-interactive-inverse"
    >
      <span>{picked}</span>
      <span>/</span>
      <span>{MAX_PICKED}</span>
    </p>
  );
}

/**
 * 칸 하나의 폭. 시안 360 프레임의 열 너비(320 판 − 좌우 20 − 간격 32, 3등분 ≈ 82)다.
 *
 * 앱 프레임은 430까지 넓어지는데 열을 그대로 늘리면 이름이 한 줄에 다 들어가, 시안에서 두 줄로
 * 접히던 매장이 화면 폭에 따라 다르게 보인다. 폭을 묶어 두면 어디서나 같은 자리에서 접힌다.
 */
const cellStyles = "mx-auto flex w-full max-w-[82px] flex-col items-center gap-ds-4";

/*
 * 행 높이는 내용이 정한다. 시안(Figma 2762:62981)의 행 피치가 92인데, 이는 칸 높이 76에
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
  animation: CellAnimation;
}>;

function StoreCell({ store, picked, onToggle, animation }: StoreCellProps) {
  return (
    <li className="min-h-[76px]">
      <button
        type="button"
        aria-pressed={picked}
        onClick={() => onToggle(store)}
        className={cellStyles}
      >
        <CellCircle animation={animation}>
          {/* 사진은 원을 꽉 채워야 하므로 잘라내는 층을 따로 둔다. 담긴 표시는 원 밖으로
              튀어나오는 뱃지라 이 층 밖에 있어야 잘리지 않는다. */}
          <span className="absolute inset-0 overflow-hidden rounded-ds-full">
            <StoreSticker
              thumbnailUrl={store.thumbnailUrl}
              category={store.category}
              size={STICKER_SIZE}
            />
          </span>
          {picked ? <PickedBadge /> : null}
        </CellCircle>
        <CellLabel animation={animation}>{store.name}</CellLabel>
      </button>
    </li>
  );
}

/** 담긴 표시. 색만으로 상태를 전달하지 않도록 아이콘을 함께 둔다. */
function PickedBadge() {
  return (
    <span className="absolute top-0 right-0 flex size-[16px] items-center justify-center rounded-ds-full bg-surface-interactive-primary text-content-interactive-inverse">
      <CheckIcon size={10} />
    </span>
  );
}

/**
 * 아직 매장이 없는 칸. 자리만 잡고 아무것도 그리지 않는다.
 *
 * 자리를 비워두는 것과 자리를 없애는 것은 다르다. 칸이 사라지면 `매장 추가`가 마지막 매장
 * 옆으로 따라붙어 판이 매장 수에 따라 다른 모양이 되고, 판 높이도 3행 아래로 내려간다.
 */
function EmptyCell() {
  return <li aria-hidden="true" className="min-h-[76px]" />;
}

function PlusCell({ onClick, animation }: { onClick: () => void; animation: CellAnimation }) {
  return (
    <li className="min-h-[76px]">
      <button type="button" onClick={onClick} className={cellStyles}>
        <CellCircle animation={animation}>
          <PlusIcon size={24} className="text-icon-primary" />
        </CellCircle>
        <CellLabel animation={animation}>매장 추가</CellLabel>
      </button>
    </li>
  );
}

/**
 * 진입 연출과 도착 연출은 **대상이 겹치면 안 된다.**
 *
 * `매장 추가` 칸은 첫 렌더부터 있어서 진입 타임라인이 잡는다. 뒤늦게 도착하는 매장 칸과 함께
 * 도착 연출에도 넣으면, 진입 트윈이 아직 라벨을 감추고 있는 사이에 도착 트윈이 그 감춰진 값을
 * 자기 종료값으로 기억한다 — 0에서 0으로 흐르며 라벨이 영영 안 보인다.
 */
type CellAnimation = Readonly<{ entrance: boolean; arrival: boolean }>;

function CellCircle({ animation, children }: { animation: CellAnimation; children: ReactNode }) {
  return (
    <span
      data-entrance={animation.entrance ? "cell-pop" : undefined}
      data-arrival={animation.arrival ? "cell" : undefined}
      className="relative flex size-[52px] shrink-0 items-center justify-center rounded-ds-full bg-surface-primary"
    >
      {children}
    </span>
  );
}

/*
 * shrink-0이 없으면 둘째 줄이 세로로 눌려 잘린다. line-clamp가 overflow:hidden을 걸어
 * flex 자식의 min-height:auto가 0으로 풀리기 때문이다. 한 줄 칸은 52 + 4 + 20 = 76이고
 * 두 줄이면 96이 되어야 하는데, 막지 않으면 76에 맞춰 눌린다.
 */
function CellLabel({ animation, children }: { animation: CellAnimation; children: ReactNode }) {
  return (
    <p
      data-entrance={animation.entrance ? "cell-label" : undefined}
      data-arrival={animation.arrival ? "label" : undefined}
      className="line-clamp-2 w-full shrink-0 break-words text-center text-body-md-medium text-content-primary"
    >
      {children}
    </p>
  );
}
