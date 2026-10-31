"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRecommendPlace } from "@/api/gen/recommendation/recommendation.gen";
import { toast } from "@/shared/ui/Toast";
import { HEADINGS } from "../_constants/headings";
import { BALL_DROP } from "../_constants/motion";
import type { RecommendResult, RecommendStore } from "../_model/recommend";
import { toRecommendResult } from "../_utils/recommendMapper";
import { type RecommendPhase, useCookSequence } from "./useCookSequence";
import { useHeadingRotation } from "./useHeadingRotation";
import { useRecommendEntrance } from "./useRecommendEntrance";
import { MIN_PICKED, useStorePot } from "./useStorePot";

/** 담은 직후에는 순환의 다음 문구로 넘어간다. 매번 같은 문구면 담을 때마다 같은 말을 반복한다. */
const nextHeading = (current: number) => (current + 1) % HEADINGS.length;

/**
 * 로딩 화면의 최소 체류 시간. 응답이 더 빨리 와도 이만큼은 머문다.
 * 글자 웨이브 한 바퀴가 쉬는 시간까지 3.0초라, 한 바퀴는 온전히 보이게 잡는다.
 */
const LOADING_MS = 3400;

/** 담기 연출과 추천 요청을 조율해 결과 화면까지 진행한다. */
export function useRecommendFlow() {
  const router = useRouter();
  const body = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLParagraphElement>(null);

  const { stopIdle, startIdle } = useRecommendEntrance(body);
  const {
    index: headingIndex,
    hide,
    stop: stopHeading,
    announce,
  } = useHeadingRotation(heading, HEADINGS.length);
  const { picked, falling, toggle, settleBall } = useStorePot();

  const [phase, setPhase] = useState<RecommendPhase>("picking");
  /** 로딩 화면에 최소 시간만큼 머물렀는지. 응답이 먼저 와도 이게 켜져야 결과로 간다. */
  const [hasLingered, setHasLingered] = useState(false);
  const recommend = useRecommendPlace();
  const result: RecommendResult | null = recommend.data ? toRecommendResult(recommend.data) : null;
  /** 0이면 국자가 없다. 값이 바뀔 때마다 새로 마운트돼 한 바퀴 젓는다. */
  const [stirId, setStirId] = useState(0);
  const wasFalling = useRef(0);
  /**
   * 지금 떨어지고 있는 공의 수.
   *
   * GSAP의 onComplete는 타임라인을 만든 시점의 클로저를 붙잡는다. 그래서 국자가 끝났을 때
   * 최신 상태를 보려면 ref로 읽어야 한다. 상태를 그대로 쓰면 마운트 당시 값에 갇힌다.
   */
  const inFlight = useRef(0);
  /** 지금 단계. onComplete 콜백이 최신 값을 보려면 ref여야 한다. */
  const phaseRef = useRef<RecommendPhase>("picking");

  useEffect(() => {
    inFlight.current = falling.length;
  }, [falling.length]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const toLoading = useCallback(() => setPhase("loading"), []);
  const cook = useCookSequence(body, toLoading);

  // 로딩에 들어오면 최소 체류 시간을 재기 시작한다.
  useEffect(() => {
    if (phase !== "loading") {
      return;
    }

    const timer = setTimeout(() => setHasLingered(true), LOADING_MS);

    return () => clearTimeout(timer);
  }, [phase]);

  // 응답과 최소 체류가 둘 다 끝나야 결과로 넘어간다. 빨라도 연출이 안 끊기고 늦어도 빈 결과를 안 그린다.
  useEffect(() => {
    if (phase === "loading" && hasLingered && recommend.isSuccess) {
      setPhase("result");
    }
  }, [phase, hasLingered, recommend.isSuccess]);

  // 실패하면 담기 화면으로 되돌릴 수 없다 — 요리 연출이 이미 그 화면을 지웠다. 이전 화면으로 나간다.
  useEffect(() => {
    if (recommend.isError) {
      toast.error("추천을 받지 못했어요. 다시 시도해 주세요.");
      router.back();
    }
  }, [recommend.isError, router]);

  const handleToggle = useCallback(
    (store: RecommendStore) => {
      if (toggle(store)) {
        // 제목은 여기서 비우고, 국자가 다 사라진 뒤에 다시 채운다.
        hide();
        // 공과 국자가 냄비 위에서 움직이는 동안 냄비까지 흔들리면 볼 곳이 셋이 된다.
        stopIdle();
      }
    },
    [toggle, hide, stopIdle],
  );

  /**
   * 다 젓고 나면 제목을 채우고 냄비를 다시 흔든다.
   *
   * 새로 담은 공이 떨어지는 중이거나 이미 담기 단계를 떠났으면 이 젓기는 지난 차례다.
   * 그대로 두면 방금 멈춘 냄비가 뒤늦게 다시 흔들리고 제목도 되살아난다 — 젓는 중에 새로
   * 담거나 `매장 추천받기`를 누르면 그랬다.
   */
  const handleStirDone = useCallback(() => {
    if (inFlight.current > 0 || phaseRef.current !== "picking") {
      return;
    }

    announce(nextHeading, BALL_DROP.headingRest);
    startIdle();
  }, [announce, startIdle]);

  /**
   * 떨어지던 공이 모두 들어가면 국자가 나온다.
   *
   * 공 하나하나에 붙이지 않고 "다 들어갔을 때"를 신호로 삼는다. 연달아 담아 여러 개가 같이
   * 떨어져도 국자는 마지막 하나가 들어간 뒤 한 번만 젓는다.
   */
  useEffect(() => {
    // 이미 담기 단계를 떠났으면 새로 젓지 않는다.
    if (wasFalling.current > 0 && falling.length === 0 && phaseRef.current === "picking") {
      setStirId((current) => current + 1);
    }

    wasFalling.current = falling.length;
  }, [falling.length]);

  const handleRecommend = useCallback(() => {
    // 버튼이 이미 막고 있다. 연출을 시작해 놓고 요청이 거절당하는 경우를 없애려는 잠금이다.
    if (picked.length < MIN_PICKED) {
      return;
    }

    // 냄비만 남기고 화면을 비운다. 이 뒤로는 담기 조작을 받지 않는다.
    //
    // 멈추는 것으로는 모자란다. 제목에 예약이 남아 있으면 요리하는 도중에 뒤늦게 되살아난다.
    // 담기 단계로 돌아올 일이 없으므로 여기서 아예 죽인다. 사라지는 연출은 cook이 맡는다.
    // 요청은 연출과 함께 출발한다. 연출이 끝날 때쯤이면 응답도 와 있다.
    recommend.mutate({ data: { placeIds: [...picked] } });

    stopHeading();
    stopIdle();
    setPhase("cooking");
    cook.run();
  }, [picked, stopHeading, stopIdle, cook, recommend]);

  return {
    body,
    heading,
    headingIndex,
    picked,
    falling,
    settleBall,
    phase,
    result,
    stirId,
    handleToggle,
    handleStirDone,
    handleRecommend,
  };
}
