import HeartFill from "./assets/heart-fill.svg?react";
import HeartOutline from "./assets/heart.svg?react";
import { createFilledIcon } from "./createIcon";

export const HeartIcon = createFilledIcon(HeartOutline, HeartFill);
