import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

interface Todo {
  id: string // 할 일 ID
  order: number // 할 일 순서
  title: string // 할 일 제목
  done: boolean // 할 일 완료 여부
  createdAt: string // 할 일 생성일
  updatedAt: string // 할 일 수정일
}

const api = axios.create({
  baseURL: 'https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos',
  headers: {
    'content-type': 'application/json',
    apikey: 'KDT8_bcAWVpD8',
    username: 'KDT8_ParkYoungWoong'
  }
})

export default function Todos() {
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const { data: todos = [] } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const { data } = await api.get<Todo[]>('/')
      return data
    }
  })

  // try {
  //   await Promise.all([mutationFn(), onMutate()])
  //   onSuccess()
  // } catch (error) {
  //   onError()
  // } finally {
  //   onSettled()
  // }

  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      if (!title.trim()) return
      const { data } = await api.post('/', { title })
      return data
    },
    onMutate: () => {},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: () => {},
    onSettled: () => {}
  })

  return (
    <>
      <div>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => {
            if (e.nativeEvent.isComposing) return
            if (e.key === 'Enter') mutateAsync()
          }}
        />
        <button
          onClick={() => {
            mutateAsync()
          }}>
          추가
        </button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </>
  )
}
