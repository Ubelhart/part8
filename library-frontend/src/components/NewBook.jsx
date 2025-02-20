import { useState } from 'react'
import { useMutation } from '@apollo/client'
import PropTypes from 'prop-types'
import { GET_AUTHORS, GET_BOOKS, GET_BOOKS_BY_GENRE } from '../graphql/queries'
import { CREATE_BOOK } from '../graphql/mutations'

const NewBook = ({ show }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [
      {
        query: GET_AUTHORS,
      },
    ],
    update: (cache, response) => {
      cache.updateQuery(
        {
          query: GET_BOOKS,
        },
        ({ allBooks }) => {
          return {
            allBooks: allBooks.concat(response.data.addBook),
          }
        }
      )
      genres.forEach((g) => {
        cache.updateQuery(
          {
            query: GET_BOOKS_BY_GENRE,
            variables: {
              genre: g,
            },
          },
          (data) => {
            if (data) {
              return {
                allBooks: [...data.allBooks, response.data.addBook],
              }
            }
            return {
              allBooks: [response.data.addBook],
            }
          }
        )
      })
    },
  })

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    await createBook({
      variables: {
        book: {
          title,
          author,
          published: parseInt(published),
          genres,
        },
      },
    })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

NewBook.propTypes = {
  show: PropTypes.bool,
}

export default NewBook
