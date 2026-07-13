---
id: readability/context-reducing/use-page-state-readability
title: 로직 종류에 따라 합쳐진 함수 쪼개기
ruleType: bad_good
category: 가독성
subcategory: 맥락 줄이기
source: https://frontend-fundamentals.com/code-quality/code/examples/use-page-state-readability.html
---

# 로직 종류에 따라 합쳐진 함수 쪼개기

- 기준 경로: FF › 가독성 › 맥락 줄이기 › 로직 종류에 따라 합쳐진 함수 쪼개기
- 원문: https://frontend-fundamentals.com/code-quality/code/examples/use-page-state-readability.html

## 원칙
쿼리 파라미터, 상태, API 호출과 같은 로직의 종류에 따라서 함수나 컴포넌트, Hook을 만들지 마세요. 한 번에 다루는 맥락의 종류가 많아져서 이해하기 힘들고 수정하기 어려운 코드가 돼요.

## 원본 ❌ 코드 예시
- 다음 usePageState() Hook은 페이지 전체의 URL 쿼리 파라미터를 한 번에 관리해요.

```typescript
import moment, { Moment } from "moment";
import { useMemo } from "react";
import {
  ArrayParam,
  DateParam,
  NumberParam,
  useQueryParams
} from "use-query-params";

const defaultDateFrom = moment().subtract(3, "month");
const defaultDateTo = moment();

export function usePageState() {
  const [query, setQuery] = useQueryParams({
    cardId: NumberParam,
    statementId: NumberParam,
    dateFrom: DateParam,
    dateTo: DateParam,
    statusList: ArrayParam
  });

  return useMemo(
    () => ({
      values: {
        cardId: query.cardId ?? undefined,
        statementId: query.statementId ?? undefined,
        dateFrom:
          query.dateFrom == null ? defaultDateFrom : moment(query.dateFrom),
        dateTo: query.dateTo == null ? defaultDateTo : moment(query.dateTo),
        statusList: query.statusList as StatementStatusType[] | undefined
      },
      controls: {
        setCardId: (cardId: number) => setQuery({ cardId }, "replaceIn"),
        setStatementId: (statementId: number) =>
          setQuery({ statementId }, "replaceIn"),
        setDateFrom: (date?: Moment) =>
          setQuery({ dateFrom: date?.toDate() }, "replaceIn"),
        setDateTo: (date?: Moment) =>
          setQuery({ dateTo: date?.toDate() }, "replaceIn"),
        setStatusList: (statusList?: StatementStatusType[]) =>
          setQuery({ statusList }, "replaceIn")
      }
    }),
    [query, setQuery]
  );
}
```

## 원본 코드 냄새 / 판단 근거
- 이 Hook이 가지고 있는 책임이 "페이지가 필요로 하는 모든 쿼리 파라미터를 관리하는 것" 임을 고려했을 때, 이 Hook이 담당할 책임이 무제한적으로 늘어날 가능성이 있어요. 새로운 쿼리 파라미터가 추가되면, 무의식적으로 이 Hook이 관리하게 되죠.
- 점점 Hook이 담당하고 있는 영역이 넓어지면서, 구현이 길어지고, 어떤 역할을 하는 Hook인지 파악하기 힘들어져요.
- 성능
- 이 Hook을 쓰는 컴포넌트는, 이 Hook이 관리하는 어떤 쿼리 파라미터가 수정되더라도 리렌더링이 발생해요. 예를 들어서, 한 컴포넌트에서 cardId 만 참고해도, dateFrom 이나 dateTo 가 변경되면 리렌더링되는 거죠.
- 좋은 성능을 위해서는 특정한 상태 값이 업데이트되었을 때 최소한의 부분이 리렌더링되도록 설계해야 해요.
- INFO
- 이 Hook은 결합도 관점으로도 볼 수 있어요.

## 원본 ✅ 개선 예시
- 다음 코드와 같이 각각의 쿼리 파라미터별로 별도의 Hook을 작성할 수 있어요.
- Hook이 담당하는 책임을 분리했기 때문에, 기존 usePageState() Hook보다 명확한 이름을 가져요. 또한 Hook을 수정했을 때 영향이 갈 범위를 좁혀서, 예상하지 못한 변경이 생기는 것을 막을 수 있어요.

```typescript
import { NumberParam, useQueryParam } from "use-query-params";

export function useCardIdQueryParam() {
  const [cardId, _setCardId] = useQueryParam("cardId", NumberParam);

  const setCardId = useCallback((cardId: number) => {
    _setCardId({ cardId }, "replaceIn");
  }, []);

  return [cardId ?? undefined, setCardId] as const;
}
```

## 관찰 가능한 신호
- 하나의 hook이 query param, local state, API loading/error/data를 함께 반환함
- 호출부가 한 값만 쓰는데 전체 page state 객체를 구독함
- 서로 다른 변경 이유의 상태가 같은 setter/action 묶음에 포함됨

## 게시 조건
- 하나의 hook, 함수, 컴포넌트가 query param, local state, API 상태처럼 서로 다른 종류의 로직을 함께 관리합니다.
- 호출부가 필요한 일부 상태 때문에 불필요한 상태나 동작까지 함께 알아야 합니다.
- 쪼갰을 때 각 단위의 입력과 반환값이 더 작고 명확해집니다.

## 억제 조건
- 원본 나쁜 예와 구조적으로 유사하지 않으면 억제합니다.
- 좋은 예 방향이 이 PR의 실제 맥락에 도움이 된다고 보기 어려우면 억제합니다.
- 단순 취향 또는 팀 컨벤션 충돌 가능성이 크면 summary_only 또는 suppress로 낮춥니다.
