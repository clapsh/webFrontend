import api from '../../lib/api'
import { redirect } from 'react-router'
async function verifyToken() {
  try {
    await api.post('/auth/me')
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function requiresAuth({ request }: { request: Request }) {
  //인증 여부 확인
  const isVerified = await verifyToken()
  if (isVerified) return null
  const url = new URL(request.url)
  return redirect(
    `/signin?redirectTo=${encodeURIComponent(url.pathname + url.search)}`
  )
}
