import { useState } from 'react'
import api, { ACCESS_TOKEN_NAME } from '../../lib/api'
import { useNavigate, useSearchParams } from 'react-router'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const redirectTo = searchParams.get('redirectTo')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    console.log(email, password)
    const {
      data: { token }
    } = await api.post('/auth/signin', {
      email,
      password
    })
    localStorage.setItem(ACCESS_TOKEN_NAME, token)
    setIsLoading(false)
    navigate(redirectTo || '/')
  }

  return (
    <form
      className="flex max-w-[400px] flex-col gap-2"
      onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="이메일을 입력해주세요."
        value={email}
        onChange={event => setEmail(event.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호를 입력해주세요."
        value={password}
        onChange={event => setPassword(event.target.value)}
      />
      <button
        type="submit"
        disabled={isLoading}>
        {isLoading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  )
}
