import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'
import { ME, GET_BOOKS } from '../graphql/queries'

const Recommendations = ({ show, token }) => {
  const { loading, error, data } = useQuery(ME, {
    skip: !token,
  })
  const {
    loading: loadingBooks,
    error: errorBooks,
    data: dataBooks,
  } = useQuery(GET_BOOKS, {
    variables: {
      genre: data?.me?.favoriteGenre,
    },
    skip: !data?.me?.favoriteGenre,
  })

  if (!show) {
    return null
  }

  if (loading || loadingBooks) return <p>loading...</p>
  if (error || errorBooks) return <p>error</p>

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <b>{data?.me?.favoriteGenre}</b>
      </p>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          {dataBooks?.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

Recommendations.propTypes = {
  show: PropTypes.bool,
  token: PropTypes.string,
}

export default Recommendations
