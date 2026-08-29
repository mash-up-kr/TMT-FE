"use client";

import { useEffect } from "react";
import { initAmplitude } from "@/shared/utils/amplitude";

/** Amplitude를 최초 렌더 이후 한 번 초기화한다. 화면을 그리지 않는다. */
export function AmplitudeAnalytics() {
  useEffect(() => {
    void initAmplitude();
  }, []);

  return null;
}
