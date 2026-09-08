"use client";

import { useId, useState } from "react";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { GNB } from "@/shared/ui/GNB";
import { ImagePicker } from "@/shared/ui/ImagePicker";
import { Modal } from "@/shared/ui/Modal";
import { TextField } from "@/shared/ui/TextField";
import { useSignupDraft } from "../_hooks/useSignupDraft";
import { PROFILE_IMAGE_ACCEPT } from "../_utils/signupValidation";

type SignupFormProps = {
  isPending: boolean;
  error?: string;
  onConfirm: (values: { nickname: string; image?: File }) => void;
  onResetError: () => void;
};

export function SignupForm({ isPending, error, onConfirm, onResetError }: SignupFormProps) {
  const draft = useSignupDraft();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const imageId = useId();
  const imageErrorId = `${imageId}-error`;
  return (
    <>
      <GNB title="프로필 생성" className="shrink-0" />
      <form
        className="flex min-h-0 flex-1 flex-col"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          draft.touchNickname();
          if (!draft.canContinue || isPending) return;
          onResetError();
          setConfirmOpen(true);
        }}
      >
        <main className="content-container flex min-h-0 flex-1 flex-col gap-ds-20 overflow-y-auto py-ds-20">
          <h1 className="sr-only">프로필 생성</h1>
          <div className="flex flex-col gap-ds-12">
            <label htmlFor={imageId} className="text-body-lg-medium text-content-primary">
              프로필 이미지
            </label>
            <ImagePicker
              id={imageId}
              label="프로필 이미지"
              src={draft.image?.previewUrl}
              accept={PROFILE_IMAGE_ACCEPT}
              disabled={isPending}
              invalid={Boolean(draft.imageError)}
              describedBy={draft.imageError ? imageErrorId : undefined}
              onSelect={draft.selectImage}
              variant="camera-removable"
              onRemove={draft.removeImage}
              onImageError={draft.rejectImage}
            />
            {draft.imageError ? (
              <p id={imageErrorId} role="alert" className="text-body-md-medium text-content-error">
                {draft.imageError}
              </p>
            ) : null}
          </div>
          <TextField
            label="닉네임"
            name="nickname"
            autoComplete="nickname"
            aria-required="true"
            placeholder="사용하실 닉네임을 입력해주세요"
            value={draft.nickname}
            disabled={isPending}
            onChange={(event) => draft.setNickname(event.target.value)}
            onBlur={draft.touchNickname}
            invalid={Boolean(draft.nicknameError)}
            helpMessage={draft.nicknameError}
            enterKeyHint="done"
          />
        </main>
        <ButtonStack className="content-container shrink-0 pt-ds-12 pb-ds-32">
          <Button type="submit" variant="secondary" disabled={!draft.canContinue || isPending}>
            다음
          </Button>
        </ButtonStack>
      </form>
      <Modal
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!isPending) setConfirmOpen(open);
        }}
        title={`${draft.nickname.trim()} 닉네임 확인`}
        showClose={false}
        footer={
          <ButtonStack type="horizontal">
            <Button variant="tertiary" disabled={isPending} onClick={() => setConfirmOpen(false)}>
              취소
            </Button>
            <Button
              loading={isPending}
              onClick={() => {
                if (!isPending && draft.canContinue)
                  onConfirm({ nickname: draft.nickname.trim(), image: draft.image?.file });
              }}
            >
              확인
            </Button>
          </ButtonStack>
        }
      >
        <div className="flex flex-col gap-ds-8 pt-ds-32 text-center">
          <p className="wrap-anywhere text-heading-md text-content-primary">
            {draft.nickname.trim()}
          </p>
          <p className="text-body-lg-medium text-content-tertiary">이 닉네임으로 등록하시겠어요?</p>
          {error ? (
            <p role="alert" className="text-body-md-medium text-content-error">
              {error}
            </p>
          ) : null}
        </div>
      </Modal>
    </>
  );
}
