import { createUploadIntent } from "@/api/gen/media/media.gen";
import { getTmtApiErrorTitle } from "@/api/mutator";

const UPLOAD_FAILED_MESSAGE = "사진을 업로드하지 못했어요. 다시 시도해 주세요.";

export class ReviewPhotoUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReviewPhotoUploadError";
  }
}

export async function uploadReviewPhoto(file: File): Promise<string> {
  try {
    const intent = await createUploadIntent({
      contentType: file.type,
      contentLength: file.size,
    });
    const response = await fetch(intent.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!response.ok) {
      throw new ReviewPhotoUploadError(UPLOAD_FAILED_MESSAGE);
    }

    return intent.assetId;
  } catch (error) {
    if (error instanceof ReviewPhotoUploadError) {
      throw error;
    }

    throw new ReviewPhotoUploadError(getTmtApiErrorTitle(error) ?? UPLOAD_FAILED_MESSAGE);
  }
}
