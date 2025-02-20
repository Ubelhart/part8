import { gql } from '@apollo/client'

export const CREATE_BOOK = gql`
  mutation createBook($book: BookInput!) {
    addBook(book: $book) {
      title
      published
      author {
        name
        id
      }
      id
      genres
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

export const SET_BORN_TO = gql`
  mutation setBornTo($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
      id
    }
  }
`
