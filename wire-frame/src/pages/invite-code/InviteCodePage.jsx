import { useState } from 'react'
import { INITIAL_INVITE_CODE } from '../../shared/mockData.js'
import './InviteCodePage.css'

function InviteCodePage({ onBack, onSubmit }) {
  const [code, setCode] = useState(INITIAL_INVITE_CODE)
  const joinedCode = code.join('').trim()
  const canSubmit = code.every(Boolean)

  function updateSlot(index, value) {
    const nextValue = value.slice(-1).toUpperCase()
    setCode((current) =>
      current.map((char, currentIndex) =>
        currentIndex === index ? nextValue : char,
      ),
    )
  }

  return (
    <div className="invite-code-page">
      <header className="ic-header">
        <button
          type="button"
          className="ic-back-button"
          aria-label="뒤로 가기"
          onClick={onBack}
        >
          ‹
        </button>
        <h1 className="ic-title">초대 코드로 입장</h1>
      </header>

      <main className="ic-content">
        <section className="ic-intro" aria-labelledby="ic-instruction">
          <h2 id="ic-instruction" className="ic-instruction">
            받은 6자리 코드를
            <br />
            입력하세요
          </h2>
        </section>

        <div className="ic-code-row" aria-label="초대 코드 6자리">
          {code.map((char, index) => (
            <input
              key={index}
              className={`ic-code-slot${char ? ' ic-code-slot--filled' : ''}`}
              type="text"
              inputMode="text"
              maxLength={1}
              aria-label={`초대 코드 ${index + 1}번째 자리`}
              value={char}
              onChange={(event) => updateSlot(index, event.target.value)}
            />
          ))}
        </div>

        <p className="ic-helper">
          받은 링크를 직접 클릭하면
          <br />
          자동으로 입장돼요
        </p>
      </main>

      <footer className="ic-footer">
        <button
          type="button"
          className="ic-submit-button"
          disabled={!canSubmit}
          onClick={() => onSubmit?.(joinedCode)}
        >
          입장하기
        </button>
      </footer>
    </div>
  )
}

export default InviteCodePage
