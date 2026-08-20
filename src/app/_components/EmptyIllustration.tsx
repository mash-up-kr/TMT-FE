import Image from "next/image";
import tomatoPencil from "./assets/tomato-pencil.png";

export function EmptyIllustration() {
  return (
    <Image
      src={tomatoPencil}
      alt=""
      width={172}
      height={130}
      sizes="172px"
      aria-hidden="true"
      className="h-[130px] w-[172px] shrink-0 aspect-[86/65]"
    />
  );
}
