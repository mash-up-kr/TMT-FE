import dummyProfile from "@/shared/assets/dummy-profile.png";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import type { ProfileIdentityModel } from "../_model/profile";

type ProfileIdentityProps = {
  profile: ProfileIdentityModel;
};

export function ProfileIdentity({ profile }: ProfileIdentityProps) {
  return (
    <div className="flex items-center gap-ds-12 bg-surface-primary px-ds-20 py-ds-12">
      <ImageWithFallback
        src={profile.profileImageUrl}
        fallbackSrc={dummyProfile}
        alt=""
        className="size-[70px] shrink-0 rounded-ds-full object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-ds-4">
        <p className="truncate text-heading-sm text-content-primary">{profile.nickname}</p>
        {profile.email && (
          <p className="truncate text-body-md-medium text-content-tertiary">{profile.email}</p>
        )}
      </div>
    </div>
  );
}
