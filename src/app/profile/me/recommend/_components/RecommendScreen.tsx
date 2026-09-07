"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRecommendPlace } from "@/api/gen/recommendation/recommendation.gen";
import { ScreenLayout } from "@/shared/components/ScreenLayout";
import { placeDetailPath, ROUTES } from "@/shared/constants/routes";
import { useReviewEntryPath } from "@/shared/hooks/useReviewEntryPath";
import { Button } from "@/shared/ui/Button";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { CancelIcon, ChevronLeftIcon } from "@/shared/ui/Icons";
import { RetryNotice } from "@/shared/ui/RetryNotice";
import { toast } from "@/shared/ui/Toast";
import { LAYOUT, SCREEN_BACKGROUND } from "../_constants/appearance";
import { HEADINGS } from "../_constants/headings";
import { BALL_DROP } from "../_constants/motion";
import {
  PEPPER_LEFT_DELAY,
  PEPPER_RIGHT_DELAY,
  type RecommendPhase,
  useCookSequence,
} from "../_hooks/useCookSequence";
import { useHeadingRotation } from "../_hooks/useHeadingRotation";
import { useRecommendEntrance } from "../_hooks/useRecommendEntrance";
import { useReviewedStores } from "../_hooks/useReviewedStores";
import { MIN_PICKED, useStorePot } from "../_hooks/useStorePot";
import type { RecommendResult as RecommendResultModel, RecommendStore } from "../_model/recommend";
import { toRecommendResult } from "../_utils/recommendMapper";
import { DroppingBall } from "./DroppingBall";
import { LoadingCaption } from "./LoadingCaption";
import { PepperShaker } from "./PepperShaker";
import { PotIllustration } from "./PotIllustration";
import { RecommendResult } from "./RecommendResult";
import { StirringLadle } from "./StirringLadle";
import { StoreGrid } from "./StoreGrid";

/** 담은 직후에는 순환의 다음 문구로 넘어간다. 매번 같은 문구면 담을 때마다 같은 말을 반복한다. */
const nextHeading = (current: number) => (current + 1) % HEADINGS.length;

/**
 * 로딩 화면의 최소 체류 시간. 응답이 더 빨리 와도 이만큼은 머문다.
 * 글자 웨이브 한 바퀴가 쉬는 시간까지 3.0초라, 한 바퀴는 온전히 보이게 잡는다.
 */
const LOADING_MS = 3400;

