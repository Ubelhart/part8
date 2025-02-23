import { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import { useApolloClient, useSubscription } from '@apollo/client'
import { BOOK_ADDED } from './graphql/subscription'
import { GET_BOOKS } from './graphql/queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('library-user-token')
    setToken(token)
  }, [])

  const client = useApolloClient()

  const updateCacheWith = (addedBook, genres = [null]) => {
    const includeIn = (set, object) => set.map((b) => b.id).includes(object.id)

    genres.forEach((genre) => {
      const variables = genre ? { genre } : null
      const dataInStore = client.readQuery({
        query: GET_BOOKS,
        variables,
      })

      if (!includeIn(dataInStore.allBooks, addedBook)) {
        client.writeQuery({
          query: GET_BOOKS,
          variables,
          data: {
            allBooks: [...dataInStore.allBooks, addedBook],
          },
        })
      }
    })
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(`Book added: ${addedBook.title}`)
      updateCacheWith(addedBook)
    },
  })

  const logout = () => {
    setToken(null)
    localStorage.removeItem('library-user-token')
    client.resetStore()
    setPage('authors')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} updateCacheWith={updateCacheWith} />

      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        setPage={setPage}
      />
      <Recommendations show={page === 'recommend'} token={token} />
    </div>
  )
}

export default App
