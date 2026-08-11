import { create } from 'zustand'
import { combine } from 'zustand/middleware'
export const useMovieStore = create(
  combine(
    {
      searchText: ''
    },
    set => {
      return {
        setSearchText: (searchText: string) => {
          set({ searchText })
        }
      }
    }
  )
)
