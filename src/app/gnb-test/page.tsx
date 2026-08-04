import type { ReactNode } from "react";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { BlankIcon, CancelIcon, ChevronDownIcon } from "@/shared/ui/icons";

/**
 * GNB 수동 검증 페이지.
 *
 * 자동 테스트 러너가 없어 시안 대조와 정렬 확인을 눈으로 한다.
 * 알림·메뉴 아이콘은 확정 전이라 시안의 위치만 맞추고 임시 아이콘으로 세운다.
 */
export default function GnbTestPage() {
  return (
    <main className="flex flex-1 flex-col gap-ds-24 py-ds-24">
      <header className="content-container flex flex-col gap-ds-4">
        <h1 className="text-heading-sm text-content-primary">GNB 검증</h1>
        <p className="text-body-sm-regular text-content-tertiary">
          타이틀이 화면 중앙에 오는지, 좌우 슬롯 폭이 달라져도 유지되는지 확인한다.
        </p>
      </header>

      <Case label="Style=Logo, Location=Center" hint="시안 기본형">
        <GNB left={<BackButton />} right={<Actions />} />
      </Case>

      <Case label="Style=Logo, Location=Left" hint="로고가 좌측 슬롯에 붙는다">
        <GNB align="left" right={<Actions />} />
      </Case>

      <Case label="Style=Title, Location=Center" hint="타이틀 20px, 화면 정중앙">
        <GNB title="타이틀 내용" left={<BackButton />} right={<Actions />} />
      </Case>

      <Case label="Style=Title, Location=Left" hint="뒤로가기 옆에 타이틀">
        <GNB align="left" title="타이틀 내용" left={<BackButton />} right={<Actions />} />
      </Case>

      <Case label="좌우 비대칭" hint="우측이 2개인데도 타이틀이 중앙에 남아야 한다">
        <GNB title="새 그룹 만들기" left={<BackButton />} />
      </Case>

      <Case label="좌측 2개" hint="좌측도 우측과 같은 간격으로 벌어져야 한다">
        <GNB title="타이틀 내용" left={<LeftPair />} right={<Actions />} />
      </Case>

      <Case label="좌측 2개 · 우측 1개" hint="좌측이 더 넓어도 타이틀은 중앙">
        <GNB
          title="타이틀 내용"
          left={<LeftPair />}
          right={
            <IconButton aria-label="메뉴">
              <CancelIcon />
            </IconButton>
          }
        />
      </Case>

      <Case label="좌측 2개 · Location=Left" hint="로고 앞에 아이콘 2개">
        <GNB align="left" left={<LeftPair />} right={<Actions />} />
      </Case>

      <Case label="우측만" hint="좌측이 비어도 중앙 유지">
        <GNB title="그룹탐색" right={<Actions />} />
      </Case>

      <Case label="슬롯 없음" hint="양쪽 모두 비었을 때">
        <GNB title="지도" />
      </Case>

      <Case label="긴 타이틀" hint="말줄임되고 좌우 슬롯을 침범하지 않아야 한다">
        <GNB
          title="아주 긴 타이틀이 들어가면 어떻게 되는지 확인하는 케이스"
          left={<BackButton />}
          right={<Actions />}
        />
      </Case>
    </main>
  );
}

function Case({
  label,
  hint,
  children,
}: Readonly<{ label: string; hint: string; children: ReactNode }>) {
  return (
    <section className="flex flex-col gap-ds-8">
      <div className="content-container flex flex-col">
        <span className="text-body-md-bold text-content-primary">{label}</span>
        <span className="text-body-sm-regular text-content-tertiary">{hint}</span>
      </div>
      <div className="bg-surface-secondary py-ds-8">{children}</div>
    </section>
  );
}

function BackButton() {
  return (
    <IconButton aria-label="뒤로 가기">
      <ChevronDownIcon className="rotate-90" />
    </IconButton>
  );
}

function LeftPair() {
  return (
    <>
      <IconButton aria-label="뒤로 가기">
        <ChevronDownIcon className="rotate-90" />
      </IconButton>
      <IconButton aria-label="닫기">
        <CancelIcon />
      </IconButton>
    </>
  );
}

function Actions() {
  return (
    <>
      <IconButton aria-label="알림">
        <BlankIcon />
      </IconButton>
      <IconButton aria-label="메뉴">
        <CancelIcon />
      </IconButton>
    </>
  );
}
