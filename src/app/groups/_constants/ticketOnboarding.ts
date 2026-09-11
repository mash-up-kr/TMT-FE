import type { StaticImageData } from "next/image";
import step01Image from "../_assets/ticket-onboarding-01.png";
import step02Image from "../_assets/ticket-onboarding-02.png";
import step03Image from "../_assets/ticket-onboarding-03.png";

type TicketOnboardingStep = {
  id: string;
  /** 시안 아트워크. 뜻은 제목과 설명이 전하므로 장식으로 둔다. */
  image: StaticImageData;
  title: string;
  description: string;
  ctaLabel: string;
};

export const TICKET_ONBOARDING_STEPS = [
  {
    id: "review-to-ticket",
    image: step01Image,
    title: "맛집 후기 하나가\n티켓 한 장이 돼요",
    description: "리뷰를 완성하면, 티켓이 생겨요",
    ctaLabel: "다음",
  },
  {
    id: "ticket-to-group",
    image: step02Image,
    title: "티켓으로 취향 맞는 그룹에\n들어갈 수 있어요",
    description: "관심 그룹에 가입할 때마다 티켓 1장이 쓰여요",
    ctaLabel: "다음",
  },
  {
    id: "welcome-ticket",
    image: step03Image,
    title: "가입 선물로\n티켓 1장을 이미 드렸어요",
    description: "지금 바로 취향 맞는 그룹에 들어가볼까요?",
    ctaLabel: "시작하기",
  },
] as const satisfies readonly TicketOnboardingStep[];

export const TICKET_ONBOARDING_STEP_COUNT = TICKET_ONBOARDING_STEPS.length;

/** 그룹 탭에서 티켓 안내를 이미 띄웠는지. 기기 단위로 한 번만 보여준다. */
export const TICKET_ONBOARDING_STORAGE_KEY = "tmt:group-ticket-onboarding-seen";
