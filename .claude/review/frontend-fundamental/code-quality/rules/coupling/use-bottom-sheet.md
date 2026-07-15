---
id: coupling/use-bottom-sheet
title: 중복 코드 허용하기
ruleType: tradeoff
category: 결합도
source: https://frontend-fundamentals.com/code-quality/code/examples/use-bottom-sheet.html
---

# 중복 코드 허용하기

- 기준 경로: FF › 결합도 › 중복 코드 허용하기
- 원문: https://frontend-fundamentals.com/code-quality/code/examples/use-bottom-sheet.html

## 원칙
개발자로서 여러 페이지나 컴포넌트에 걸친 중복 코드를 하나의 Hook이나 컴포넌트로 공통화하는 경우가 많아요. 중복 코드를 하나의 컴포넌트나 Hook으로 공통화하면, 좋은 코드의 특징 중 하나인 응집도를 챙겨서, 함께 수정되어야 할 코드들을 한꺼번에 수정할 수 있어요.
그렇지만, 불필요한 결합도가 생겨서, 공통 컴포넌트나 Hook을 수정함에 따라 영향을 받는 코드의 범위가 넓어져서, 오히려 수정이 어려워질 수도 있어요.
처음에는 비슷하게 동작한다고 생각해서 공통화한 코드가, 이후 페이지마다 다른 특이한 요구사항이 생겨서, 점점 복잡해질 수 있어요. 동시에 공통 코드를 수정할 때마다, 그 코드에 의존하는 코드들을 일일이 제대로 테스트해야 해서, 오히려 코드 수정이 어려워지기도 하죠.

## 원본 ❌ 코드 예시
- 아래와 같이 점검 정보를 인자로 받아서, 점검 중이라면 점검 바텀시트를 열고, 사용자가 알림 받기에 동의하면 이를 로깅하고, 현재 화면을 닫는 Hook을 살펴볼게요.
- 이 코드는 여러 페이지에서 반복적으로 사용되었기에 공통 Hook으로 분리되었어요.

```typescript
export const useOpenMaintenanceBottomSheet = () => {
  const maintenanceBottomSheet = useMaintenanceBottomSheet();
  const logger = useLogger();

  return async (maintainingInfo: TelecomMaintenanceInfo) => {
    logger.log("점검 바텀시트 열림");
    const result = await maintenanceBottomSheet.open(maintainingInfo);
    if (result) {
      logger.log("점검 바텀시트 알림받기 클릭");
    }
    closeView();
  };
};
```

## 원본 코드 냄새 / 판단 근거
- 이 Hook은 여러 페이지에서 반복적으로 보이는 로직이기에 공통화되었어요. 그렇지만 앞으로 생길 수 있는 다양한 코드 변경의 가능성을 생각해볼 수 있어요.
- 위 Hook은 이런 코드 변경사항에 유연하게 대응하기 위해서 복잡하게 인자를 받아야 할 거예요. 이 Hook의 구현을 수정할 때마다, 이 Hook을 쓰는 모든 페이지들이 잘 작동하는지 테스트도 해야 할 것이고요.

## 상황별 선택 기준
- 다소 반복되어 보이는 코드일지 몰라도, 중복 코드를 허용하는 것이 좋은 방향일 수 있어요.
- 함께 일하는 동료들과 적극적으로 소통하며 점검 바텀시트의 동작을 정확하게 이해해야 해요. 페이지에서 로깅하는 값이 같고, 점검 바텀시트의 동작이 동일하고, 바텀시트의 모양이 동일하다면, 그리고 앞으로도 그럴 예정이라면, 공통화를 통해 코드의 응집도를 높일 수 있어요.
- 그렇지만 페이지마다 동작이 달라질 여지가 있다면, 공통화 없이 중복 코드를 허용하는 것이 더 좋은 선택이에요.


## 관찰 가능한 신호
- 중복 제거를 위해 만든 공통 hook/component에 mode, option, callback 인자가 늘어남
- 페이지별로 달라질 수 있는 로깅, 닫기 동작, UI 정책이 하나의 공통 함수에 묶임
- 공통화를 유지하려고 내부 분기가 추가됨

## 게시 조건
- 중복 제거나 공통 hook/component 추가가 서로 다른 변경 이유를 하나로 묶습니다.
- 공통화된 API에 boolean 옵션, callback, mode 같은 분기 인자가 늘어나는 흐름이 보입니다.
- 페이지별 정책이 앞으로 달라질 가능성을 코드나 PR 맥락에서 확인할 수 있습니다.

## 억제 조건
- 페이지별 정책 차이가 코드나 PR 맥락에서 확인되지 않으면 억제합니다.
- 로깅 값, 닫기 동작, UI 모양, 앞으로의 변경 방향이 모두 같다는 근거가 있으면 억제합니다.
- 단순히 중복이 보인다는 이유만으로 공통화 반대를 게시하지 않습니다.
