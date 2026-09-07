import Image from "next/image";
import { Button } from "@/shared/ui/Button";
import kakaoIcon from "../_assets/kakao.svg";
import loginLogo from "../_assets/login-logo.svg";

type LoginScreenProps = {
  loading?: boolean;
  disabled?: boolean;
  error?: string | null;
  onLogin: () => void;
};

export function LoginScreen({
  loading = false,
  disabled = false,
  error,
  onLogin,
}: LoginScreenProps) {
  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-surface-primary">
      <div className="content-container flex flex-1 items-center justify-center py-ds-64">
        <h1 className="relative shrink-0" style={{ width: 167, height: 112.324 }}>
          <Image
            src={loginLogo}
            alt="또맛또"
            fill
            priority
            sizes="167px"
            className="object-contain"
          />
        </h1>
      </div>
      <div className="content-container flex shrink-0 flex-col gap-ds-12 pt-ds-12 pb-ds-32">
        {error && (
          <p role="alert" className="text-center text-body-sm-regular text-content-error">
            {error}
          </p>
        )}
        <Button
          className="h-ds-48 w-full bg-surface-kakao text-content-kakao hover:bg-surface-kakao active:bg-surface-kakao"
          leftIcon={<Image src={kakaoIcon} alt="" width={18} height={18} />}
          loading={loading}
          disabled={disabled}
          onClick={onLogin}
        >
          카카오로 시작하기
        </Button>
      </div>
    </main>
  );
}
