import type { ProfileIdentityModel } from "../_model/profile";

type ProfileIdentityProps = {
  profile: ProfileIdentityModel;
};

export function ProfileIdentity({ profile }: ProfileIdentityProps) {
  return (
    <div className="flex items-center gap-ds-12 bg-surface-primary px-ds-20 py-ds-12">
      <ProfileAvatar imageUrl={profile.profileImageUrl} />
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-ds-4">
        <p className="truncate text-heading-sm text-content-primary">{profile.nickname}</p>
        {profile.email ? (
          <p className="truncate text-body-md-medium text-content-tertiary">{profile.email}</p>
        ) : null}
      </div>
    </div>
  );
}

function ProfileAvatar({ imageUrl }: { imageUrl: string | null }) {
  if (!imageUrl) {
    return (
      <div
        aria-hidden="true"
        className="size-[70px] shrink-0 rounded-ds-full bg-surface-tertiary"
      />
    );
  }

  return (
    // biome-ignore lint/performance/noImgElement: 이미지 호스트가 확정되지 않아 next.config의 remotePatterns를 채울 수 없다.
    <img
      src={imageUrl}
      alt=""
      className="size-[70px] shrink-0 rounded-ds-full object-cover"
      loading="lazy"
    />
  );
}
