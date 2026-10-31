"use client";

import { useRouter } from "next/navigation";
import { ScreenLayout } from "@/shared/components/ScreenLayout";
import { placeDetailPath, ROUTES } from "@/shared/constants/routes";
import { useReviewEntryPath } from "@/shared/hooks/useReviewEntryPath";
import { Button } from "@/shared/ui/Button";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { CancelIcon, ChevronLeftIcon } from "@/shared/ui/Icons";
import { RetryNotice } from "@/shared/ui/RetryNotice";
import { LAYOUT, SCREEN_BACKGROUND } from "../_constants/appearance";
import { HEADINGS } from "../_constants/headings";
import { PEPPER_LEFT_DELAY, PEPPER_RIGHT_DELAY } from "../_hooks/useCookSequence";
import { useRecommendFlow } from "../_hooks/useRecommendFlow";
import { useReviewedStores } from "../_hooks/useReviewedStores";
import { MIN_PICKED } from "../_hooks/useStorePot";
import { DroppingBall } from "./DroppingBall";
import { LoadingCaption } from "./LoadingCaption";
import { PepperShaker } from "./PepperShaker";
import { PotIllustration } from "./PotIllustration";
import { RecommendResult } from "./RecommendResult";
import { StirringLadle } from "./StirringLadle";
import { StoreGrid } from "./StoreGrid";

export function RecommendScreen() {
  const router = useRouter();
  const reviewEntryPath = useReviewEntryPath();
  const reviewed = useReviewedStores();
  const {
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
  } = useRecommendFlow();

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
