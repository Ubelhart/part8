import { gql } from '@apollo/client'
import { BOOK_DETAILS, AUTHOR_DETAILS } from './fragments'

export const CREATE_BOOK = gql`
  mutation createBook($book: BookInput!) {
    addBook(book: $book) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
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
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
`
