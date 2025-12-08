import { useState, useEffect } from 'react'
import { useDebounce } from './hooks/useDebounce'
import { searchMovies } from './services/omdb'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)


  const debouncedSearchTerm = useDebounce(searchTerm, 600)

  useEffect(() => {
    if (!debouncedSearchTerm) {
      setMovies([])
      return
    }
    setLoading(true)
    setError(null)

    searchMovies(debouncedSearchTerm)
    .then(setMovies)
    .catch(err => setError(err.message))
    .finally(() => setLoading(false))
  }, [debouncedSearchTerm])

return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-6xl md:text-8xl font-bold text-center mb-16">Movie Search</h1>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a movie..."
          className="w-full max-w-2xl mx-auto block px-8 py-5 text-xl rounded-full bg-white/10 backdrop-blur-md border border-white/20 placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-purple-500"
        />

        {loading && <p className="text-center mt-12 text-2xl">Loading...</p>}
        {error && <p className="text-center mt-12 text-red-400 text-xl">{error}</p>}

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-12">
          {movies.map(movie => (
            <div key={movie.imdbID} className="p-4">
              <img
                src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}
                alt={movie.Title}
                className="rounded-lg shadow-2xl hover:scale-105 transition"
              />
              <p className="text-center mt-3 text-sm font-medium line-clamp-2">{movie.Title}</p>
              <p className="text-center text-xs text-gray-400">{movie.Year}</p>
            </div>
          ))}
        </div>

        {!loading && movies.length === 0 && searchTerm && (
          <p className="text-center mt-20 text-xl text-gray-400">No movies found</p>
        )}
      </div>
    </div>
  )
}

export default App