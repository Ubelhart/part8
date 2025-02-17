import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'
import { GET_BOOKS } from '../graphql/queries'

const Books = (props) => {
  const { loading, error, data } = useQuery(GET_BOOKS)
  if (!props.show) {
    return null
  }

  if (loading) return <p>loading...</p>
  if (error) return <p>error</p>
  const books = data.allBooks

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

Books.propTypes = {
  show: PropTypes.bool,
}

export default Books
