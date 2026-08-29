"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { type MockUserId, setMockUserId } from "@/api/mutator";
import dummyProfile from "@/shared/assets/dummy-profile.png";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/ui/Button";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";

const UT2_USERS = ["1", "2", "3", "4"] as const satisfies readonly MockUserId[];

export default function Ut2PreviewPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  function handleUserSelect(userId: MockUserId) {
    setMockUserId(userId);
    queryClient.clear();
    router.push(ROUTES.ROOT);
  }

  return (
    <main className="content-container flex min-h-full flex-col justify-center gap-ds-24 bg-surface-secondary py-ds-24">
      <header className="flex flex-col gap-ds-8">
        <h1 className="text-heading-lg text-content-primary">또맛또 UT2 사용자 선택</h1>
        <p className="text-body-md-regular text-content-secondary">
          확인할 사용자를 선택해 주세요.
        </p>
      </header>

      <div className="flex flex-col gap-ds-12">
        {UT2_USERS.map((userId) => (
          <Button
            key={userId}
            variant="tertiary"
            className="h-auto w-full justify-start gap-ds-12 rounded-ds-md border-sm border-stroke-primary p-ds-12 text-left"
            onClick={() => handleUserSelect(userId)}
          >
            <ImageWithFallback
              src={null}
              fallbackSrc={dummyProfile}
              alt=""
              className="size-ds-48 shrink-0 rounded-ds-full object-cover"
            />
            <span className="flex flex-col gap-ds-4">
              <span className="text-body-lg-bold text-content-primary">유저 {userId}</span>
              <span className="text-body-sm-regular text-content-secondary">UT 사용자</span>
            </span>
          </Button>
        ))}
      </div>
    </main>
  );
}
