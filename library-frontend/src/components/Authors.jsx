import { useQuery } from '@apollo/client'
import PropTypes from 'prop-types'
import { GET_AUTHORS } from '../graphql/queries'
import SetBirthYear from './SetBirthYear'

const Authors = (props) => {
  const { loading, error, data } = useQuery(GET_AUTHORS)

  if (!props.show) {
    return null
  }

  if (loading) return <p>loading...</p>

  if (error) return <p>error</p>
  const authors = data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SetBirthYear name="Robert Martin" born={1952} />
    </div>
  )
}

Authors.propTypes = {
  show: PropTypes.bool,
}

export default Authors
