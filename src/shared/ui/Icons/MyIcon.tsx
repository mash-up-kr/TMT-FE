import MySvg from "./assets/my.svg?react";
import MyFillSvg from "./assets/my-fill.svg?react";
import { createFilledIcon } from "./createIcon";

export const MyIcon = createFilledIcon(MySvg, MyFillSvg);
