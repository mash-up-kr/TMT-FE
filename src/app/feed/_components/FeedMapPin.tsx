import { FoodCategoryIcon } from "@/shared/components/FoodCategoryIcon/FoodCategoryIcon";
import type { FeedPin } from "../_utils/feedMapper";

/** 물방울 본체. 시안 2789:38035의 Vector 크기다. */
const PIN_WIDTH = 42;
const PIN_HEIGHT = 52;
/** 비선택 핀은 24px 프레임에 들어간다 (시안 1340:28443). 같은 그림을 줄여 쓴다. */
const UNSELECTED_SCALE = 24 / PIN_HEIGHT;
/**
 * 물방울 안의 흰 원. 기본 핀은 지름 12(반지름 6)의 점이고, 선택되면 아이콘이 들어갈
 * 32까지 자란다. 중심은 물방울 viewBox 기준으로 고정이라 자라도 제자리에 머문다.
 */
const HOLE_CENTER_X = 21;
const HOLE_CENTER_Y = 21.2727;
const DEFAULT_HOLE_SIZE = 12;
const SELECTED_HOLE_SIZE = 32;
const UNSELECTED_HOLE_SCALE = DEFAULT_HOLE_SIZE / SELECTED_HOLE_SIZE;
const ICON_SIZE = 24;
const LABEL_GAP = 2;
const LABEL_HEIGHT = 18;

/**
 * 마커가 차지하는 상자와 좌표를 가리키는 지점. 선택 여부와 무관하게 고정이라
 * 핀이 커져도 좌표에서 튀지 않는다 — 크기 변화는 transform이 맡는다.
 */
export const MAP_PIN_MARKER = {
  size: { width: PIN_WIDTH, height: PIN_HEIGHT + LABEL_GAP + LABEL_HEIGHT },
  anchor: { x: PIN_WIDTH / 2, y: PIN_HEIGHT },
};

const TEARDROP_PATH =
  "M42 21.2727C42 37.8182 21 52 21 52C21 52 0 37.8182 0 21.2727C8.29927e-08 15.6308 2.21249 10.22 6.15076 6.23064C10.089 2.24123 15.4305 0 21 0C26.5695 0 31.911 2.24123 35.8492 6.23064C39.7875 10.22 42 15.6308 42 21.2727Z";

/** 라벨이 지도 위 어떤 색에도 읽히도록 흰 테두리를 두른다. */
const LABEL_STROKE = {
  WebkitTextStroke: "1px var(--color-stroke-inverse)",
  paintOrder: "stroke fill",
} as const;

const TRANSITION =
  "transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none";

type FeedMapPinProps = {
  pin: FeedPin;
  selected: boolean;
};

export function FeedMapPin({ pin, selected }: FeedMapPinProps) {
  const scale = selected ? 1 : UNSELECTED_SCALE;
  const holeScale = selected ? 1 : UNSELECTED_HOLE_SCALE;

  return (
    // 마커 상자는 선택 상태와 무관하게 고정이라, 상자 전체를 누를 수 있게 두면 줄어든 핀의
    // 빈 여백까지 눌린다. 판정은 보이는 물방울에만 준다 — scale은 히트 테스트에도 적용되므로
    // 클릭 영역이 보이는 크기를 그대로 따라간다.
    <div className="pointer-events-none flex flex-col items-center" style={{ width: PIN_WIDTH }}>
      <div
        className={`pointer-events-auto relative shrink-0 ${TRANSITION}`}
        style={{
          width: PIN_WIDTH,
          height: PIN_HEIGHT,
          transform: `scale(${scale})`,
          // 물방울 꼭지를 축으로 삼아야 커질 때 가리키는 좌표가 움직이지 않는다.
          transformOrigin: "50% 100%",
        }}
      >
        <svg
          aria-hidden="true"
          width={PIN_WIDTH}
          height={PIN_HEIGHT}
          viewBox={`0 0 ${PIN_WIDTH} ${PIN_HEIGHT}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={TEARDROP_PATH} fill="var(--color-surface-brand)" />
        </svg>

        <div
          className={`absolute flex items-center justify-center rounded-ds-full bg-surface-primary ${TRANSITION}`}
          style={{
            width: SELECTED_HOLE_SIZE,
            height: SELECTED_HOLE_SIZE,
            left: HOLE_CENTER_X - SELECTED_HOLE_SIZE / 2,
            top: HOLE_CENTER_Y - SELECTED_HOLE_SIZE / 2,
            transform: `scale(${holeScale})`,
          }}
        >
          <FoodCategoryIcon
            category={pin.category}
            size={ICON_SIZE}
            className={`${TRANSITION} ${selected ? "opacity-100" : "opacity-0"}`}
          />
        </div>
      </div>

      {/*
       * 핀은 아래 중앙을 축으로 커지고 줄어서 아래끝이 늘 좌표에 머문다. 그래서 라벨은 크기와
       * 무관하게 제자리에 두면 되고, 축소분을 따라 옮기면 핀 위로 올라가 겹친다.
       */}
      <span
        className="pointer-events-none whitespace-nowrap text-body-sm-bold text-content-primary"
        style={{ marginTop: LABEL_GAP, ...LABEL_STROKE }}
      >
        {pin.name}
      </span>
    </div>
  );
}
