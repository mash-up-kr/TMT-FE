import Link from "next/link";
import { ChevronRightIcon } from "@/shared/ui/Icons";

const PREVIEWS = [
  {
    href: "/preview/empty-notice",
    title: "EmptyNotice",
    description: "기본·설명·액션·강조 변형과 배치 영역",
  },
  {
    href: "/preview/home",
    title: "홈",
    description: "가입 여부, 피드, 이미지 fallback, 로딩·오류·위치 상태",
  },
  {
    href: "/preview/groups/new",
    title: "그룹 생성",
    description: "4단계 입력, 태그 조회, 생성 진행·성공·실패 상태",
  },
  {
    href: "/preview/profile",
    title: "프로필",
    description: "그룹, 좋아요, 티켓의 기본·빈 상태",
  },
  {
    href: "/preview/groups",
    title: "그룹 탐색",
    description: "목록, 검색 결과 없음, 로딩·오류 상태",
  },
  {
    href: "/preview/groups/detail",
    title: "그룹 상세",
    description: "가입·탈퇴와 상세 화면 상태",
  },
  {
    href: "/preview/groups/edit",
    title: "그룹 편집",
    description: "편집 폼, 삭제 확인, 저장·삭제 상태",
  },
] as const;

export default function PreviewIndexPage() {
  return (
    <main className="min-h-full overflow-y-auto bg-surface-secondary px-ds-20 py-ds-24">
      <div className="mx-auto flex w-full max-w-(--layout-frame-max) flex-col gap-ds-20">
        <header className="flex flex-col gap-ds-4">
          <h1 className="text-heading-lg text-content-primary">UI 프리뷰</h1>
          <p className="text-body-md-regular text-content-secondary">
            화면을 선택한 뒤 프레임 바깥 메뉴에서 상태를 전환하세요.
          </p>
        </header>

        <ul className="flex flex-col gap-ds-12">
          {PREVIEWS.map((preview) => (
            <li key={preview.href}>
              <Link
                href={preview.href}
                className="flex items-center gap-ds-12 rounded-ds-md bg-surface-primary p-ds-16 active:bg-surface-tertiary"
              >
                <span className="flex min-w-0 flex-1 flex-col gap-ds-4">
                  <span className="text-body-lg-bold text-content-primary">{preview.title}</span>
                  <span className="text-body-md-regular text-content-secondary">
                    {preview.description}
                  </span>
                </span>
                <ChevronRightIcon className="shrink-0 text-icon-primary" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
