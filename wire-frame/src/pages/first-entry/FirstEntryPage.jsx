import { useState } from 'react'
import { GROUP_ID_TO_REGION } from '../../shared/mockData.js'
import { getGroupViews } from '../../shared/selectors.js'
import './FirstEntryPage.css'

function FirstEntryPage({ data, onStart, onCreateGroup, onInviteCode }) {
  const myGroups = getGroupViews(data).filter((g) =>
    data.groups
      .find((raw) => raw.id === g.id)
      ?.memberIds.includes(data.session.currentUserId),
  )
  const [nickname, setNickname] = useState('')

  const enterGroup = (groupId) => {
    const region = GROUP_ID_TO_REGION[groupId]
    const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
    const search = region ? `?region=${region}` : ''
    window.location.href = `${basePath}/${search}#/main`
  }

  return (
    <div className="first-entry">
      <header className="fe-hero">
        <h1 className="fe-title">
          우리 그룹의
          <br />
          맛집 사전
        </h1>
        <p className="fe-subtitle">우리끼리만 보는 진짜 맛집</p>
      </header>

      <div className="fe-field fe-field--nickname">
        <label className="fe-label" htmlFor="fe-nickname">
          닉네임 (임시 로그인)
        </label>
        <input
          id="fe-nickname"
          className="fe-input"
          type="text"
          placeholder="예: 준표"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
        />
      </div>

      <div className="fe-field fe-field--group">
        <p className="fe-label">내 그룹</p>
        {myGroups.map((g) => (
          <button
            key={g.id}
            type="button"
            className="fe-group-card"
            onClick={() => enterGroup(g.id)}
          >
            <span className="fe-group-icon" aria-hidden="true">
              {g.icon}
            </span>
            <span className="fe-group-info">
              <span className="fe-group-name">{g.name}</span>
              <span className="fe-group-meta">{g.meta}</span>
            </span>
            <span className="fe-group-chevron" aria-hidden="true">
              ›
            </span>
          </button>
        ))}
      </div>

      <div className="fe-spacer" />

      <footer className="fe-footer">
        <button
          type="button"
          className="fe-primary-button"
          onClick={onCreateGroup}
        >
          + 새 그룹 만들기
        </button>
        <button type="button" className="fe-invite-link" onClick={onInviteCode}>
          초대 코드로 입장
        </button>
      </footer>
    </div>
  )
}

export default FirstEntryPage
