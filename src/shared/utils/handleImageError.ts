/**
 * 로드에 실패한 이미지를 사용처가 지정한 fallback으로 교체한다.
 * fallback 자체가 실패했을 때 같은 src를 다시 할당하지 않아 오류 이벤트가 반복되지 않는다.
 */
export function handleImageError(image: HTMLImageElement, fallbackSrc: string): void {
  if (!fallbackSrc) {
    return;
  }

  const fallbackUrl = new URL(fallbackSrc, image.baseURI).href;

  if (image.src === fallbackUrl) {
    return;
  }

  image.src = fallbackSrc;
}
