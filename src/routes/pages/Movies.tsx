import axios from 'axios'
import { useState, useEffect } from 'react'
import {
  useInfiniteQuery,
  //useQueryClient,
  infiniteQueryOptions
} from '@tanstack/react-query'
import { Link, Outlet } from 'react-router'
import { useMovieStore } from '../../stores/movies'
import { useInView } from 'react-intersection-observer'
import Loader from '../../components/Loader'
export interface ResponseDataSuccess {
  Response: 'True'
  Search: Movie[]
  totalResults: string
}
export interface ResponseDataError {
  Response: 'False'
  Error: string
}
export type ResponseData = ResponseDataSuccess | ResponseDataError
export interface Movie {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

export default function Movies() {
  //const queryClient = useQueryClient()
  // const { searchText, setSearchText } = useMovieStore(s => s) // ❌ 잘못된 코드!
  const searchText = useMovieStore(s => s.searchText)
  const setSearchText = useMovieStore(s => s.setSearchText)
  const [inputText, setInputText] = useState(searchText)
  const { ref, inView } = useInView({
    rootMargin: '0px 0px 500px 0px'
  })
  const options = infiniteQueryOptions({
    queryKey: ['movies', searchText],
    queryFn: async ({ pageParam }) => {
      // await new Promise(resolve => setTimeout(resolve, 3000))
      const { data } = await axios.post<ResponseData>('/api/movie', {
        title: searchText,
        page: pageParam
      })
      if (data.Response === 'False') throw new Error(data.Error)
      return data
    },
    staleTime: 1000 * 60 * 5, // 캐싱하는 시간(ms)
    enabled: Boolean(searchText),
    placeholderData: prev => prev, // 깜빡이는 부분에 채워넣을 데이터
    getNextPageParam: (lastPage, pages) => {
      const maxPage = Math.ceil(Number(lastPage.totalResults) / 10)
      const currentPage = pages.length
      if (currentPage < maxPage) return currentPage + 1
      return undefined
    },
    initialPageParam: 1,
    select: data => data.pages.flatMap(page => page.Search)
  })
  const {
    data: movies,
    fetchNextPage,
    isFetching,
    hasNextPage
  } = useInfiniteQuery(options)

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage])

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
          {movies?.map(movie => {
            return (
              <li key={movie.imdbID}>
                <Link to={`/movies/${movie.imdbID}`}>
                  {movie.Title}({movie.Year})
                </Link>
              </li>
            )
          })}
        </ul>
        {isFetching && <Loader className="relative" />}
        <div
          ref={ref}
          style={{
            display: isFetching || !hasNextPage ? 'none' : 'block',
            height: '10px'
          }}></div>
      </div>
      <Outlet />
    </>
  )
}
