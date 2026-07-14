---
id: coupling/item-edit-modal
title: Props Drilling 지우기
ruleType: bad_good
category: 결합도
source: https://frontend-fundamentals.com/code-quality/code/examples/item-edit-modal.html
---

# Props Drilling 지우기

- 기준 경로: FF › 결합도 › Props Drilling 지우기
- 원문: https://frontend-fundamentals.com/code-quality/code/examples/item-edit-modal.html

## 원칙
Props Drilling은 부모 컴포넌트와 자식 컴포넌트 사이에 결합도가 생겼다는 것을 나타내는 명확한 표시예요. 만약에 Drilling되는 name prop의 이름이 firstName 으로 변경되면, 해당 prop을 참조하는 모든 컴포넌트를 수정해야 해요.

## 원본 ❌ 코드 예시
- 다음 코드는 사용자가 item 을 선택할 때 사용하는 <ItemEditModal /> 컴포넌트예요. 사용자가 키워드를 입력해서 아이템 목록을 검색하고, 찾고 있었던 아이템을 선택하면 onConfirm 이 호출돼요.
- 사용자가 입력한 키워드는 keyword , 선택할 수 있는 아이템은 items , 추천 아이템의 목록은 recommendedItems prop으로 전달돼요.

```tsx
function ItemEditModal({ open, items, recommendedItems, onConfirm, onClose }) {
  const [keyword, setKeyword] = useState("");

  // 다른 ItemEditModal 로직 ...

  return (
    <Modal open={open} onClose={onClose}>
      <ItemEditBody
        items={items}
        keyword={keyword}
        onKeywordChange={setKeyword}
        recommendedItems={recommendedItems}
        onConfirm={onConfirm}
        onClose={onClose}
      />
      {/* ... 다른 ItemEditModal 컴포넌트 ... */}
    </Modal>
  );
}

function ItemEditBody({
  keyword,
  onKeywordChange,
  items,
  recommendedItems,
  onConfirm,
  onClose
}) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Input
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
        />
        <Button onClick={onClose}>닫기</Button>
      </div>
      <ItemEditList
        keyword={keyword}
        items={items}
        recommendedItems={recommendedItems}
        onConfirm={onConfirm}
      />
    </>
  );
}

// ...
```

## 원본 코드 냄새 / 판단 근거
- 이 컴포넌트는 부모인 ItemEditModal 과 자식인 ItemEditBody , ItemEditList 등이 동일한 값인 recommendedItems , onConfirm , keyword 등을 prop으로 공유하고 있어요. 부모 컴포넌트가 prop을 그대로 자식 컴포넌트에게 넘겨주는 Props Drilling 이 발생하고 있어요.
- Props Drilling이 발생하면, prop을 불필요하게 참조하는 컴포넌트의 숫자가 많아져요. 그런데 prop이 변경되면 prop을 참조하는 모든 컴포넌트가 수정되어야 해요.
- 예를 들어, 더 이상 아이템에 대한 추천 기능이 사라져서 recommendedItems 를 삭제해야 한다면, 연관된 모든 컴포넌트에서 삭제해야 하죠. 코드 수정범위가 필요 이상으로 넓고, 결합도가 높아요.

## 원본 ✅ 개선 예시
- A. 조합(Composition) 패턴 활용
- 조합 패턴을 사용하면 부모 컴포넌트가 자식 컴포넌트에 Props를 일일이 전달해야 하는 Props Drilling 문제를 해결할 수 있어요.
- 더 나아가, 조합 패턴은 불필요한 중간 추상화를 제거하여 개발자가 각 컴포넌트의 역할과 의도를 보다 명확하게 이해할 수 있어요.
- 위의 예시처럼 children 을 사용해 필요한 컴포넌트를 부모에서 작성하도록 하면 불필요한 Props Drilling을 줄일 수 있어요.
- 하지만, 조합 패턴만으로는 해결되지 않는 경우도 있고, 컴포넌트 트리 구조가 깊어지면 여전히 문제가 발생해요. 위의 예시에서 ItemEditModal 컴포넌트는 여전히 items 와 recommendedItems 를 Props Drilling하고 있어요.
- B. ContextAPI 활용

```tsx
function ItemEditModal({ open, items, recommendedItems, onConfirm, onClose }) {
  const [keyword, setKeyword] = useState("");

  return (
    <Modal open={open} onClose={onClose}>
      <ItemEditBody
        keyword={keyword}
        onKeywordChange={setKeyword}
        onClose={onClose}
      >
        <ItemEditList
          keyword={keyword}
          items={items}
          recommendedItems={recommendedItems}
          onConfirm={onConfirm}
        />
      </ItemEditBody>
    </Modal>
  );
}

function ItemEditBody({ children, keyword, onKeywordChange, onClose }) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Input
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
        />
        <Button onClick={onClose}>닫기</Button>
      </div>
      {children}
    </>
  );
}
```

```tsx
function ItemEditModal({ open, items, recommendedItems, onConfirm, onClose }) {
  const [keyword, setKeyword] = useState("");

  return (
    <ItemEditModalProvider value={{ items, recommendedItems }}>
      <Modal open={open} onClose={onClose}>
        <ItemEditBody
          keyword={keyword}
          onKeywordChange={setKeyword}
          onClose={onClose}
        >
          <ItemEditList keyword={keyword} onConfirm={onConfirm} />
        </ItemEditBody>
      </Modal>
    </ItemEditModalProvider>
  );
}

function ItemEditList({ keyword, onConfirm }) {
  const { items, recommendedItems } = useItemEditModalContext();

  return (
    <ItemList
      keyword={keyword}
      items={items}
      recommendedItems={recommendedItems}
      onConfirm={onConfirm}
    />
  );
}
```

## 관찰 가능한 신호
- props가 2단계 이상 중간 컴포넌트를 거쳐 전달됨
- 중간 컴포넌트가 props를 읽지 않고 자식에게 그대로 넘김
- 상위 상태 변경이 깊은 하위 UI 계약까지 직접 알고 있음

## 게시 조건
- 상위 컴포넌트에서 받은 props가 여러 중간 컴포넌트를 거쳐 그대로 전달됩니다.
- 중간 컴포넌트가 해당 값을 직접 사용하지 않고 전달만 합니다.
- composition, context, colocated state 등으로 전달 경로를 줄이면 결합이 낮아집니다.

## 억제 조건
- 1~2단계 단순 전달이나 컴포넌트 조립상 자연스러운 전달은 억제합니다.
- context/store 도입이 더 큰 복잡도를 만들면 억제합니다.
