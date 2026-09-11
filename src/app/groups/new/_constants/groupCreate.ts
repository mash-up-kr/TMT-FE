import type { GroupCreateStep } from "../_model/groupCreate";

export const GROUP_CREATE_STEPS = [
  "basicInfo",
  "tags",
  "image",
  "description",
  "reviews",
] as const satisfies readonly GroupCreateStep[];
