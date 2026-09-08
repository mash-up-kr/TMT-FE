export const PROFILE_IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";

export function getNicknameError(nickname: string): string | undefined {
  const length = Array.from(nickname.trim()).length;
  if (length < 2 || length > 20) return "닉네임은 2~20자로 입력해주세요.";
  return undefined;
}

export function getProfileImageError(file: File): string | undefined {
  if (!PROFILE_IMAGE_ACCEPT.split(",").includes(file.type)) {
    return "JPG, PNG, WEBP 형식의 이미지만 업로드할 수 있어요.";
  }
  if (file.size === 0 || file.size > 5 * 1024 * 1024) {
    return "5MB 이하 사진만 업로드할 수 있어요.";
  }
  return undefined;
}
