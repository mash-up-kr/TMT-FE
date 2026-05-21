import { useEffect, useState } from 'react'
import CreateNewGroupPage from './pages/create-new-group/CreateNewGroupPage.jsx'
import FirstEntryPage from './pages/first-entry/FirstEntryPage.jsx'
import InviteCodePage from './pages/invite-code/InviteCodePage.jsx'
import MainPage from './pages/main/MainPage.jsx'
import { GROUPS, PLACES, REVIEWS, SESSION, USERS } from './shared/mockData.js'

const routes = {
  entry: '/',
  main: '/main',
  createGroup: '/groups/new',
  invite: '/invite',
}

function currentPath() {
  return window.location.pathname || routes.entry
}

function makeId(prefix) {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`
}

function App() {
  const [path, setPath] = useState(currentPath)
  const [data, setData] = useState(() => ({
    users: USERS,
    groups: GROUPS,
    places: PLACES,
    reviews: REVIEWS,
    session: SESSION,
  }))

  useEffect(() => {
    const handlePopState = () => setPath(currentPath())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function navigate(nextPath) {
    if (nextPath === currentPath()) {
      return
    }

    window.history.pushState({}, '', nextPath)
    setPath(nextPath)
  }

  /* 가게 추가 — 새 Place + 현재 유저의 Review 한 건을 생성 */
  function addPlace({ groupId, name, address, location, vote, oneLiner }) {
    setData((prev) => {
      const placeId = makeId('p')
      const now = new Date().toISOString()
      const place = {
        id: placeId,
        groupId,
        name,
        address,
        location,
        category: 'ETC',
        createdBy: prev.session.currentUserId,
        createdAt: now,
      }
      const review = {
        id: makeId('r'),
        placeId,
        userId: prev.session.currentUserId,
        vote,
        oneLiner,
        photos: [],
        createdAt: now,
      }
      return {
        ...prev,
        places: [...prev.places, place],
        reviews: [...prev.reviews, review],
      }
    })
  }

  if (path === routes.main) {
    return (
      <MainPage
        data={data}
        addPlace={addPlace}
        onCreateGroup={() => navigate(routes.createGroup)}
      />
    )
  }

  if (path === routes.createGroup) {
    return (
      <CreateNewGroupPage
        onBack={() => navigate(routes.main)}
        onCreated={() => navigate(routes.main)}
      />
    )
  }

  if (path === routes.invite) {
    return (
      <InviteCodePage
        onBack={() => navigate(routes.entry)}
        onSubmit={() => navigate(routes.main)}
      />
    )
  }

  return (
    <FirstEntryPage
      data={data}
      onStart={() => navigate(routes.main)}
      onCreateGroup={() => navigate(routes.createGroup)}
      onInviteCode={() => navigate(routes.invite)}
    />
  )
}

export default App
