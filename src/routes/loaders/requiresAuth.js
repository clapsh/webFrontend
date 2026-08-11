import api, { ACCESS_TOKEN_NAME } from '@/lib/api'
import { redirect } from 'react-router'

async function verifyToken() {
  const token = localStorage.getItem(ACCESS_TOKEN_NAME)
  // 토큰 정보가 있으면, 사용자 정보를 반환합니다.
  if (token) return true
  return null
  
  // 또는 API로 Token 유효성을 확인합니다.
  try {
    await api.post('/auth/me')
	  return true
  } catch (error) {
	  return null
  }
}

// 페이지 접근 시 호출되는 로더(Loader) 함수!
export async function requiresAuth({ request }: { request: Request }) {
  const auth = await verifyToken()
  if (!auth) {
    const url = new URL(request.url) // 요청 페이지의 URL 정보를 가져옵니다.
    const redirectTo = url.pathname + url.search // 요청 페이지의 경로 + 쿼리스트링
    return redirect(`/signin?redirectTo=${encodeURIComponent(redirectTo)}`) // 돌아갈 페이지 정보(`redirectTo`)와 함께 로그인 페이지로 이동합니다.
  }
  return null
}