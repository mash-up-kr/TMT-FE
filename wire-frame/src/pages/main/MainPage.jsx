import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  EMPTY_GROUP_TABS,
  MAIN_TABS,
  MAP_FILTER_CHIPS,
  MAP_PINS,
  RATING_VOTES,
  RESTAURANT_FILTER_CHIPS,
  STORE_RATINGS,
} from '../../shared/mockData.js'
import {
  getCurrentGroupRestaurants,
  getGroupViews,
  getRestaurantDetail,
  getSearchResults,
} from '../../shared/selectors.js'
import './MainPage.css'

function Chips({ labels = RESTAURANT_FILTER_CHIPS, active, onSelect }) {
  return (
    <div className="mp-chips">
      {labels.map((chip, i) => (
        <button
          key={chip}
          type="button"
          aria-pressed={active === i}
          className={`mp-chip${active === i ? ' mp-chip--active' : ''}`}
          onClick={() => onSelect(i)}
        >
          {chip}
        </button>
      ))}
    </div>
  )
}

function RestaurantSection({ items, onRegister, onSelect }) {
  return (
    <div className="mp-list-group">
      <ul className="mp-list">
        {items.map((r) => (
          <li key={r.name}>
            <button
              type="button"
              className="mp-item"
              onClick={() => onSelect(r)}
            >
              <span className="mp-item-thumb" />
              <span className="mp-item-body">
                <span className="mp-item-title-row">
                  <span className="mp-item-name">{r.name}</span>
                  <span
                    className={`mp-badge${r.hot ? ' mp-badge--hot' : ''}`}
                  >
                    {r.pct}
                  </span>
                </span>
                <span className="mp-item-meta">{r.meta}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mp-register-section">
        <button
          type="button"
          className="mp-register-button"
          onClick={onRegister}
        >
          가게 등록
        </button>
      </div>
    </div>
  )
}

function GroupMapView({ onAddStore }) {
  const [mapChip, setMapChip] = useState(0)

  return (
    <div className="mp-detail-map">
      <Chips labels={MAP_FILTER_CHIPS} active={mapChip} onSelect={setMapChip} />
      <div className="mp-mapview">
        <span className="mp-mapview-label">을지로 노포</span>
        {MAP_PINS.map((pin, i) => (
          <span
            key={i}
            className={`mp-mappin mp-mappin--${pin.type}`}
            style={{ top: pin.top, left: pin.left }}
            aria-hidden="true"
          />
        ))}
        <button
          type="button"
          className="mp-mapview-fab"
          onClick={onAddStore}
          aria-label="가게 추가"
        >
          +
        </button>
      </div>
    </div>
  )
}

function SlidingTextTabs({ labels, activeIndex, onSelect }) {
  const tabsRef = useRef(null)
  const buttonRefs = useRef([])
  const [indicator, setIndicator] = useState({ x: 16, width: 0 })

  useLayoutEffect(() => {
    const tabs = tabsRef.current
    const activeButton = buttonRefs.current[activeIndex]

    if (!tabs || !activeButton) {
      return undefined
    }

    function measure() {
      setIndicator({
        x: activeButton.offsetLeft,
        width: activeButton.offsetWidth,
      })
    }

    measure()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure)
      return () => window.removeEventListener('resize', measure)
    }

    const observer = new ResizeObserver(measure)
    observer.observe(tabs)
    observer.observe(activeButton)
    return () => observer.disconnect()
  }, [activeIndex, labels])

  return (
    <div
      ref={tabsRef}
      className="mp-eg-tabs"
      style={{
        '--eg-indicator-x': `${indicator.x}px`,
        '--eg-indicator-w': `${indicator.width}px`,
      }}
    >
      {labels.map((label, index) => (
        <button
          key={label}
          ref={(node) => {
            buttonRefs.current[index] = node
          }}
          type="button"
          aria-pressed={activeIndex === index}
          className={`mp-eg-tab${activeIndex === index ? ' mp-eg-tab--active' : ''}`}
          onClick={() => onSelect(index)}
        >
          {label}
        </button>
      ))}
      <span className="mp-eg-tab-indicator" aria-hidden="true" />
    </div>
  )
}

function GroupDetail({
  group,
  chipState,
  onChip,
  onBack,
  onRegister,
  onSelectRestaurant,
  view,
  onView,
}) {
  return (
    <>
      <header className="mp-detail-header">
        <button
          type="button"
          className="mp-detail-back"
          onClick={onBack}
          aria-label="뒤로"
        >
          ‹
        </button>
        <span className="mp-detail-name">{group.name}</span>
        <span className="mp-eg-avatars" aria-hidden="true">
          <span className="mp-eg-avatar mp-eg-avatar--a" />
          <span className="mp-eg-avatar mp-eg-avatar--b" />
          <span className="mp-eg-avatar mp-eg-avatar--count">
            +{group.stats.members - 2}
          </span>
        </span>
      </header>

      <SlidingTextTabs
        labels={EMPTY_GROUP_TABS}
        activeIndex={view === 'map' ? 1 : 0}
        onSelect={(index) => onView(index === 0 ? 'list' : 'map')}
      />

      {view === 'map' ? (
        <GroupMapView onAddStore={onRegister} />
      ) : (
        <div className="mp-detail-content">
          <div className="mp-group-summary">
            <div className="mp-summary-card">
              <div className="mp-summary-head">
                <span className="mp-group-icon" aria-hidden="true">
                  {group.icon}
                </span>
                <span className="mp-group-info">
                  <span className="mp-group-name">{group.name}</span>
                  <span className="mp-group-meta">{group.meta}</span>
                </span>
                <span className="mp-group-chevron" aria-hidden="true">
                  ›
                </span>
              </div>

              <div className="mp-summary-stats">
                <div className="mp-stat">
                  <span className="mp-stat-num">{group.stats.saved}</span>
                  <span className="mp-stat-label">저장된 장소</span>
                </div>
                <div className="mp-stat">
                  <span className="mp-stat-num">{group.stats.members}</span>
                  <span className="mp-stat-label">멤버</span>
                </div>
                <div className="mp-stat">
                  <span className="mp-stat-num">{group.stats.monthly}</span>
                  <span className="mp-stat-label">이번달 추가</span>
                </div>
              </div>

              <div className="mp-summary-members">
                <div className="mp-avatars">
                  {group.memberInitials.map((ch, i) => (
                    <span key={i} className="mp-avatar" aria-hidden="true">
                      {ch}
                    </span>
                  ))}
                </div>
                <span className="mp-members-text">{group.membersText}</span>
              </div>
            </div>
          </div>

          <Chips active={chipState} onSelect={onChip} />
          <RestaurantSection
            items={group.restaurants}
            onRegister={onRegister}
            onSelect={onSelectRestaurant}
          />
        </div>
      )}

    </>
  )
}

function EmptyGroupDetail({ group, tab, onTab, onBack, onAddStore }) {
  return (
    <>
      <header className="mp-eg-header">
        <button
          type="button"
          className="mp-detail-back"
          onClick={onBack}
          aria-label="뒤로"
        >
          ‹
        </button>
        <span className="mp-eg-name">{group.name}</span>
        <span className="mp-eg-avatars" aria-hidden="true">
          <span className="mp-eg-avatar mp-eg-avatar--a" />
          <span className="mp-eg-avatar mp-eg-avatar--b" />
        </span>
      </header>

      <SlidingTextTabs
        labels={EMPTY_GROUP_TABS}
        activeIndex={tab}
        onSelect={onTab}
      />

      <div className="mp-eg-empty">
        <div className="mp-eg-icon">
          <div className="mp-eg-icon-box" />
        </div>
        <p className="mp-eg-empty-title">아직 등록된 가게가 없어요</p>
        <p className="mp-eg-empty-desc">
          첫 가게를 등록하고
          <br />
          그룹의 사전을 시작해보세요
        </p>
        <button type="button" className="mp-eg-button" onClick={onAddStore}>
          + 첫 가게 등록
        </button>
      </div>

    </>
  )
}

function StoreSearch({ open, query, onQuery, onSelect, onClose, results }) {
  const term = query.trim()
  const matches = term
    ? results.filter((p) => p.name.includes(term))
    : results

  return (
    <div className={`mp-search${open ? ' mp-search--open' : ''}`}>
      <header className="mp-search-header">
        <button
          type="button"
          className="mp-detail-back"
          onClick={onClose}
          aria-label="뒤로"
        >
          ‹
        </button>
        <div className="mp-search-box">
          <span className="mp-search-box-icon" aria-hidden="true">
            🔍
          </span>
          <input
            className="mp-search-input"
            type="text"
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="가게명 검색"
            aria-label="가게명 검색"
          />
        </div>
      </header>

      <p className="mp-search-section">검색 결과</p>

      <div className="mp-search-scroll">
        {matches.length > 0 ? (
          matches.map((p) => (
            <button
              key={p.name}
              type="button"
              className="mp-search-row"
              onClick={() => onSelect(p)}
            >
              <span className="mp-search-icon" aria-hidden="true">
                📍
              </span>
              <span className="mp-search-body">
                <span className="mp-search-name">{p.name}</span>
                <span className="mp-search-addr">
                  {p.address} · {p.dist}
                </span>
              </span>
            </button>
          ))
        ) : (
          <p className="mp-search-empty">검색 결과가 없어요</p>
        )}

        <div className="mp-search-divider" />

        <p className="mp-search-section">또는</p>
        <button type="button" className="mp-search-maprow" onClick={onClose}>
          <span className="mp-search-icon" aria-hidden="true">
            🗺️
          </span>
          <span className="mp-search-body">
            <span className="mp-search-name">지도에서 직접 선택</span>
            <span className="mp-search-addr">검색되지 않는 곳도 등록 가능</span>
          </span>
        </button>
      </div>
    </div>
  )
}

function AddStorePanel({ open, onClose, searchResults, onSave }) {
  const [rating, setRating] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [oneLiner, setOneLiner] = useState('')
  const [query, setQuery] = useState('')

  const resetForm = () => {
    setRating(0)
    setSearchOpen(false)
    setSelectedPlace(null)
    setOneLiner('')
    setQuery('')
  }

  const closePanel = () => {
    resetForm()
    onClose()
  }

  const openSearch = () => {
    setQuery('')
    setSearchOpen(true)
  }

  const selectPlace = (p) => {
    setSelectedPlace(p)
    setSearchOpen(false)
  }

  const handleSave = () => {
    if (!selectedPlace) {
      return
    }
    onSave({
      name: selectedPlace.name,
      address: selectedPlace.address,
      location: selectedPlace.location,
      vote: RATING_VOTES[rating],
      oneLiner: oneLiner.trim(),
    })
    closePanel()
  }

  return (
    <div className={`mp-addstore${open ? ' mp-addstore--open' : ''}`}>
      <header className="mp-as-header">
        <button
          type="button"
          className="mp-detail-back"
          onClick={closePanel}
          aria-label="닫기"
        >
          ×
        </button>
        <span className="mp-as-title">가게 추가</span>
      </header>

      <div className="mp-as-content">
        <div className="mp-as-field">
          <p className="mp-as-label">위치</p>
          <div className="mp-map">
            <span className="mp-map-pin" />
          </div>
          <button
            type="button"
            className={`mp-as-namebtn${selectedPlace ? ' mp-as-namebtn--filled' : ''}`}
            onClick={openSearch}
          >
            {selectedPlace ? selectedPlace.name : '가게명 입력'}
          </button>
        </div>

        <div className="mp-as-field mp-as-field--rating">
          <p className="mp-as-label">이 가게는?</p>
          <div className="mp-as-ratings">
            {STORE_RATINGS.map((r, i) => (
              <button
                key={r}
                type="button"
                aria-pressed={rating === i}
                className={`mp-as-rating${rating === i ? ' mp-as-rating--active' : ''}`}
                onClick={() => setRating(i)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="mp-as-field mp-as-field--review">
          <p className="mp-as-label">
            한줄평 <span className="mp-as-label-sub">선택</span>
          </p>
          <textarea
            className="mp-as-textarea"
            placeholder="짧게 한 줄"
            aria-label="한줄평"
            value={oneLiner}
            onChange={(event) => setOneLiner(event.target.value)}
          />
        </div>

        <div className="mp-as-field">
          <p className="mp-as-label">
            사진 <span className="mp-as-label-sub">선택 · 1장</span>
          </p>
          <button type="button" className="mp-as-photo" aria-label="사진 추가">
            +
          </button>
        </div>
      </div>

      <footer className="mp-as-footer">
        <button
          type="button"
          className="mp-as-submit"
          disabled={!selectedPlace}
          onClick={handleSave}
        >
          저장하기
        </button>
      </footer>

      <StoreSearch
        open={searchOpen}
        query={query}
        onQuery={setQuery}
        onSelect={selectPlace}
        onClose={() => setSearchOpen(false)}
        results={searchResults}
      />
    </div>
  )
}

function ReviewPanel({
  open,
  restaurant,
  currentReview,
  onClose,
  onDelete,
  onSave,
}) {
  const closePanel = () => {
    onClose()
  }

  const handleDelete = () => {
    onDelete()
    closePanel()
  }

  if (!restaurant) {
    return null
  }

  const formKey = `${restaurant.id}-${currentReview?.id ?? 'new'}-${open ? 'open' : 'closed'}`

  return (
    <div className={`mp-review${open ? ' mp-review--open' : ''}`}>
      <button
        type="button"
        className="mp-review-backdrop"
        onClick={closePanel}
        aria-label="내 평가 닫기"
      />

      <section
        className="mp-review-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-title"
      >
        <div className="mp-review-handle" aria-hidden="true" />
        <header className="mp-review-header">
          <div className="mp-review-heading">
            <span id="review-title" className="mp-review-title">
              내 평가 수정
            </span>
            <span className="mp-review-subtitle">{restaurant.name}</span>
          </div>
        </header>

        <ReviewForm
          key={formKey}
          currentReview={currentReview}
          onDelete={handleDelete}
          onSave={(form) => {
            onSave(form)
            closePanel()
          }}
        />
      </section>
    </div>
  )
}

function ReviewForm({ currentReview, onDelete, onSave }) {
  const initialRating = Math.max(
    0,
    RATING_VOTES.indexOf(currentReview?.vote ?? RATING_VOTES[0]),
  )
  const [rating, setRating] = useState(initialRating)
  const [oneLiner, setOneLiner] = useState(currentReview?.oneLiner ?? '')

  const handleSave = () => {
    onSave({
      vote: RATING_VOTES[rating],
      oneLiner: oneLiner.trim(),
    })
  }

  return (
    <>
      <div className="mp-review-content">
        <div className="mp-review-field">
          <p className="mp-as-label">평가</p>
          <div className="mp-review-ratings">
            {STORE_RATINGS.map((r, i) => (
              <button
                key={r}
                type="button"
                aria-pressed={rating === i}
                className={`mp-review-rating${rating === i ? ' mp-review-rating--active' : ''}`}
                onClick={() => setRating(i)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="mp-review-field">
          <p className="mp-as-label">
            한줄평 <span className="mp-as-label-sub">선택</span>
          </p>
          <textarea
            className="mp-review-textarea"
            placeholder=""
            aria-label="한줄평"
            value={oneLiner}
            onChange={(event) => setOneLiner(event.target.value)}
          />
        </div>
      </div>

      <footer className="mp-review-footer">
        <button
          type="button"
          className="mp-review-delete"
          disabled={!currentReview}
          onClick={onDelete}
        >
          삭제
        </button>
        <button type="button" className="mp-review-submit" onClick={handleSave}>
          저장
        </button>
      </footer>
    </>
  )
}

function RestaurantDetail({
  open,
  restaurant,
  reviewButtonLabel,
  onClose,
  getDetail,
  onReview,
}) {
  if (!restaurant) {
    return null
  }

  const { submeta, counts, total, reviews } = getDetail(restaurant.id)
  const width = (n) => (total ? `${(n / total) * 100}%` : '0%')

  return (
    <div className={`mp-rd${open ? ' mp-rd--open' : ''}`}>
      <header className="mp-rd-header">
        <button
          type="button"
          className="mp-detail-back"
          onClick={onClose}
          aria-label="뒤로"
        >
          ‹
        </button>
        <span className="mp-rd-title">{restaurant.name}</span>
        <button type="button" className="mp-rd-more" aria-label="더보기">
          ⋯
        </button>
      </header>

      <div className="mp-rd-content">
        <div className="mp-rd-photo">사진</div>

        <div className="mp-rd-nameblock">
          <p className="mp-rd-name">{restaurant.name}</p>
          <p className="mp-rd-submeta">{submeta}</p>
        </div>

        <div className="mp-rd-rating">
          <p className="mp-rd-label">우리 그룹 평가</p>
          <div className="mp-rd-counts">
            <span className="mp-rd-count mp-rd-count--again">
              또 갈래 {counts.again}
            </span>
            <span className="mp-rd-count mp-rd-count--once">
              한 번 {counts.once}
            </span>
            <span className="mp-rd-count mp-rd-count--someday">
              언젠간 {counts.someday}
            </span>
          </div>
          <div className="mp-rd-bar">
            <span
              className="mp-rd-bar-again"
              style={{ width: width(counts.again) }}
            />
            <span
              className="mp-rd-bar-once"
              style={{ width: width(counts.once) }}
            />
            <span
              className="mp-rd-bar-someday"
              style={{ width: width(counts.someday) }}
            />
          </div>
        </div>

        <div className="mp-rd-reviews">
          <p className="mp-rd-label">멤버 평가 ({total})</p>
          {reviews.map((rev) => (
            <div key={rev.name} className="mp-rd-review">
              <span
                className="mp-rd-avatar"
                style={{ background: rev.avatar }}
                aria-hidden="true"
              />
              <div className="mp-rd-review-body">
                <div className="mp-rd-review-head">
                  <span className="mp-rd-review-name">{rev.name}</span>
                  <span
                    className={`mp-rd-badge${rev.hot ? ' mp-rd-badge--hot' : ''}`}
                  >
                    {rev.rating}
                  </span>
                </div>
                <p className="mp-rd-comment">{rev.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="mp-rd-footer">
        <button type="button" className="mp-rd-submit" onClick={onReview}>
          {reviewButtonLabel}
        </button>
      </footer>
    </div>
  )
}

function MainPage({ data, addPlace, saveReview, deleteReview, onCreateGroup }) {
  const groupViews = useMemo(() => getGroupViews(data), [data])
  const currentGroupRestaurants = useMemo(
    () => getCurrentGroupRestaurants(data),
    [data],
  )
  const searchResults = useMemo(() => getSearchResults(data), [data])

  const [activeTab, setActiveTab] = useState(0)
  const [activeChip, setActiveChip] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [view, setView] = useState('main')
  const [selectedGroup, setSelectedGroup] = useState(0)
  const [detailChip, setDetailChip] = useState(0)
  const [egTab, setEgTab] = useState(0)
  const [addStoreOpen, setAddStoreOpen] = useState(false)
  const [addStoreGroupId, setAddStoreGroupId] = useState(
    data.session.currentGroupId,
  )
  const [detailView, setDetailView] = useState('list')
  const [restaurantOpen, setRestaurantOpen] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState(
    currentGroupRestaurants[0],
  )

  const openDetail = (i) => {
    setSelectedGroup(i)
    setDetailChip(0)
    setDetailView('list')
    setEgTab(0)
    setMenuOpen(false)
    setView('detail')
  }

  const openAddStore = (groupId) => {
    setAddStoreGroupId(groupId)
    setAddStoreOpen(true)
  }

  const openRestaurant = (r) => {
    setSelectedRestaurant(r)
    setRestaurantOpen(true)
  }

  const handleSavePlace = (form) => {
    addPlace({ groupId: addStoreGroupId, ...form })
  }

  const currentUserReview = useMemo(
    () => {
      if (!selectedRestaurant) {
        return undefined
      }

      return data.reviews.find(
        (r) =>
          r.placeId === selectedRestaurant.id &&
          r.userId === data.session.currentUserId,
      )
    },
    [data.reviews, data.session.currentUserId, selectedRestaurant],
  )

  const handleSaveReview = (form) => {
    if (!selectedRestaurant) {
      return
    }
    saveReview({ placeId: selectedRestaurant.id, ...form })
  }

  const handleDeleteReview = () => {
    if (!selectedRestaurant) {
      return
    }
    deleteReview({ placeId: selectedRestaurant.id })
  }

  const group = groupViews[selectedGroup]
  const isEmptyGroup = group.restaurants.length === 0

  return (
    <div className="main-page">
      <header className="mp-header">
        <span className="mp-logo">로고 어쩌구</span>
        <button type="button" className="mp-settings" aria-label="설정">
          ⚙
        </button>
      </header>

      <div className="mp-content">
        <div
          className="mp-tabs"
          style={{ '--main-tab-index': activeTab }}
        >
          {MAIN_TABS.map((tab, i) => (
            <button
              key={tab}
              type="button"
              aria-pressed={activeTab === i}
              className={`mp-tab${activeTab === i ? ' mp-tab--active' : ''}`}
              onClick={() => {
                setActiveTab(i)
                setMenuOpen(false)
              }}
            >
              {tab}
            </button>
          ))}
          <span className="mp-tab-indicator" aria-hidden="true" />
        </div>

        {activeTab === 0 ? (
          <div className="mp-restaurant-tab">
            <Chips active={activeChip} onSelect={setActiveChip} />

            <section className="mp-map-section">
              <p className="mp-map-label">내 지도</p>
              <div className="mp-map">
                <span className="mp-map-pin" />
              </div>
            </section>

            <RestaurantSection
              items={currentGroupRestaurants}
              onRegister={() => openAddStore(data.session.currentGroupId)}
              onSelect={openRestaurant}
            />
          </div>
        ) : (
          <div className="mp-group-tab">
            <div className="mp-group-list">
              <p className="mp-group-label">가입한 그룹</p>
              {groupViews.map((g, i) => (
                <button
                  key={g.name}
                  type="button"
                  className="mp-group-card"
                  onClick={() => openDetail(i)}
                >
                  <span className="mp-group-icon" aria-hidden="true">
                    {g.icon}
                  </span>
                  <span className="mp-group-info">
                    <span className="mp-group-name">{g.name}</span>
                    <span className="mp-group-meta">{g.meta}</span>
                  </span>
                  <span className="mp-group-chevron" aria-hidden="true">
                    ›
                  </span>
                </button>
              ))}
            </div>

            {menuOpen && (
              <div
                className="mp-fab-backdrop"
                onClick={() => setMenuOpen(false)}
              />
            )}

            <div className="mp-fab-wrap">
              <div
                className={`mp-fab-menu${menuOpen ? ' mp-fab-menu--open' : ''}`}
              >
                <button
                  type="button"
                  className="mp-fab-menu-item"
                  onClick={() => {
                    setMenuOpen(false)
                    onCreateGroup?.()
                  }}
                >
                  새 그룹 만들기
                </button>
                <div className="mp-fab-menu-divider" />
                <button
                  type="button"
                  className="mp-fab-menu-item"
                  onClick={() => setMenuOpen(false)}
                >
                  초대 코드로 입장하기
                </button>
              </div>

              <button
                type="button"
                className={`mp-fab${menuOpen ? ' mp-fab--open' : ''}`}
                aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
              >
                <svg
                  className="mp-fab-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={`mp-detail${view === 'detail' ? ' mp-detail--open' : ''}`}>
        {isEmptyGroup ? (
          <EmptyGroupDetail
            group={group}
            tab={egTab}
            onTab={setEgTab}
            onBack={() => setView('main')}
            onAddStore={() => openAddStore(group.id)}
          />
        ) : (
          <GroupDetail
            group={group}
            chipState={detailChip}
            onChip={setDetailChip}
            onBack={() => setView('main')}
            onRegister={() => openAddStore(group.id)}
            onSelectRestaurant={openRestaurant}
            view={detailView}
            onView={setDetailView}
          />
        )}
      </div>

      <AddStorePanel
        open={addStoreOpen}
        onClose={() => setAddStoreOpen(false)}
        searchResults={searchResults}
        onSave={handleSavePlace}
      />

      <RestaurantDetail
        open={restaurantOpen}
        restaurant={selectedRestaurant}
        reviewButtonLabel={
          currentUserReview ? '내 평가 수정' : '내 평가 남기기'
        }
        onClose={() => setRestaurantOpen(false)}
        getDetail={(id) => getRestaurantDetail(data, id)}
        onReview={() => setReviewOpen(true)}
      />

      <ReviewPanel
        open={reviewOpen}
        restaurant={selectedRestaurant}
        currentReview={currentUserReview}
        onClose={() => setReviewOpen(false)}
        onDelete={handleDeleteReview}
        onSave={handleSaveReview}
      />
    </div>
  )
}

export default MainPage
