import { createUploadIntent } from "@/api/gen/media/media.gen";
import { getTmtApiErrorTitle } from "@/api/mutator";

const MAX_GROUP_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_GROUP_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const UNSUPPORTED_TYPE_MESSAGE = "JPG, PNG, WEBP 형식의 이미지만 업로드할 수 있어요.";
const OVERSIZE_MESSAGE = "5MB 이하 사진만 업로드할 수 있어요.";
const UPLOAD_FAILED_MESSAGE = "이미지를 업로드하지 못했어요. 다시 시도해 주세요.";

export const GROUP_IMAGE_ACCEPT = [...ALLOWED_GROUP_IMAGE_TYPES].join(",");

class GroupImageUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GroupImageUploadError";
  }
}

export function getGroupImageUploadErrorTitle(error: unknown): string | undefined {
  return error instanceof GroupImageUploadError ? error.message : undefined;
}

export function getGroupImageValidationError(file: File): string | undefined {
  if (!ALLOWED_GROUP_IMAGE_TYPES.has(file.type)) {
    return UNSUPPORTED_TYPE_MESSAGE;
  }

  if (file.size > MAX_GROUP_IMAGE_SIZE_BYTES) {
    return OVERSIZE_MESSAGE;
  }

  return undefined;
}

export async function uploadGroupImage(file: File): Promise<string> {
  const validationError = getGroupImageValidationError(file);

  if (validationError) {
    throw new GroupImageUploadError(validationError);
  }

  try {
    const intent = await createUploadIntent({
      contentType: file.type,
      contentLength: file.size,
    });
    const uploadResponse = await fetch(intent.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new GroupImageUploadError(UPLOAD_FAILED_MESSAGE);
    }

    return intent.assetId;
  } catch (error) {
    if (error instanceof GroupImageUploadError) {
      throw error;
    }

    throw new GroupImageUploadError(getTmtApiErrorTitle(error) ?? UPLOAD_FAILED_MESSAGE);
  }
}
