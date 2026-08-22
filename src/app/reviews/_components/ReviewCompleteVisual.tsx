import Image from "next/image";
import mascotImage from "./assets/review-complete-mascot.png";

/**
 * 완료 화면의 마스코트.
 *
 * 사진 첨부 여부와 무관하게 항상 같은 그림을 쓴다. 완료했다는 사실 자체를 알리는 그림이라
 * 입력 내용에 따라 달라질 이유가 없다.
 *
 * 제목이 "리뷰 작성이 완료되었어요!"를 이미 읽어주므로 그림은 장식으로 두고 `alt`를 비운다.
 */
export function ReviewCompleteVisual() {
  return <Image src={mascotImage} alt="" priority className="size-[220px] object-contain" />;
}
