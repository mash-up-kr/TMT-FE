"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { createUploadIntent } from "@/api/gen/media/media.gen";
import { getMeQueryKey, updateMyProfile } from "@/api/gen/profile/profile.gen";
import { getTmtApiErrorTitle } from "@/api/mutator";

export function useSignup() {
  const queryClient = useQueryClient();
  // 프로필 저장만 실패했을 때 같은 사진을 다시 업로드하지 않는다.
  const uploadedImage = useRef<{ file: File; assetId: string } | null>(null);
  const request = useRef<AbortController | null>(null);
  const submitting = useRef(false);
  useEffect(() => () => request.current?.abort(), []);
  const mutation = useMutation({
    mutationFn: async ({ nickname, image }: { nickname: string; image?: File }) => {
      const controller = new AbortController();
      request.current = controller;
      const { signal } = controller;
      let assetId: string | undefined;
      if (image) {
        if (uploadedImage.current?.file === image) {
          assetId = uploadedImage.current.assetId;
        } else {
          const intent = await createUploadIntent(
            { contentType: image.type, contentLength: image.size },
            { signal },
          );
          const response = await fetch(intent.uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": image.type },
            body: image,
            signal,
          });
          if (!response.ok) throw new Error("Upload failed");
          assetId = intent.assetId;
          uploadedImage.current = { file: image, assetId };
        }
      }
      const profile = await updateMyProfile(
        { nickname: nickname.trim(), profileImageAssetId: assetId },
        { signal },
      );
      if (profile.profileCompleted !== true) throw new Error("Profile was not completed");
      return profile;
    },
    onSuccess: async (profile) => {
      await queryClient.cancelQueries({ queryKey: getMeQueryKey() });
      if (!request.current?.signal.aborted) queryClient.setQueryData(getMeQueryKey(), profile);
    },
    onSettled: () => {
      submitting.current = false;
    },
  });
  return {
    submit: (values: { nickname: string; image?: File }) => {
      if (submitting.current) return;
      submitting.current = true;
      mutation.mutate(values);
    },
    isPending: mutation.isPending,
    error: mutation.error
      ? (getTmtApiErrorTitle(mutation.error) ?? "잠시 후 다시 시도해 주세요.")
      : undefined,
    reset: mutation.reset,
  };
}
