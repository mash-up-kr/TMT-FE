"use client";

import { useEffect, useRef, useState } from "react";
import { getNicknameError, getProfileImageError } from "../_utils/signupValidation";

export function useSignupDraft() {
  const [nickname, setNickname] = useState("");
  const [nicknameTouched, setNicknameTouched] = useState(false);
  const [image, setImage] = useState<{ file: File; previewUrl: string }>();
  const imageUrlRef = useRef<string | undefined>(undefined);
  const [imageError, setImageError] = useState<string>();

  useEffect(
    () => () => {
      if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current);
    },
    [],
  );

  function selectImage(file: File) {
    const error = getProfileImageError(file);
    setImageError(error);
    if (error) return;
    if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current);
    const previewUrl = URL.createObjectURL(file);
    imageUrlRef.current = previewUrl;
    setImage({ file, previewUrl });
  }

  function rejectImage() {
    if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current);
    imageUrlRef.current = undefined;
    setImage(undefined);
    setImageError("이미지를 불러올 수 없어요. 다른 파일을 선택해주세요.");
  }

  const nicknameError = getNicknameError(nickname);
  return {
    nickname,
    setNickname,
    nicknameError: nicknameTouched || nickname.length > 0 ? nicknameError : undefined,
    touchNickname: () => setNicknameTouched(true),
    canContinue: !nicknameError,
    image,
    imageError,
    selectImage,
    rejectImage,
  };
}
