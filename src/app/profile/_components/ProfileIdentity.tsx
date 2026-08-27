import dummyProfile from "@/shared/assets/dummy-profile.png";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import type { ProfileIdentityModel } from "../_model/profile";

type ProfileIdentityProps = {
  /** 없으면 같은 치수의 자리표시로 그린다. 로딩 중에도 헤더 높이가 변하지 않아야 한다. */
  profile?: ProfileIdentityModel;
};

export function ProfileIdentity({ profile }: ProfileIdentityProps) {
  return (
    <div className="flex items-center gap-ds-12 bg-surface-primary px-ds-20 py-ds-12">
      {profile ? (
        <ImageWithFallback
          src={profile.profileImageUrl}
          fallbackSrc={dummyProfile}
          alt=""
          className="size-[70px] shrink-0 rounded-ds-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="size-[70px] shrink-0 animate-pulse rounded-ds-full bg-surface-secondary"
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-ds-4">
        {profile ? (
          <>
            <p className="truncate text-heading-sm text-content-primary">{profile.nickname}</p>
            {profile.email && (
              <p className="truncate text-body-md-medium text-content-tertiary">{profile.email}</p>
            )}
          </>
        ) : (
          // 이메일 줄은 자리표시에 두지 않는다. 타인 프로필에는 내려오지 않아 로딩 후 줄어들기 때문이다.
          <p aria-hidden="true" className="text-heading-sm">
            <span className="block h-[1em] w-[120px] animate-pulse rounded-ds-xs bg-surface-secondary" />
          </p>
        )}
      </div>
    </div>
  );
}