export function RecommendScreen() {
  const router = useRouter();
  const reviewEntryPath = useReviewEntryPath();
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
  const reviewed = useReviewedStores();

  const [phase, setPhase] = useState<RecommendPhase>("picking");
  /** 로딩 화면에 최소 시간만큼 머물렀는지. 응답이 먼저 와도 이게 켜져야 결과로 간다. */
  const [hasLingered, setHasLingered] = useState(false);
  const recommend = useRecommendPlace();
  const result: RecommendResultModel | null = recommend.data
    ? toRecommendResult(recommend.data)
    : null;
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

  const isPicking = phase === "picking";
  const showsGrid = isPicking || phase === "cooking";
  const canRecommend = isPicking && picked.length >= MIN_PICKED;
  /**
   * 담기 화면의 제목·냄비·버튼은 요리까지만 자리를 지킨다.
   *
   * 투명해졌다고 자리까지 비는 게 아니다. 로딩에서도 남겨두면 문구가 세 번째 자식이 되어
   * space-between에 밀려 바닥에 깔린다. 냄비는 요리 끝에서 이미 투명해지므로 지워도
   * 보이는 변화가 없다.
   */
  const showsPot = phase === "picking" || phase === "cooking";

  const header = (
    <GNB
      className="shrink-0 bg-transparent"
      title={null}
      align="left"
      left={
        <IconButton aria-label="뒤로 가기" onClick={() => router.back()}>
          <ChevronLeftIcon size={28} />
        </IconButton>
      }
      right={
        <IconButton aria-label="닫기" onClick={() => router.push(ROUTES.PROFILE.ME_REVIEWS)}>
          <CancelIcon size={28} />
        </IconButton>
      }
    />
  );

  return (
    <ScreenLayout header={header} style={{ backgroundImage: SCREEN_BACKGROUND }}>
      {/* 연출의 스코프이자 바닥 버튼까지 품는 틀. 버튼도 요리할 때 함께 사라진다. */}
      <div ref={body} className="flex min-h-full flex-col">
        <div
          // flex-1(basis 0)을 주면 내용이 길어도 늘어나지 않아 잘린다. 바닥은 min-h-full로만 깐다.
          // 어느 단계든 내용은 남은 높이의 가운데에 선다. 간격은 시안 실측값을 그대로 쓴다.
          className="content-container flex flex-1 flex-col items-center justify-center"
          style={{ paddingTop: LAYOUT.edgeInset, paddingBottom: LAYOUT.edgeInset }}
        >
          {showsPot ? (
            <>
              {/*
          문구는 대기 중 번갈아 바뀐다. 세 문구 모두 시안 프레임 폭 안에서 한 줄이라
          nowrap으로 고정해 교체할 때 높이가 흔들리지 않게 한다.
        */}
              <p
                ref={heading}
                data-entrance="title"
                data-cook-fade
                className="whitespace-nowrap text-center text-heading-md text-content-primary"
              >
                {HEADINGS[headingIndex]}
              </p>

              <div className="flex flex-col items-center" style={{ marginTop: LAYOUT.titleToPot }}>
                <PotIllustration
                  size={LAYOUT.potSize}
                  behind={
                    <>
                      {falling.map((ball) => (
                        <DroppingBall
                          key={ball.id}
                          thumbnailUrl={ball.thumbnailUrl}
                          category={ball.category}
                          onSettle={() => settleBall(ball.id)}
                        />
                      ))}
                      {stirId > 0 ? <StirringLadle key={stirId} onDone={handleStirDone} /> : null}
                    </>
                  }
                  above={
                    phase === "cooking" ? (
                      <>
                        <PepperShaker side="right" delay={PEPPER_RIGHT_DELAY} />
                        <PepperShaker side="left" delay={PEPPER_LEFT_DELAY} />
                      </>
                    ) : null
                  }
                />
              </div>
            </>
          ) : null}

          {phase === "loading" ? <LoadingCaption /> : null}

          {phase === "result" && result ? (
            <RecommendResult
              result={result}
              onOpenDetail={() => router.push(placeDetailPath(result.placeId))}
            />
          ) : null}

          {showsGrid ? (
            <div data-cook-fade className="w-full" style={{ marginTop: LAYOUT.potToGrid }}>
              {/*
              불러오는 동안은 빈 판을 그대로 둔다. 판이 사라졌다 돌아오면 진입 연출이 끊긴다.
              실패는 화면에 남아 다시 시도한다 — 추천 실패와 달리 아직 아무 연출도 시작하지 않았다.
            */}
              {reviewed.isError ? (
                <RetryNotice
                  message="리뷰한 매장을 불러오지 못했어요"
                  onRetry={() => void reviewed.refetch()}
                />
              ) : (
                <StoreGrid
                  stores={reviewed.stores}
                  picked={picked}
                  onToggle={handleToggle}
                  onCreateReview={() => router.push(reviewEntryPath)}
                />
              )}
            </div>
          ) : null}
        </div>

        {/* 버튼은 덩이에서 빠져 화면 바닥에 선다. 2곳을 담기 전에는 비활성이라 토스트가 없다. */}
        {showsPot ? (
          <div className="content-container shrink-0 pt-ds-12 pb-ds-32">
            <Button
              data-entrance="button"
              data-cook-fade
              variant="secondary"
              className="w-full"
              disabled={!canRecommend}
              onClick={handleRecommend}
            >
              매장 추천받기
            </Button>
          </div>
        ) : null}
      </div>
    </ScreenLayout>
  );
}
