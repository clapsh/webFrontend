import axios from 'axios'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, Outlet } from 'react-router'
export interface ResponseData {
  Search: Movie[]
  totalResults: string
  Response: string
}
export interface Movie {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

export default function Movies() {
  const [searchText, setSearchText] = useState('')
  const [inputText, setInputText] = useState('')
  const { data: movies = [] } = useQuery({
    queryKey: ['movies', searchText],
    queryFn: async () => {
      const { data } = await axios.get<ResponseData>(
        `https://omdbapi.com?apikey=9d38c929&s=${searchText}`
      )
      return data.Search
    },
    staleTime: 1000 * 60 * 60 * 24, // 캐싱하는 시간(ms)
    enabled: Boolean(searchText) // searchText가 있을 때만 쿼리 실행
  })

  function fetchMovies() {
    setSearchText(inputText)
  }

  return (
    <>
      <div>
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') fetchMovies()
          }}
        />
        <button onClick={() => fetchMovies()}>검색!</button>
      </div>
      <div>
        <ul>
          {movies.map(movie => {
            return (
              <li key={movie.imdbID}>
                <Link to={`/movies/${movie.imdbID}`}>{movie.Title}</Link>
              </li>
            )
          })}
        </ul>
      </div>
      <Outlet />
    </>
  )
}
