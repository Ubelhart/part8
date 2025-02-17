import { useState } from 'react'
import { useMutation, gql, useQuery } from '@apollo/client'
import PropTypes from 'prop-types'
import { GET_AUTHORS } from '../graphql/queries'

const SET_BORN_TO = gql`
  mutation setBornTo($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
      id
    }
  }
`

const SetBirthYear = () => {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')
  const [setBornTo] = useMutation(SET_BORN_TO)
  const { data, loading, error } = useQuery(GET_AUTHORS)

  if (loading) return <p>loading...</p>
  if (error) return <p>error</p>

  const handleSubmit = async (event) => {
    event.preventDefault()
    await setBornTo({
      variables: {
        name,
        setBornTo: parseInt(year),
      },
    })
  }

  const submit = async (event) => {
    event.preventDefault()
    await setBornTo({
      variables: {
        name,
        setBornTo: parseInt(year),
      },
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          born
          <input
            type="number"
            value={year}
            onChange={({ target }) => setYear(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
      {loading ? (
        <p>loading...</p>
      ) : (
        <form onSubmit={submit}>
          <select onChange={({ target }) => setName(target.value)}>
            <option value="">select author</option>
            {data.allAuthors.map((a) => (
              <option value={a.name} key={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={year}
            onChange={({ target }) => setYear(target.value)}
          />
          <button type="submit">update author</button>
        </form>
      )}
    </div>
  )
}

SetBirthYear.propTypes = {
  name: PropTypes.string,
  born: PropTypes.number,
}

export default SetBirthYear
