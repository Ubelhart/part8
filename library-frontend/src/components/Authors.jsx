import { useQuery } from '@apollo/client'
import PropTypes from 'prop-types'
import { GET_AUTHORS } from '../graphql/queries'
import SetBirthYear from './SetBirthYear'

const Authors = ({ show }) => {
  const { loading, error, data } = useQuery(GET_AUTHORS)

  if (!show) {
    return null
  }

  if (loading) return <p>loading...</p>
  if (error) return <p>error</p>

  return (
    <div>
      <h2>authors</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>born</th>
          </tr>
        </thead>
        <tbody>
          {data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SetBirthYear authors={data.allAuthors} />
    </div>
  )
}

Authors.propTypes = {
  show: PropTypes.bool,
}

export default Authors
