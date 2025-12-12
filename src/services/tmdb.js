// src/services/tmdb.js
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

export async function searchMovies(query, page = 1) {
  if (!query.trim()) return { results: [], total_pages: 0 }

  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
  )

  if (!res.ok) throw new Error('Failed to fetch from TMDB')

  const data = await res.json()
  return {
    results: data.results || [],
    total_pages: data.total_pages || 1
  }
}