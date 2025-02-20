import { useState } from 'react'
import { useMutation } from '@apollo/client'
import PropTypes from 'prop-types'
import { GET_AUTHORS } from '../graphql/queries'
import { SET_BORN_TO } from '../graphql/mutations'

const SetBirthYear = ({ authors }) => {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')
  const [setBornTo] = useMutation(SET_BORN_TO, {
    refetchQueries: [
      {
        query: GET_AUTHORS,
      },
    ],
  })

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
      <form onSubmit={submit}>
        <select onChange={({ target }) => setName(target.value)}>
          <option value="">select author</option>
          {authors.map((a) => (
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
    </div>
  )
}

SetBirthYear.propTypes = {
  authors: PropTypes.array,
}

export default SetBirthYear
