import LoadingThick from "./assets/loading-thick.svg?react";
import LoadingThin from "./assets/loading-thin.svg?react";
import { createIcon } from "./createIcon";

export const LoadingIcon = createIcon(LoadingThin, LoadingThick);
