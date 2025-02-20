import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import PropTypes from 'prop-types'
import { LOGIN } from '../graphql/mutations'

const LoginForm = ({ show, setToken, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login, result] = useMutation(LOGIN)

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
    }
  }, [result.data, setToken])

  const submit = async (event) => {
    event.preventDefault()

    await login({
      variables: {
        username,
        password,
      },
    })
    setPage('add')
  }

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>login</h2>
      <form onSubmit={submit}>
        <div>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  show: PropTypes.bool,
  setToken: PropTypes.func,
  setPage: PropTypes.func,
}

export default LoginForm
