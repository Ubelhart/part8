import PropTypes from 'prop-types'
import { useLazyQuery, useQuery } from '@apollo/client'
import { useState, useMemo } from 'react'
import { GET_BOOKS } from '../graphql/queries'

const Books = ({ show }) => {
  const [genre, setGenre] = useState(null)
  const { loading, error, data } = useQuery(GET_BOOKS)
  const [getBooks, result] = useLazyQuery(GET_BOOKS)

  const genres = useMemo(() => {
    if (data) {
      const allGenres = data.allBooks.reduce((acc, book) => {
        return acc.concat(book.genres)
      }, [])
      return [...new Set(allGenres)]
    }
    return []
  }, [data])

  if (!show) {
    return null
  }

  if (loading) return <p>loading...</p>
  if (error) return <p>error</p>

  const handleClick = async (genre) => {
    await getBooks({
      variables: { genre },
    })
    setGenre(genre)
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          {genre
            ? result.data?.allBooks.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>{a.author.name}</td>
                  <td>{a.published}</td>
                </tr>
              ))
            : data.allBooks.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>{a.author.name}</td>
                  <td>{a.published}</td>
                </tr>
              ))}
        </tbody>
      </table>

      <div>
        <button onClick={() => setGenre(null)}>All genres</button>
        {genres.map((g) => (
          <button key={g} onClick={() => handleClick(g)}>
            {g}
          </button>
        ))}
      </div>
    </div>
  )
}

Books.propTypes = {
  show: PropTypes.bool,
}

export default Books
