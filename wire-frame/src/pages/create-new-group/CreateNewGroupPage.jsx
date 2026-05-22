import { useEffect, useState } from 'react'
import {
  DEFAULT_GROUP_NAME,
  GROUP_ICONS,
  SHARE_TARGETS,
  SHARE_URL,
} from '../../shared/mockData.js'
import './CreateNewGroupPage.css'

function CreateNewGroupPage({ onBack, onCreated }) {
  const [groupName, setGroupName] = useState(DEFAULT_GROUP_NAME)
  const [selectedIcon, setSelectedIcon] = useState(GROUP_ICONS[0])
  const [created, setCreated] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [shareVisible, setShareVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  const canCreate = groupName.trim().length > 0
  const displayGroupName = groupName.trim() || '--'

  useEffect(() => {
    if (!shareOpen) {
      return undefined
    }

    const frame = requestAnimationFrame(() => setShareVisible(true))
    return () => cancelAnimationFrame(frame)
  }, [shareOpen])

  function closeShareSheet() {
    setShareVisible(false)
    window.setTimeout(() => setShareOpen(false), 220)
  }

  return (
    <div className="create-group-page">
      <section className="cg-panel" aria-label="새 그룹 만들기">
        <header className="cg-header">
          <button
            type="button"
            className="cg-back-button"
            aria-label="뒤로 가기"
            onClick={onBack}
          >
            ‹
          </button>
          <h1 className="cg-title">새 그룹 만들기</h1>
        </header>

        <main className="cg-content">
          <div className="cg-field cg-field--name">
            <label className="cg-label" htmlFor="cg-group-name">
              그룹 이름
            </label>
            <input
              id="cg-group-name"
              className="cg-name-input"
              type="text"
              value={groupName}
              onChange={(event) => {
                setGroupName(event.target.value)
                setCreated(false)
              }}
            />
          </div>

          <fieldset className="cg-field cg-icon-field">
            <legend className="cg-label">아이콘</legend>
            <div className="cg-icon-list">
              {GROUP_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className={`cg-icon-button${selectedIcon === icon ? ' cg-icon-button--selected' : ''}`}
                  aria-pressed={selectedIcon === icon}
                  aria-label={`${icon} 아이콘 선택`}
                  onClick={() => {
                    setSelectedIcon(icon)
                    setCreated(false)
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="cg-field cg-invite-field">
            <p className="cg-label">멤버 초대</p>
            <button
              type="button"
              className="cg-invite-button"
              onClick={() => {
                setShareOpen(true)
                setCopied(false)
              }}
            >
              <span className="cg-link-icon" aria-hidden="true">
                🔗
              </span>
              <span>그룹 공유하기</span>
            </button>
            <p className="cg-helper-text">생성 후 카카오톡으로 공유 가능</p>
          </div>
        </main>

        <footer className="cg-footer">
          <button
            type="button"
            className="cg-submit-button"
            disabled={!canCreate}
            onClick={() => {
              setCreated(true)
              onCreated?.({
                name: displayGroupName,
                icon: selectedIcon,
              })
            }}
          >
            {created ? `${selectedIcon} 생성됨` : '만들기'}
          </button>
        </footer>
      </section>

      {shareOpen && (
        <div
          className="cg-share-layer"
          role="presentation"
          onClick={closeShareSheet}
        >
          <section
            className={`cg-share-sheet${shareVisible ? ' cg-share-sheet--visible' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cg-share-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cg-sheet-handle" aria-hidden="true" />

            <div className="cg-share-heading">
              <h2 id="cg-share-title" className="cg-share-title">
                공유하기
              </h2>
              <p className="cg-share-subtitle">
                {displayGroupName}를 공유해보세요!
              </p>
            </div>

            <div className="cg-share-body">
              <div className="cg-share-link-box">{SHARE_URL}</div>

              <button
                type="button"
                className="cg-copy-button"
                onClick={() => setCopied(true)}
              >
                <svg
                  className="cg-copy-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M9.5 14.5l5-5m-3.8-2.1 1.6-1.6a4 4 0 0 1 5.7 5.7l-1.6 1.6m-3.1 3.5-1.6 1.6a4 4 0 0 1-5.7-5.7l1.6-1.6"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{copied ? '복사됨' : '링크 복사'}</span>
              </button>

              <div className="cg-share-options" aria-label="공유 대상">
                {SHARE_TARGETS.map((target) => (
                  <button
                    key={target.label}
                    type="button"
                    className="cg-share-option"
                    aria-label={`${target.label}로 공유`}
                  >
                    <span
                      className={`cg-share-option-icon cg-share-option-icon--${target.icon}`}
                      aria-hidden="true"
                    />
                    <span>{target.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default CreateNewGroupPage
