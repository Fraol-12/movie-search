import { useState, useEffect } from 'react'
import { useDebounce } from './hooks/useDebounce'
import { searchMovies } from './services/tmdb'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const debouncedTerm = useDebounce(searchTerm, 600)

  useEffect(() => {
    if (!debouncedTerm.trim()) {
      setMovies([])
      return
    }

    setLoading(true)
    setError(null)

    searchMovies(debouncedTerm, 1)
      .then(data => {
        setMovies(data.results)
      })
      .catch(err => {
        console.error(err)
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [debouncedTerm])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* TMDB Header */}
      <header className="bg-gradient-to-r from-teal-500 to-blue-600 py-6 shadow-lg">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <h1 className="text-4xl font-bold">TMDB</h1>
          <span className="text-lg opacity-90">Movie Search</span>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for movies, TV shows, people..."
          className="w-full max-w-3xl mx-auto block px-10 py-6 text-2xl rounded-full bg-gray-800 bg-gray-900/90 backdrop-blur border border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-teal-500 focus:border-transparent transition-all"
        />

        {loading && (
          <p className="text-center mt-20 text-3xl text-gray-400 animate-pulse">
            Loading movies...
          </p>
        )}

        {error && (
          <p className="text-center mt-20 text-2xl text-red-400">
            Error: {error}
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 mt-12">
          {movies.map(movie => (
            <div
              key={movie.id}
              className="group cursor-pointer transform hover:scale-105 transition duration-300"
            >
              <div className="relative overflow-hidden rounded-lg shadow-2xl">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : 'https://via.placeholder.com/500x750?text=No+Image'
                  }
                  alt={movie.title}
                  className="w-full rounded-lg"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <p className="font-bold text-lg line-clamp-2">{movie.title}</p>
                    <p className="text-sm opacity-90">
                      {movie.release_date?.split('-')[0] || 'N/A'}
                    </p>
                    <p className="text-yellow-400 font-medium">
                      {movie.vote_average?.toFixed(1) || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && movies.length === 0 && searchTerm && (
          <p className="text-center mt-32 text-3xl text-gray-500">
            No results found for "{searchTerm}"
          </p>
        )}
      </div>
    </div>
  )
}

export default App