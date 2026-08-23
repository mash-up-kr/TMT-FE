import Image from "next/image";
import mascotImage from "./assets/review-complete-mascot.png";

export function ReviewCompleteVisual() {
  return <Image src={mascotImage} alt="" priority className="size-[220px] object-contain" />;
}
