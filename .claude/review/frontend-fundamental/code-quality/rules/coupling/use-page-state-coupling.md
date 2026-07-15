---
id: coupling/use-page-state-coupling
title: 책임을 하나씩 관리하기
ruleType: bad_good
category: 결합도
source: https://frontend-fundamentals.com/code-quality/code/examples/use-page-state-coupling.html
---

# 책임을 하나씩 관리하기

- 기준 경로: FF › 결합도 › 책임을 하나씩 관리하기
- 원문: https://frontend-fundamentals.com/code-quality/code/examples/use-page-state-coupling.html

## 원칙
쿼리 파라미터, 상태, API 호출과 같은 로직의 종류에 따라서 함수나 컴포넌트, Hook을 나누지 마세요. 한 번에 다루는 맥락의 종류가 많아져서 이해하기 힘들고 수정하기 어려운 코드가 돼요.

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
- 이 Hook은 "이 페이지에 필요한 모든 쿼리 매개변수를 관리하는 것"이라는 광범위한 책임을 가지고 있어요. 이로 인해 페이지 내의 컴포넌트나 다른 훅들이 이 훅에 의존하게 될 수 있으며, 코드 수정을 할 때 영향 범위가 급격히 확장될 수 있어요.
- 시간이 지나며 이 Hook은 유지 관리가 점점 어려워지고, 수정하기 힘든 코드로 발전할 수 있어요.
- INFO
- 이 Hook은 가독성 관점으로도 볼 수 있어요.

## 원본 ✅ 개선 예시
- 다음 코드와 같이 각각의 쿼리 파라미터별로 별도의 Hook을 작성할 수 있어요.
- Hook이 담당하는 책임을 분리했기 때문에, 수정에 따른 영향이 갈 범위를 좁힐 수 있어요. 그래서 Hook을 수정했을 때 예상하지 못한 영향이 생기는 것을 막을 수 있어요.

```typescript
import { useQueryParam } from "use-query-params";

export function useCardIdQueryParam() {
  const [cardId, _setCardId] = useQueryParam("cardId", NumberParam);

  const setCardId = useCallback((cardId: number) => {
    _setCardId({ cardId }, "replaceIn");
  }, []);

  return [cardId ?? undefined, setCardId] as const;
}
```

## 관찰 가능한 신호
- 하나의 hook/context/object가 서로 다른 책임의 값과 action을 함께 export함
- 호출부가 일부 값만 쓰는데 큰 상태 묶음 전체에 의존함
- 새 책임 추가로 기존 호출부의 타입이나 리렌더 영향 범위가 넓어짐

## 게시 조건
- 하나의 hook, object, context가 여러 책임을 함께 반환하거나 관리합니다.
- 사용자는 일부 값만 필요하지만 넓은 의존을 함께 가져가야 합니다.
- 책임을 나누면 작은 변경이 불필요한 호출부에 전파되지 않습니다.

## 억제 조건
- 원본 나쁜 예와 구조적으로 유사하지 않으면 억제합니다.
- 좋은 예 방향이 이 PR의 실제 맥락에 도움이 된다고 보기 어려우면 억제합니다.
- 단순 취향 또는 팀 컨벤션 충돌 가능성이 크면 summary_only 또는 suppress로 낮춥니다.
