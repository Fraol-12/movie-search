export async function searchMovies(query) {
    if (!query.trim()) return []

    const res = await fetch(
        `https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_API_KEY}&s=${encodeURIComponent(query)}`
    )

    const data = await res.json()

    if (data.Response === "False")
        throw new Error(data.Error || 'No movies found')

    return data.Search || []

}