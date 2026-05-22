import { useEffect, useRef, useState } from 'react'

const SDK_URL_BASE = 'https://oapi.map.naver.com/openapi/v3/maps.js'
let sdkPromise = null

function loadSdk(clientId) {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('window unavailable'))
  }
  if (window.naver?.maps) {
    return Promise.resolve(window.naver)
  }
  if (sdkPromise) {
    return sdkPromise
  }
  sdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `${SDK_URL_BASE}?ncpKeyId=${encodeURIComponent(clientId)}`
    script.async = true
    script.onload = () => resolve(window.naver)
    script.onerror = () => {
      sdkPromise = null
      reject(new Error('네이버 지도 SDK 로드 실패'))
    }
    document.head.appendChild(script)
  })
  return sdkPromise
}

/* places 의 id+좌표 모음 키 — reference 가 바뀌어도 내용이 같으면 같은 키. */
function placesKey(places) {
  return places
    .map((p) => `${p.id ?? p.name}:${p.location.lat},${p.location.lng}`)
    .join('|')
}

function NaverMap({ center, zoom = 15, places = [] }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const [mapReady, setMapReady] = useState(false)
  const key = placesKey(places)

  useEffect(() => {
    const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID
    if (!clientId || clientId === 'your_ncp_key_id_here') {
      console.warn('VITE_NAVER_MAP_CLIENT_ID 가 설정되지 않았습니다.')
      return
    }

    let cancelled = false
    const t0 = performance.now()
    console.log('[NaverMap] mount, requesting SDK')

    loadSdk(clientId).then((naver) => {
      if (cancelled || !containerRef.current || mapRef.current) return
      const tSdk = performance.now()
      console.log(`[NaverMap] SDK ready (+${(tSdk - t0).toFixed(0)}ms), creating map`)
      const map = new naver.maps.Map(containerRef.current, {
        center: new naver.maps.LatLng(center.lat, center.lng),
        zoom,
        scaleControl: false,
      })
      mapRef.current = map
      setMapReady(true)
      naver.maps.Event.once(map, 'init_stylemap', () => {
        const tTiles = performance.now()
        console.log(`[NaverMap] tiles ready (+${(tTiles - t0).toFixed(0)}ms)`)
      })
    })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const naver = window.naver
    if (!map || !naver?.maps) return
    /* places 가 있으면 마커 effect 의 fitBounds 가 권위 — 충돌 방지 */
    if (places.length > 0) return

    map.setCenter(new naver.maps.LatLng(center.lat, center.lng))
    map.setZoom(zoom)
  }, [center.lat, center.lng, zoom, places.length])

  useEffect(() => {
    const map = mapRef.current
    const naver = window.naver
    if (!map || !naver?.maps || !mapReady) return

    console.log(`[NaverMap] placing ${places.length} markers`)
    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = places.map(
      (p) =>
        new naver.maps.Marker({
          position: new naver.maps.LatLng(p.location.lat, p.location.lng),
          map,
          title: p.name,
          icon: {
            content: '<div class="naver-map-pin-marker"><span class="mp-map-pin"></span></div>',
            anchor: new naver.maps.Point(9, 9),
          },
        }),
    )

    /* 마커 2개 이상이면 모두 보이게 fitBounds. POI 라벨이 보이는 줌 16~17 캡. */
    if (places.length >= 2) {
      const bounds = new naver.maps.LatLngBounds(
        new naver.maps.LatLng(places[0].location.lat, places[0].location.lng),
        new naver.maps.LatLng(places[0].location.lat, places[0].location.lng),
      )
      places.forEach((p) =>
        bounds.extend(new naver.maps.LatLng(p.location.lat, p.location.lng)),
      )
      map.fitBounds(bounds, { top: 24, right: 24, bottom: 24, left: 24 })
      if (map.getZoom() > 17) map.setZoom(17)
    }

    return () => {
      markersRef.current.forEach((m) => m.setMap(null))
      markersRef.current = []
    }
  }, [key, mapReady])

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
  )
}

export default NaverMap
