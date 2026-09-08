import type { StaticImageData } from "next/image";
import step01Image from "../_assets/step-01.png";
import step02Image from "../_assets/step-02.png";
import step03Image from "../_assets/step-03.png";
import step04Image from "../_assets/step-04.png";

type OnboardingStep = {
  id: string;
  image: StaticImageData;
  /**
   * 시안이 타이틀까지 이미지에 넣어 내보내므로, 그 문구를 대체 텍스트로 옮긴다.
   * 함께 그려진 리뷰·그룹 예시는 장식이라 읽지 않는다.
   */
  alt: string;
};

export const ONBOARDING_STEPS = [
  {
    id: "honest-reviews",
    image: step01Image,
    alt: "광고 없이 솔직한 맛집 리뷰만 모아봐요",
  },
  {
    id: "pros-cons-summary",
    image: step02Image,
    alt: "장단점 요약으로 빠르게 리뷰를 파악해요",
  },
  {
    id: "group-taste",
    image: step03Image,
    alt: "그룹 가입으로 취향에 맞는 리뷰만 찾아봐요",
  },
  {
    id: "curation",
    image: step04Image,
    alt: "내 기록을 바탕으로 맞춤 큐레이션을 받아봐요",
  },
] as const satisfies readonly OnboardingStep[];

export const ONBOARDING_STEP_COUNT = ONBOARDING_STEPS.length;

export type { OnboardingStep };
