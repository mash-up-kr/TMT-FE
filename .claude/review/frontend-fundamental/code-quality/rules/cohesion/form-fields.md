---
id: cohesion/form-fields
title: 폼의 응집도 생각하기
ruleType: tradeoff
category: 응집도
source: https://frontend-fundamentals.com/code-quality/code/examples/form-fields.html
---

# 폼의 응집도 생각하기

- 기준 경로: FF › 응집도 › 폼의 응집도 생각하기
- 원문: https://frontend-fundamentals.com/code-quality/code/examples/form-fields.html

## 원칙
프론트엔드 개발을 하다 보면 Form으로 사용자에게 값을 입력받아야 하는 경우가 많아요. Form을 관리할 때는 2가지의 방법으로 응집도를 관리해서, 함께 수정되어야 할 코드가 함께 수정되도록 할 수 있어요.
필드 단위 응집은 개별 입력 요소를 독립적으로 관리하는 방식이에요. 각 필드가 고유의 검증 로직을 가지므로 변경이 필요한 범위가 줄어들어 특정 필드의 유지보수가 쉬워져요. 필드 단위의 응집도를 고려하여 설계하면, 각 필드의 검증 로직이 독립적이어서 다른 필드에 영향을 주지 않아요.
폼 전체 응집은 모든 필드의 검증 로직이 폼에 종속되는 방식이에요. 폼 전체에서의 흐름을 고려하여 설계되며, 변경 단위가 폼 단위로 발생할 때 고려해요.

## 원본 코드 예시 — 필드 단위 응집도
- 각 필드가 고유의 검증 로직을 가지고, 변경 단위도 필드별로 분리되는 경우에 어울리는 구조예요.

```tsx
import { useForm } from "react-hook-form";

export function Form() {
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm({
    defaultValues: {
      name: "",
      email: ""
    }
  });

  const onSubmit = handleSubmit((formData) => {
    // 폼 데이터 제출 로직
    console.log("Form submitted:", formData);
  });

  return (
    <form onSubmit={onSubmit}>
      <div>
        <input
          {...register("name", {
            validate: (value) =>
              isEmptyStringOrNil(value) ? "이름을 입력해주세요." : ""
          })}
          placeholder="이름"
        />
        {errors.name && <p>{errors.name.message}</p>}
      </div>

      <div>
        <input
          {...register("email", {
            validate: (value) => {
              if (isEmptyStringOrNil(value)) {
                return "이메일을 입력해주세요.";
              }

              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "유효한 이메일 주소를 입력해주세요.";
              }

              return "";
            }
          })}
          placeholder="이메일"
        />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <button type="submit">제출</button>
    </form>
  );
}

function isNil(value: unknown): value is null | undefined {
  return value == null;
}

type NullableString = string | null | undefined;

function isEmptyStringOrNil(value: NullableString): boolean {
  return isNil(value) || value.trim() === "";
}
```

## 원본 코드 예시 — 폼 전체 단위 응집도
- 필드 간 의존이 있거나 폼 전체 흐름을 하나의 단위로 검증해야 하는 경우에 어울리는 구조예요.

```tsx
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("유효한 이메일 주소를 입력해주세요.")
});

export function Form() {
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm({
    defaultValues: {
      name: "",
      email: ""
    },
    resolver: zodResolver(schema)
  });

  const onSubmit = handleSubmit((formData) => {
    // 폼 데이터 제출 로직
    console.log("Form submitted:", formData);
  });

  return (
    <form onSubmit={onSubmit}>
      <div>
        <input {...register("name")} placeholder="이름" />
        {errors.name && <p>{errors.name.message}</p>}
      </div>

      <div>
        <input {...register("email")} placeholder="이메일" />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <button type="submit">제출</button>
    </form>
  );
}
```

## 상황별 선택 기준
- 필드 단위 응집은 개별 입력 요소를 독립적으로 관리하는 방식이에요. 각 필드가 고유의 검증 로직을 가지므로 변경이 필요한 범위가 줄어들어 특정 필드의 유지보수가 쉬워져요.
- 폼 전체 응집은 모든 필드의 검증 로직이 폼에 종속되는 방식이에요. 폼 전체에서의 흐름을 고려하여 설계되며, 변경 단위가 폼 단위로 발생할 때 고려해요.
- 필드 간 의존성이 낮고 각 필드가 독립적으로 바뀐다면 필드 단위 응집도를 선택해요.
- 필드 간 의존성이 크거나 하나의 schema로 함께 검증해야 한다면 폼 전체 단위 응집도를 선택해요.

## 관찰 가능한 신호
- 필드 간 교차 검증이나 의존 조건이 있는데 validation이 필드마다 분산됨
- 서로 독립적인 필드인데 모든 validation이 하나의 schema/form 로직에 강하게 묶임
- 필드 추가/삭제 변경 단위와 validation 배치 단위가 어긋남

## 게시 조건
- 필드 간 의존성이나 변경 단위가 diff 안에서 확인됩니다.
- 현재 구조가 그 변경 단위와 반대로 묶이거나 흩어져 있습니다.
- 필드 단위 응집도와 폼 전체 단위 응집도 중 어느 쪽이 더 맞는지 근거를 코드에서 제시할 수 있습니다.

## 억제 조건
- 필드 간 의존성이 약하면 폼 전체 schema 강제 지적을 억제합니다.
- 필드 간 의존성이 강하면 필드 단위 분리 강제 지적을 억제합니다.
- 두 구조 모두 타당한 선택지이므로, 확실한 맥락 증거가 없으면 publish보다 summary_only 또는 suppress로 낮춥니다.
- 단순 취향 또는 팀 컨벤션 충돌 가능성이 크면 summary_only 또는 suppress로 낮춥니다.
