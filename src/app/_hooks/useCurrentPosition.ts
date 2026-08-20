"use client";

import { useEffect, useState } from "react";

export type CurrentPosition =
  | { status: "pending" }
  | { status: "granted"; latitude: number; longitude: number }
  | { status: "unavailable" };

export function useCurrentPosition(): CurrentPosition {
  const [position, setPosition] = useState<CurrentPosition>({ status: "pending" });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setPosition({ status: "unavailable" });
      return;
    }

    let active = true;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (active) {
          setPosition({
            status: "granted",
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
        }
      },
      () => {
        if (active) {
          setPosition({ status: "unavailable" });
        }
      },
    );

    return () => {
      active = false;
    };
  }, []);

  return position;
}
