import Image from "next/image";
import mascotImage from "./assets/tomato-mascot-celebration.png";

export function ReviewCompleteVisual() {
  return <Image src={mascotImage} alt="" priority className="size-[220px] object-contain" />;
}
