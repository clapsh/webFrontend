import { ACCESS_TOKEN_NAME } from '@/lib/api'
import { redirect } from 'react-router'

export async function guestOnly() {
  const token = localStorage.getItem(ACCESS_TOKEN_NAME)
  if (token) return redirect('/')
  return true
}
